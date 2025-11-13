import os
import csv
from flask import Flask, render_template, request, redirect, url_for, jsonify

BASE_DIR = os.path.dirname(os.path.abspath(__file__))             
ROOT_DIR = os.path.dirname(BASE_DIR)                              
TEMPLATE_DIR = os.path.join(ROOT_DIR, "templates")                
STATIC_DIR = os.path.join(ROOT_DIR, "static")                     

app = Flask(
    __name__,
    template_folder=TEMPLATE_DIR,
    static_folder=STATIC_DIR
)
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "GET":
        return render_template("login.html")

    email = request.form.get("email")
    senha = request.form.get("password")

    if email and senha:
        return redirect(url_for("dashboard"))

    return "Login inválido — coloque sua lógica aqui."


@app.route("/cadastro")
def cadastro():
    return render_template("cadastro.html")


@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")


@app.route('/dados-vendas')
def dados_vendas():
    dados = []
    csv_path = os.path.join(BASE_DIR, "dados_vendas.csv") 

    if not os.path.exists(csv_path):
        return jsonify([])

    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)

        for row in reader:
            quantidade = int(row['quantidade'])
            preco_compra = float(row['preco_compra'])
            preco_venda = float(row['preco_venda'])
            valor_bruto = float(row['valor_bruto'])
            lucro = (preco_venda - preco_compra) * quantidade

            dados.append({
                "produto": row["produto"],
                "quantidade": quantidade,
                "preco_compra": preco_compra,
                "preco_venda": preco_venda,
                "valor_bruto": valor_bruto,
                "lucro": round(lucro, 2)
            })

    return jsonify(dados)


if __name__ == "__main__":
    app.run(debug=True)
