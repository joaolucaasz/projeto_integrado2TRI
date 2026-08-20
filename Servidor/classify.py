# Módulo: Classificação automática (IA)
# Projeto: Classificação do nível de satisfação
# Este script é acionado pelo servidor Node.js
# uma vez para cada leitura recebida

import sys
import os
import warnings
import joblib

# Ignora avisos não críticos do scikit-learn
warnings.filterwarnings("ignore")


def main():

    # Verifica se o Node.js passou um valor
    if len(sys.argv) < 2:
        print("ERRO: Nenhum valor de satisfação fornecido")
        return

    try:

        # Converte o argumento recebido para número
        # Exemplo: "5.0" -> 5.0

        valor = float(sys.argv[1])

    except ValueError:

        print("ERRO: Valor de satisfação inválido")
        return


    # Arquivo contendo o modelo KNN treinado

    caminho_modelo = "modelo_ia.pkl"


    # Verifica se o modelo existe

    if not os.path.exists(caminho_modelo):

        print(
            "ERRO: Arquivo modelo_ia.pkl não encontrado. "
            "Treine o modelo primeiro."
        )

        return


    # Carrega o modelo KNN

    modelo_ia = joblib.load(
        caminho_modelo
    )


    # ==================================================
    # CLASSIFICAÇÃO DO NÍVEL DE SATISFAÇÃO
    # ==================================================

    # Os valores previstos pelo modelo serão
    # convertidos para os nomes utilizados no sistema.

    MAPA_CLASSIFICACAO = {

        0: "Ruim",

        1: "Médio",

        2: "Bom"

    }


    # O scikit-learn espera uma matriz.
    #
    # Exemplo:
    #
    # satisfação = 5.0
    #
    # entrada = [[5.0]]

    entrada = [[valor]]


    # Executa o KNN

    previsao_numerica = (
        modelo_ia.predict(entrada)[0]
    )


    # Converte o resultado numérico
    # para o nome da classificação

    classe = MAPA_CLASSIFICACAO.get(
        int(previsao_numerica),
        "Desconhecido"
    )


    # Retorna somente a classificação
    # para o Node.js

    print(classe)


if __name__ == "__main__":

    main()