import csv
import os

arquivo = 'dados_vendas.csv'

def inicializar_arquivo():
    if not os.path.exists(arquivo):
        with open(arquivo, mode='w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['produto', 'quantidade', 'preco_compra', 'preco_venda', 'valor_bruto'])

def inserir_dados():
    print("Informe os dados da venda:")
    produto = input("Produto: ")
    quantidade = int(input("Quantidade Vendida: "))
    preco_compra = float(input("Preço de Compra (unitário): "))
    preco_venda = float(input("Preço de Venda (unitário): "))
    valor_bruto = preco_venda * quantidade
    
    with open(arquivo, mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([produto, quantidade, preco_compra, preco_venda, valor_bruto])
    print("Dados inseridos com sucesso!\n")

def main():
    inicializar_arquivo()
    while True:
        inserir_dados()
        continuar = input("Continuar inserindo dados? (s/n): ").lower()
        if continuar != 's':
            break

if __name__ == '__main__':
    main()
