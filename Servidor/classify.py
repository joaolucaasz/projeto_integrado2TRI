
import sys
import os
import warnings
import joblib


warnings.filterwarnings("ignore")


def main():


    if len(sys.argv) < 2:
        print("ERRO: Nenhum valor de satisfação fornecido")
        return

    try:     

        valor = float(sys.argv[1])

    except ValueError:

        print("ERRO: Valor de satisfação inválido")
        return

    caminho_modelo = "modelo_ia.pkl"


    # Verifica se o modelo existe

    if not os.path.exists(caminho_modelo):

        print(
            "ERRO: Arquivo modelo_ia.pkl não encontrado. "
            "Treine o modelo primeiro."
        )

        return


    modelo_ia = joblib.load(
        caminho_modelo
    )


    MAPA_CLASSIFICACAO = {

        0: "Ruim",

        1: "Médio",

        2: "Bom"

    }

    entrada = [[valor]]

    previsao_numerica = (
        modelo_ia.predict(entrada)[0]
    )

    classe = MAPA_CLASSIFICACAO.get(
        int(previsao_numerica),
        "Desconhecido"
    )
    print(classe)


if __name__ == "__main__":

    main()