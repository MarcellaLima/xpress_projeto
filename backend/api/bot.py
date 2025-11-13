try:
    import importlib
    requests = importlib.import_module('requests')
except Exception:
    import urllib.request
    import urllib.error
    import json as _json

    class _SimpleResponse:
        def __init__(self, status, data):
            self.status_code = status
            self._data = data

        def raise_for_status(self):
            if not (200 <= self.status_code < 300):
                raise urllib.error.HTTPError(None, self.status_code, "HTTP Error", None, None)

        def json(self):
            return _json.loads(self._data.decode('utf-8')) if self._data else {}
    class requests:
        RequestException = Exception

        @staticmethod
        def post(url, headers=None, json=None):
            data = _json.dumps(json).encode('utf-8') if json is not None else None
            req = urllib.request.Request(url, data=data, headers=headers or {}, method='POST')
            try:
                with urllib.request.urlopen(req) as resp:
                    return _SimpleResponse(resp.status, resp.read())
            except urllib.error.HTTPError as e:
                body = e.read() if hasattr(e, 'read') else b''
                return _SimpleResponse(e.code if hasattr(e, 'code') else 500, body)
                return _SimpleResponse(e.code if hasattr(e, 'code') else 500, body)

from flask import Flask, request, jsonify

app = Flask(__name__)

DEESEEK_API_URL = 'https://platform.deepseek.com/api_keys'  
DEESEEK_API_KEY = ''  

@app.route('/api/bot', methods=['POST'])
def bot():
    dados = request.get_json()
    pergunta = dados.get('query')
    if not pergunta:
        return jsonify({'error': 'Query não fornecida'}), 400

    headers = {
        'Authorization': f'Bearer {DEESEEK_API_KEY}',
        'Content-Type': 'application/json'
    }
    payload = {'query': pergunta}

    try:
        resposta = requests.post(DEESEEK_API_URL, headers=headers, json=payload)
        resposta.raise_for_status()
        dados_resposta = resposta.json()
        return jsonify(dados_resposta) 
    except requests.RequestException as e:
        return jsonify({'error': 'Erro na API Deepseek', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
