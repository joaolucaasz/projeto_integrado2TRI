📊 Projeto Integrado — Sistema de Monitoramento do Nível de Satisfação

Sistema IoT desenvolvido para o Projeto Integrado do curso de Desenvolvimento de Sistemas, integrando Sistemas Embarcados (SEB), Linguagem de Programação (LPR), Desenvolvimento de Aplicativos (DAPL) e Inteligência Artificial (IA).

O projeto tem como objetivo desenvolver um sistema completo de monitoramento e classificação do nível de satisfação, utilizando uma placa STM32F103C8T6 para aquisição de dados analógicos, comunicação USB CDC, uma aplicação intermediária em C#/.NET, uma API REST desenvolvida em Node.js com Express, um módulo de Inteligência Artificial utilizando KNN (K-Nearest Neighbors) e um dashboard web para visualização das informações.

O sistema realiza todo o fluxo de aquisição, processamento, transmissão, classificação e apresentação dos dados, permitindo acompanhar as medições de satisfação em tempo real.

🎯 Objetivo

O objetivo principal do projeto é integrar diferentes áreas do desenvolvimento de sistemas em uma única aplicação funcional.

A placa STM32F103C8T6 realiza a leitura de um sinal analógico através do conversor ADC de 12 bits. Essa leitura é processada no microcontrolador e convertida para uma porcentagem correspondente ao nível de satisfação.

Os dados são enviados pelo STM32 para o computador utilizando USB CDC. Uma aplicação desenvolvida em C# recebe essas informações pela porta serial virtual, interpreta o JSON recebido, calcula o valor percentual de satisfação e envia uma nova requisição para o servidor.

O servidor desenvolvido em Node.js + Express recebe as medições através de uma API REST, processa os dados, realiza a classificação e disponibiliza as informações para o dashboard.

Por fim, o dashboard web apresenta a medição atual, classificação, histórico e estatísticas do sistema.

🏗️ Arquitetura do sistema
                         ┌──────────────────────┐
                         │      STM32F103C8      │
                         │                      │
                         │       ADC 12 bits    │
                         │      0 até 4095      │
                         │                      │
                         │  Leitura analógica   │
                         │  Filtro / média      │
                         │  Conversão           │
                         └──────────┬───────────┘
                                    │
                                    │ USB CDC
                                    │ JSON
                                    ▼
                         ┌──────────────────────┐
                         │    Comunicação C#    │
                         │                      │
                         │      .NET            │
                         │                      │
                         │  Recebe porta COM    │
                         │  Lê JSON              │
                         │  Processa leitura    │
                         │  Calcula satisfação  │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP POST
                                    │ JSON
                                    ▼
                         ┌──────────────────────┐
                         │    Node.js / Express │
                         │                      │
                         │       API REST       │
                         │                      │
                         │ Recebe medições      │
                         │ Valida dados         │
                         │ Classifica            │
                         │ Armazena histórico   │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP GET
                                    ▼
                         ┌──────────────────────┐
                         │     Dashboard Web    │
                         │                      │
                         │  Leitura atual       │
                         │  Satisfação          │
                         │  Classificação       │
                         │  Histórico           │
                         │  Estatísticas        │
                         └──────────────────────┘
🔩 Sistemas Embarcados — STM32F103C8

A parte de Sistemas Embarcados (SEB) é responsável pela aquisição da variável analógica.

Foi utilizada uma placa baseada no STM32F103C8T6, desenvolvida e configurada através do STM32CubeIDE.

O microcontrolador possui um conversor analógico-digital (ADC) com resolução de 12 bits, permitindo representar a leitura através de valores entre:

0 → 4095

A leitura pode ser convertida para porcentagem utilizando:

porcentagem = (ADC × 100) / 4095

Dessa forma:

ADC = 0       → 0%
ADC = 2047    → aproximadamente 50%
ADC = 4095    → 100%

A porcentagem representa o nível de satisfação utilizado pelo restante do sistema.

📈 Aquisição e processamento da leitura

Para melhorar a estabilidade das leituras do ADC, foi implementado um processo de média das amostras.

As leituras são armazenadas e utilizadas para calcular uma média, reduzindo oscilações causadas por pequenas variações do sinal analógico.

O processo utilizado pode ser representado por:

Leitura ADC
    ↓
Coleta de amostras
    ↓
Armazenamento
    ↓
Soma das amostras
    ↓
Cálculo da média
    ↓
Conversão para %
    ↓
Classificação
    ↓
Transmissão

A média é calculada utilizando a quantidade definida em NUM_AMOSTRAS.

Também foi utilizado um botão para iniciar o processo de filtragem das leituras.

Quando o botão é acionado, o sistema reinicializa os índices e a soma das amostras para iniciar uma nova sequência de aquisição.

🔌 Comunicação USB CDC

A comunicação entre o STM32 e o computador utiliza USB CDC (Communication Device Class).

Essa tecnologia permite que o microcontrolador seja reconhecido pelo computador como uma interface de comunicação serial.

O STM32 envia os dados através da função de transmissão USB:

CDC_Transmit_FS()

As informações são organizadas em formato JSON, permitindo que a aplicação C# consiga interpretar os dados de maneira estruturada.

Um exemplo de informação enviada pelo STM32 é:

{
    "adc": 2830,
    "tensao": 2.28,
    "porcentagem": 69.1,
    "niveldesatisfacao": "Bom"
}

O formato JSON facilita a integração entre o firmware, a aplicação C# e o servidor.

💻 Comunicação USB em C# / .NET

A pasta ComunicacaoUSB contém a aplicação responsável por realizar a comunicação entre o STM32 e o servidor.

A aplicação foi desenvolvida em C# utilizando .NET.

Sua principal função é atuar como uma ponte entre o hardware e a API.

O programa utiliza:

System.IO.Ports
System.Net.Http
System.Text
System.Text.Json

A comunicação serial é realizada através da classe:

SerialPort

A aplicação abre a porta COM utilizada pelo STM32 e aguarda os dados enviados pelo dispositivo.

A velocidade configurada é:

115200 baud

O fluxo da aplicação C# é:

STM32
   ↓
USB CDC
   ↓
Porta COM
   ↓
Aplicação C#
   ↓
Leitura do JSON
   ↓
Desserialização
   ↓
Cálculo da satisfação
   ↓
HTTP POST
   ↓
Servidor Node.js
🔄 Processamento dos dados no C#

Quando um dado é recebido pela porta serial, a aplicação realiza a leitura da linha recebida.

O JSON é convertido para um objeto utilizando:

JsonSerializer.Deserialize<DadosSTM32>()

A estrutura utilizada para representar os dados recebidos contém:

class DadosSTM32
{
    public int adc { get; set; }
    public double tensao { get; set; }
}

Depois de receber o ADC, o programa calcula a porcentagem de satisfação:

satisfacao = (ADC × 100) / 4095

O valor é arredondado e enviado para o servidor.

Exemplo:

{
    "satisfacao": 69.1
}
🌐 Servidor Node.js + Express

A pasta Servidor contém a parte responsável pelo backend e pelo dashboard.

O servidor foi desenvolvido utilizando:

Node.js;
Express;
JavaScript;
Python para o módulo de IA;
HTML;
CSS;
JSON;
HTTP.

O arquivo principal do backend é:

Servidor/server.js

O servidor é executado na porta:

3000

Após iniciar o servidor, a aplicação pode ser acessada através de:

http://localhost:3000
📡 API REST

A API foi desenvolvida para permitir a comunicação entre a aplicação C# e o sistema web.

A principal rota utilizada para receber novas medições é:

POST /medicoes

A aplicação C# envia:

{
    "satisfacao": 69.1
}

O servidor recebe o valor, valida os dados e realiza o processamento necessário.

As principais rotas utilizadas no sistema são:

Método	Rota	Função
GET	/	Disponibiliza o dashboard
POST	/medicoes	Recebe uma nova medição
GET	/medicoes	Retorna o histórico
GET	/medicoes/atual	Retorna a medição mais recente
📥 POST /medicoes

A rota recebe uma nova medição enviada pela aplicação C#.

Exemplo:

{
    "satisfacao": 69.1
}

O servidor verifica se o valor recebido:

foi enviado;
é numérico;
está dentro do intervalo permitido;
pode ser utilizado para realizar a classificação.

Após o processamento, a medição pode ser armazenada juntamente com sua classificação e informações adicionais.

Exemplo:

{
    "id": 1,
    "satisfacao": 69.1,
    "classificacao": "Bom",
    "timestamp": "2026-08-19T14:00:00.000Z"
}
📤 GET /medicoes

A rota:

GET /medicoes

é utilizada pelo dashboard para obter o histórico das medições.

Exemplo:

[
    {
        "id": 1,
        "satisfacao": 69.1,
        "classificacao": "Bom",
        "timestamp": "2026-08-19T14:00:00.000Z"
    },
    {
        "id": 2,
        "satisfacao": 42.5,
        "classificacao": "Medio",
        "timestamp": "2026-08-19T14:00:03.000Z"
    }
]
📤 GET /medicoes/atual

A rota:

GET /medicoes/atual

retorna a medição mais recente disponível no sistema.

Exemplo:

{
    "id": 2,
    "satisfacao": 42.5,
    "classificacao": "Medio",
    "timestamp": "2026-08-19T14:00:03.000Z"
}
🤖 Inteligência Artificial — KNN

O projeto possui um módulo de Inteligência Artificial utilizando o algoritmo K-Nearest Neighbors (KNN).

O KNN é utilizado para classificar uma nova leitura de acordo com os exemplos presentes no conjunto de dados.

O projeto utiliza:

K = 3

Isso significa que, para classificar uma nova entrada, são considerados os 3 vizinhos mais próximos.

O processo pode ser representado da seguinte maneira:

             Nova medição
                  │
                  ▼
          ┌───────────────┐
          │      KNN      │
          │     K = 3     │
          └───────┬───────┘
                  │
                  ▼
        Comparação com dataset
                  │
                  ▼
        Identificação dos
        vizinhos mais próximos
                  │
                  ▼
             Classificação
                  │
          ┌───────┼───────┐
          ▼       ▼       ▼
        RUIM    MÉDIO     BOM

O arquivo responsável pelo módulo de classificação é:

Servidor/classify.py

O projeto também possui o arquivo:

Servidor/requirements.txt

que contém as dependências necessárias para a execução do módulo Python.

📊 Classificação do nível de satisfação

O sistema trabalha com três níveis de satisfação:

Nível	Faixa
🔴 Ruim	0% – 33%
🟡 Médio	34% – 66%
🟢 Bom	67% – 100%

Representação:

0%                 34%                 67%                100%
│──────────────────│───────────────────│────────────────────│
       RUIM                MÉDIO                  BOM

A classificação permite transformar o valor numérico da medição em uma informação mais simples de interpretar no dashboard.

🖥️ Dashboard Web

O arquivo:

Servidor/index.html

contém a interface web do projeto.

O dashboard foi desenvolvido para apresentar as informações recebidas da API de maneira visual e organizada.

A interface permite acompanhar:

valor atual de satisfação;
classificação atual;
indicador visual do nível de satisfação;
histórico das medições;
média das medições;
maior valor registrado;
menor valor registrado;
estado da conexão com o servidor.

O dashboard utiliza HTML, CSS e JavaScript e realiza consultas à API para atualizar as informações apresentadas.

📋 Histórico de medições

As medições recebidas pelo servidor são mantidas durante a execução da aplicação.

O histórico permite acompanhar a evolução do nível de satisfação ao longo das leituras.

As informações podem incluir:

ID
Satisfação
Classificação
Data/Hora

O histórico também pode ser utilizado pelo dashboard para calcular estatísticas e apresentar os dados ao usuário.

As medições são armazenadas em memória durante a execução do servidor. Dessa forma, os dados são perdidos quando o servidor é encerrado.

📈 Estatísticas

O dashboard realiza o processamento das medições disponíveis para apresentar informações como:

Média
Maior valor
Menor valor

Essas informações permitem uma visão geral dos dados coletados pelo sistema.

Exemplo:

┌──────────────────────────────┐
│     ESTATÍSTICAS             │
├──────────────────────────────┤
│ Média:       68,4%           │
│ Maior valor: 92,1%           │
│ Menor valor: 41,7%           │
└──────────────────────────────┘
🔗 Fluxo completo da comunicação

O funcionamento completo do projeto acontece seguindo o fluxo:

┌────────────────────┐
│      STM32         │
│                    │
│ Leitura do ADC     │
│ 0 - 4095           │
└─────────┬──────────┘
          │
          │ USB CDC
          ▼
┌────────────────────┐
│        C#          │
│                    │
│ Recebe porta COM   │
│ Lê JSON            │
│ Calcula %          │
└─────────┬──────────┘
          │
          │ HTTP
          │ JSON
          ▼
┌────────────────────┐
│   Node.js/Express  │
│                    │
│      API REST      │
│                    │
│ Recebe medição     │
│ Processa           │
│ Classifica         │
│ Armazena           │
└─────────┬──────────┘
          │
          │ GET
          ▼
┌────────────────────┐
│    Dashboard       │
│                    │
│ Valor atual        │
│ Classificação      │
│ Histórico          │
│ Estatísticas       │
└────────────────────┘
🗂️ Estrutura do projeto

A organização atual do repositório é:

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
│   │
│   ├── Core
│   │   ├── Inc
│   │   │   ├── main.h
│   │   │   ├── stm32f1xx_hal_conf.h
│   │   │   └── stm32f1xx_it.h
│   │   │
│   │   ├── Src
│   │   │   ├── main.c
│   │   │   ├── stm32f1xx_hal_msp.c
│   │   │   ├── stm32f1xx_it.c
│   │   │   ├── syscalls.c
│   │   │   ├── sysmem.c
│   │   │   └── system_stm32f1xx.c
│   │   │
│   │   └── Startup
│   │       └── startup_stm32f103c8tx.s
│   │
│   ├── Drivers
│   │   ├── CMSIS
│   │   └── STM32F1xx_HAL_Driver
│   │
│   ├── Middlewares
│   │   └── ST
│   │       └── STM32_USB_Device_Library
│   │
│   └── USB_DEVICE
│       ├── App
│       └── Target
│
└── Servidor
    ├── classify.py
    ├── index.html
    ├── requirements.txt
    └── server.js
🛠️ Tecnologias utilizadas
Tecnologia	Utilização
STM32F103C8T6	Aquisição da variável analógica
STM32CubeIDE	Desenvolvimento e gravação do firmware
C	Programação do microcontrolador
ADC 12 bits	Conversão do sinal analógico
USB CDC	Comunicação entre STM32 e computador
C# / .NET	Comunicação USB e integração com servidor
SerialPort	Comunicação com a porta COM
System.Text.Json	Leitura e criação de JSON
HTTP	Comunicação entre C# e API
JSON	Formato de troca de dados
Node.js	Execução do backend
Express	Desenvolvimento da API REST
Python	Módulo de Inteligência Artificial
KNN	Classificação das medições
HTML	Estrutura do dashboard
CSS	Estilização da interface
JavaScript	Funcionamento e atualização do dashboard
Git/GitHub	Versionamento e armazenamento do projeto
📌 Pré-requisitos

Para executar o projeto, é necessário possuir:

Placa STM32F103C8T6;
Computador com Windows;
STM32CubeIDE;
.NET SDK;
Node.js;
Python;
Cabo USB de dados;
Driver necessário para comunicação USB;
Git, caso seja necessário clonar ou atualizar o projeto.
🧩 Decisões de implementação
ADC

O ADC do STM32 foi utilizado para transformar a variável analógica em um valor digital entre 0 e 4095.

Média das amostras

Foi utilizado um processo de média para reduzir oscilações e obter uma leitura mais estável.

USB CDC

A comunicação USB CDC permite transmitir as informações do STM32 para o computador sem a necessidade de utilizar uma comunicação serial tradicional diretamente nos pinos UART.

C#

A aplicação C# foi utilizada como intermediária entre o firmware e o servidor, ficando responsável por receber os dados USB, interpretar o JSON e realizar a comunicação HTTP.

JSON

O JSON foi escolhido para estruturar as informações trocadas entre os módulos por ser simples e adequado à comunicação com APIs.

HTTP

O protocolo HTTP foi utilizado na comunicação entre a aplicação C# e o servidor Node.js.

API REST

O Express foi utilizado para criar uma API REST responsável pelo recebimento e disponibilização das medições.

Node.js

O Node.js foi utilizado para executar o servidor e centralizar o processamento das informações.

Python

O Python é utilizado no módulo de Inteligência Artificial responsável pela classificação utilizando KNN.

KNN

O algoritmo KNN foi escolhido para realizar a classificação das medições com K = 3.

Histórico

As medições são mantidas em memória enquanto o servidor está em execução, permitindo que o dashboard apresente o histórico das leituras.

Dashboard

O dashboard foi desenvolvido para permitir a visualização das informações de maneira simples e em tempo real, consultando os dados disponibilizados pela API.
🔐 Validação dos dados

O servidor realiza validações antes de processar as medições.

O valor de satisfação deve ser:

Numérico

e estar dentro do intervalo:

0 ≤ satisfação ≤ 100

Isso evita que valores inválidos sejam utilizados pelo sistema.

📊 Exemplo de funcionamento

Uma leitura realizada pelo STM32 pode resultar em:

ADC:       2830
Tensão:    2.28 V
Satisfação: 69.1%

A aplicação C# recebe os dados e envia:

{
    "satisfacao": 69.1
}

O servidor processa a informação e determina a classificação correspondente.

69.1%
  ↓
KNN
  ↓
Classificação
  ↓
Bom

O resultado é então disponibilizado para o dashboard.

📁 Organização dos módulos

O projeto foi dividido em três partes principais:

Projeto_medicao

Responsável pelo firmware do STM32F103C8T6, incluindo:

configuração do microcontrolador;
ADC;
GPIO;
filtro/média das amostras;
USB;
transmissão dos dados;
geração do JSON.
ComunicacaoUSB

Responsável pela aplicação C#/.NET, incluindo:

comunicação com a porta COM;
recebimento dos dados;
desserialização do JSON;
cálculo da satisfação;
comunicação HTTP;
envio das medições para a API.
Servidor

Responsável pelo backend, IA e interface web:

Servidor/
├── classify.py
├── index.html
├── requirements.txt
└── server.js
🔗 Integração entre as disciplinas

O projeto integra as disciplinas do Projeto Integrado da seguinte forma:

Disciplina	Aplicação no projeto
SEB — Sistemas Embarcados	STM32, ADC, GPIO, USB CDC e aquisição dos dados
LPR — Linguagem de Programação	Aplicação C# responsável pela comunicação e processamento
DAPL — Desenvolvimento de Aplicativos	API REST, Node.js, Express e dashboard web
IA — Inteligência Artificial	Classificação utilizando algoritmo KNN
🔄 Visão geral
                  PROJETO INTEGRADO
                         │
        ┌────────────────┼────────────────┐
        │                │                │
       SEB              LPR              DAPL
        │                │                │
     STM32              C#          Node.js/Express
        │                │                │
       ADC               │              API REST
        │                │                │
     USB CDC ───────────►│──────────────►│
                                         │
                                         ▼
                                        IA
                                         │
                                        KNN
                                         │
                                         ▼
                                  Classificação
                                         │
                                         ▼
                                    Dashboard
🎥 Demonstração

Vídeo de demonstração do projeto:

[Adicionar link do vídeo aqui]

👥 Integrantes

João Lucas Fernandes Costa

Isabela Pivoto

🎓 Informações acadêmicas

Curso: Desenvolvimento de Sistemas
Turma: 3º ano — Desenvolvimento de Sistemas
Ano: 2026
Projeto: Projeto Integrado — Monitoramento do Nível de Satisfação

📌 Considerações finais

O projeto apresenta uma integração completa entre sistemas embarcados, comunicação USB, programação em C#, desenvolvimento de APIs, desenvolvimento web e Inteligência Artificial.

A solução permite que uma leitura física realizada pelo STM32 seja transformada em uma informação de satisfação, transmitida ao computador, processada por uma aplicação intermediária, enviada para um servidor através de uma API REST, classificada utilizando KNN e finalmente apresentada ao usuário através de um dashboard web.

Dessa forma, o projeto demonstra na prática a integração entre hardware e software, utilizando diferentes tecnologias e linguagens para construir um sistema completo de aquisição, processamento, comunicação, classificação e visualização de dados.