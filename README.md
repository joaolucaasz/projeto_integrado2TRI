📊 Projeto Integrado — Sistema de Monitoramento do Nível de Satisfação

Sistema IoT desenvolvido para o Projeto Integrado do curso de Desenvolvimento de Sistemas, integrando as disciplinas de Sistemas Embarcados (SEB), Linguagem de Programação (LPR), Desenvolvimento de Aplicativos (DAPL) e Inteligência Artificial (IA).

O projeto realiza a aquisição de uma variável analógica utilizando uma STM32F103C8T6, transmite os dados por USB CDC para uma aplicação C#/.NET, envia as informações para uma API REST em Node.js/Express e utiliza KNN (K-Nearest Neighbors) para classificação do nível de satisfação. Os resultados são apresentados em um dashboard web.

🎯 Objetivo

Desenvolver um sistema completo capaz de:

Realizar a leitura de uma variável analógica;
Processar e estabilizar as leituras utilizando média das amostras;
Converter o valor do ADC em porcentagem de satisfação;
Transmitir os dados através de USB CDC;
Receber e processar os dados em C#;
Enviar as medições para uma API REST;
Classificar o nível de satisfação utilizando KNN com K = 3;
Apresentar os resultados em um dashboard web;
Manter histórico e estatísticas das medições.
🏗️ Arquitetura
┌──────────────────┐
│     STM32F103    │
│                  │
│   ADC 12 bits    │
│   Média/Filtragem│
│   Conversão      │
└────────┬─────────┘
         │ USB CDC
         ▼
┌──────────────────┐
│     C# / .NET    │
│                  │
│   Porta COM      │
│   Leitura JSON   │
│   Cálculo %      │
└────────┬─────────┘
         │ HTTP + JSON
         ▼
┌──────────────────┐
│  Node.js/Express │
│                  │
│     API REST     │
│   Processamento  │
│    Histórico     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Inteligência   │
│    Artificial    │
│      KNN K=3     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Dashboard     │
│                  │
│ Satisfação       │
│ Classificação    │
│ Histórico        │
│ Estatísticas     │
└──────────────────┘
🔩 STM32F103C8T6 — Sistemas Embarcados

O firmware foi desenvolvido no STM32CubeIDE utilizando linguagem C.

O ADC possui resolução de 12 bits, permitindo valores entre:

0 ─────────────── 4095

A conversão para porcentagem é realizada através de:

porcentagem = (ADC × 100) / 4095

Exemplo:

ADC = 0       → 0%
ADC = 2047    → ≈ 50%
ADC = 4095    → 100%

Para melhorar a estabilidade das medições, o firmware utiliza média das amostras. As leituras são acumuladas e posteriormente calculadas de acordo com NUM_AMOSTRAS.

Também foi implementado um botão para iniciar o processo de filtragem, reiniciando o índice e a soma das amostras para uma nova sequência de aquisição.

🔌 Comunicação USB CDC

O STM32 utiliza USB CDC (Communication Device Class) para transmitir os dados ao computador.

A transmissão é realizada através de:

CDC_Transmit_FS()

Os dados são enviados em formato JSON, por exemplo:

{
    "adc": 2830,
    "tensao": 2.28,
    "porcentagem": 69.1,
    "niveldesatisfacao": "Bom"
}
💻 Comunicação C# / .NET

A pasta ComunicacaoUSB contém a aplicação responsável pela comunicação entre o STM32 e o servidor.

A aplicação utiliza:

System.IO.Ports
System.Net.Http
System.Text
System.Text.Json

O fluxo é:

STM32
  ↓
USB CDC
  ↓
Porta COM
  ↓
C# / .NET
  ↓
Desserialização JSON
  ↓
Cálculo da satisfação
  ↓
HTTP POST
  ↓
Node.js

A comunicação serial utiliza 115200 baud.

A aplicação recebe o JSON do STM32, extrai o valor do ADC e calcula a satisfação:

satisfacao = (ADC × 100) / 4095

Em seguida, envia para a API:

{
    "satisfacao": 69.1
}
🌐 Servidor Node.js + Express

A pasta Servidor contém o backend, módulo de IA e dashboard.

Servidor/
├── server.js
├── classify.py
├── requirements.txt
└── index.html

O servidor é executado na porta:

3000

Após iniciar:

node server.js

o dashboard pode ser acessado em:

http://localhost:3000
📡 API REST
Método	Rota	Função
GET	/	Dashboard
POST	/medicoes	Recebe uma medição
GET	/medicoes	Retorna o histórico
GET	/medicoes/atual	Retorna a última medição
POST /medicoes

Exemplo:

{
    "satisfacao": 69.1
}

O servidor valida se o valor é numérico e está entre 0 e 100.

Após o processamento, a medição pode apresentar informações como:

{
    "id": 1,
    "satisfacao": 69.1,
    "classificacao": "Bom",
    "timestamp": "2026-08-19T14:00:00.000Z"
}
🤖 Inteligência Artificial — KNN

O projeto utiliza o algoritmo K-Nearest Neighbors (KNN) para classificação.

Foi definido:

K = 3

Assim, a nova medição é comparada com os dados do conjunto de treinamento e os 3 vizinhos mais próximos são utilizados para determinar a classe.

Nova medição
     ↓
    KNN
   K = 3
     ↓
Comparação com dataset
     ↓
Classificação
  ↙    ↓    ↘
Ruim Médio  Bom

O módulo de IA está localizado em:

Servidor/classify.py

As dependências estão em:

Servidor/requirements.txt
📊 Classificação

O sistema possui três níveis:

Nível	Faixa
🔴 Ruim	0% – 33%
🟡 Médio	34% – 66%
🟢 Bom	67% – 100%
0%             34%             67%             100%
│───────────────│───────────────│────────────────│
      RUIM            MÉDIO              BOM
🖥️ Dashboard

O dashboard está localizado em:

Servidor/index.html

Foi desenvolvido utilizando HTML, CSS e JavaScript.

A interface apresenta:

📊 Valor atual de satisfação;
🏷️ Classificação;
📈 Indicador visual;
📋 Histórico das medições;
📊 Média;
⬆️ Maior valor;
⬇️ Menor valor;
🟢 Estado da conexão com o servidor.

As informações são obtidas através da API REST.

📈 Histórico e estatísticas

As medições recebidas são armazenadas em memória enquanto o servidor está funcionando.

O sistema permite acompanhar:

Média
Maior valor
Menor valor
Histórico

Os dados armazenados em memória são perdidos quando o servidor é encerrado.

🗂️ Estrutura do projeto
.
├── README.md
│
├── ComunicacaoUSB
│   ├── ComucacaoUSB.csproj
│   └── Program.cs
│
├── Projeto_medicao
│   ├── Projeto_medicao.ioc
│   ├── STM32F103C8TX_FLASH.ld
│   ├── Core
│   ├── Drivers
│   ├── Middlewares
│   └── USB_DEVICE
│
└── Servidor
    ├── classify.py
    ├── index.html
    ├── requirements.txt
    └── server.js
🛠️ Tecnologias
Tecnologia	Aplicação
STM32F103C8T6	Aquisição dos dados
C / STM32CubeIDE	Firmware
ADC 12 bits	Conversão analógica
USB CDC	Comunicação STM32 → PC
C# / .NET	Comunicação e processamento
SerialPort	Porta COM
System.Text.Json	JSON
HTTP	Comunicação com API
Node.js	Backend
Express	API REST
Python	Inteligência Artificial
KNN	Classificação
HTML / CSS / JavaScript	Dashboard
Git / GitHub	Versionamento
📌 Pré-requisitos

Para executar o projeto:

STM32F103C8T6;
STM32CubeIDE;
Windows;
.NET SDK;
Node.js;
Python;
Cabo USB de dados;
Driver necessário para comunicação USB;
Git.
🔄 Fluxo completo
┌─────────────┐
│   STM32     │
│     ADC     │
└──────┬──────┘
       │
       │ USB CDC
       ▼
┌─────────────┐
│ C# / .NET   │
│   Porta COM │
└──────┬──────┘
       │
       │ HTTP + JSON
       ▼
┌─────────────┐
│ Node.js     │
│  Express    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    KNN      │
│    K = 3    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Dashboard   │
│   Web       │
└─────────────┘
🔗 Integração das disciplinas
Disciplina	Aplicação
SEB	STM32, ADC, GPIO, média das amostras e USB CDC
LPR	Aplicação C#/.NET e processamento dos dados
DAPL	Node.js, Express, API REST e dashboard
IA	KNN com K = 3 para classificação
🎥 Demonstração

Vídeo do projeto:
[Adicionar link do vídeo aqui]

👥 Integrantes
João Lucas Fernandes Costa
Isabela Pivoto
🎓 Informações acadêmicas

Curso: Desenvolvimento de Sistemas
Turma: 3º ano — Desenvolvimento de Sistemas
Ano: 2026
Projeto: Projeto Integrado — Sistema de Monitoramento do Nível de Satisfação

📌 Considerações finais

O projeto demonstra a integração entre hardware, firmware, comunicação USB, C#/.NET, API REST, desenvolvimento web e Inteligência Artificial.

A partir de uma leitura analógica realizada pelo STM32F103C8T6, o sistema realiza o processamento da informação, transmite os dados para o computador, envia a medição para o servidor, realiza a classificação através do KNN e apresenta os resultados de forma visual no dashboard.

O resultado é um sistema integrado de aquisição, processamento, comunicação, classificação e visualização de dados, desenvolvido como parte do Projeto Integrado de Desenvolvimento de Sistemas — 2026.