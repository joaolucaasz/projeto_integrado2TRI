# 📊 Projeto Integrado — Monitoramento do Nível de Satisfação

Sistema IoT desenvolvido para o **Projeto Integrado** das disciplinas de **SEB, LPR, DAPL e IA**, com o objetivo de realizar a aquisição de uma variável analógica através de uma placa **STM32F103C8**, transmitir os dados para o computador por meio de **USB CDC**, processar as informações através de uma aplicação em **C#**, enviá-las para um servidor **Node.js/Express** utilizando **HTTP e JSON** e apresentar os resultados em um **dashboard web**.

O sistema permite acompanhar o nível de satisfação em tempo real, realizar sua classificação e visualizar o histórico das medições, além de apresentar estatísticas como média, maior e menor valor registrado.

---

## 🎥 Vídeo de demonstração

> **Link:** *[cole aqui o link do vídeo de demonstração no YouTube/Drive]*

---

## 🎯 Objetivo do projeto

O projeto tem como objetivo integrar **hardware, comunicação, programação, servidor web e Inteligência Artificial** em um único sistema.

A leitura realizada pelo STM32 é convertida em um valor de satisfação entre **0 e 100%**. Essa informação é enviada para o computador, processada e encaminhada para uma API REST.

O servidor recebe a medição, realiza a classificação do nível de satisfação e disponibiliza os dados para o dashboard web.

---

## 🏗️ Arquitetura do sistema

```text
┌─────────────────────┐
│      STM32F103      │
│                     │
│  Leitura do ADC     │
│  Aquisição do dado  │
└──────────┬──────────┘
           │
           │ USB CDC
           ▼
┌─────────────────────┐
│   Aplicação C#      │
│                     │
│ Recebe dados USB    │
│ Processa a leitura  │
│ Converte para JSON  │
└──────────┬──────────┘
           │
           │ HTTP + JSON
           ▼
┌──────────────────────────┐
│   Node.js + Express      │
│                          │
│       API REST           │
│                          │
│ Recebe as medições       │
│ Classifica os dados      │
│ Armazena histórico       │
└───────────┬──────────────┘
            │
            │ GET
            ▼
┌──────────────────────────┐
│     Dashboard Web        │
│                          │
│ Leitura atual            │
│ Classificação            │
│ Histórico                │
│ Média / Máximo / Mínimo  │
└──────────────────────────┘
```

### 🔹 1. STM32 — Sistemas Embarcados (SEB)

O **STM32F103C8** realiza a leitura de um sinal analógico através do ADC.

A leitura do ADC possui resolução de **12 bits**, resultando em valores entre:

```text
0 → 4095
```

O valor pode posteriormente ser convertido para uma porcentagem de satisfação:

```text
0 → 0%
4095 → 100%
```

O STM32 utiliza **USB CDC** para realizar a comunicação com o computador.

---

### 🔹 2. Aplicação C# — Linguagem de Programação (LPR)

A aplicação em **C#** funciona como uma ponte entre o STM32 e o servidor.

Suas principais responsabilidades são:

* Detectar/abrir a porta COM do STM32;
* Receber os dados enviados pela USB CDC;
* Interpretar a leitura recebida;
* Converter o valor para o formato necessário;
* Montar os dados em **JSON**;
* Enviar a medição para o servidor através de uma requisição HTTP POST.

Exemplo de informação enviada:

```json
{
    "satisfacao": 69.1
}
```

---

### 🔹 3. Servidor Node.js + Express — Desenvolvimento de Aplicativos (DAPL)

O servidor é desenvolvido utilizando **Node.js** e o framework **Express**.

Ele possui uma API REST responsável por:

* Receber as medições;
* Validar os valores recebidos;
* Classificar o nível de satisfação;
* Armazenar as medições;
* Retornar o histórico;
* Retornar a medição mais recente;
* Servir o dashboard web.

As medições são armazenadas em memória durante a execução do servidor.

---

### 🔹 4. Inteligência Artificial (IA)

O projeto utiliza **KNN (K-Nearest Neighbors)** como algoritmo de Inteligência Artificial para a classificação do nível de satisfação.

O KNN realiza a classificação de uma nova medição comparando-a com exemplos previamente definidos no conjunto de dados.

As categorias utilizadas no projeto são:

| Classificação |      Faixa |
| ------------- | ---------: |
| 🔴 Ruim       |   0% – 33% |
| 🟡 Médio      |  34% – 66% |
| 🟢 Bom        | 67% – 100% |

> **Observação:** o servidor atual também possui uma classificação por faixa para garantir o funcionamento da API. A integração do módulo KNN é a etapa destinada à classificação por Inteligência Artificial.

---

### 🔹 5. Dashboard Web

O dashboard foi desenvolvido utilizando:

* HTML;
* CSS;
* JavaScript;
* API REST.

A página consulta automaticamente o servidor e apresenta:

* 📊 Leitura atual;
* 🏷️ Classificação da satisfação;
* 📈 Barra visual de satisfação;
* 📋 Histórico das medições;
* 📊 Média;
* ⬆️ Maior valor;
* ⬇️ Menor valor;
* 🟢 Estado de conexão com o servidor.

O dashboard realiza novas consultas à API automaticamente a cada **3 segundos**.

---

# 📁 Estrutura do projeto

```text
.
├── firmware/
│   └── Core/
│       └── Src/
│           └── main.c
│
├── csharp/
│   └── Program.cs
│
├── servidor/
│   ├── server.js
│   ├── index.html
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

> A estrutura pode variar de acordo com a organização final dos arquivos no repositório.

---

# 💻 Tecnologias utilizadas

| Tecnologia                  | Utilização                                |
| --------------------------- | ----------------------------------------- |
| **STM32F103C8**             | Aquisição do sinal analógico              |
| **STM32CubeIDE**            | Desenvolvimento do firmware               |
| **USB CDC**                 | Comunicação STM32 → computador            |
| **C# / .NET**               | Recepção e envio das medições             |
| **Node.js**                 | Execução do servidor                      |
| **Express**                 | API REST                                  |
| **HTML / CSS / JavaScript** | Dashboard                                 |
| **JSON**                    | Formato dos dados                         |
| **HTTP**                    | Comunicação C# → servidor                 |
| **KNN**                     | Classificação por Inteligência Artificial |

---

# 📌 Pré-requisitos

Para executar o projeto, é necessário ter:

* Placa **STM32F103C8**;
* Computador com Windows;
* **STM32CubeIDE**;
* **.NET SDK**;
* **Node.js**;
* Cabo USB compatível com comunicação de dados;
* Driver necessário para reconhecimento da comunicação USB/COM.

---

# 🚀 Como executar o projeto

## 1. Firmware do STM32

Abra o projeto do STM32 no **STM32CubeIDE**.

Compile o projeto e grave o firmware na placa.

Depois conecte o STM32 ao computador utilizando um cabo USB de dados.

Verifique se o dispositivo foi reconhecido corretamente pelo computador.

---

## 2. Instalar as dependências do servidor

Abra o terminal na pasta do servidor:

```bash
cd servidor
```

Instale o Express:

```bash
npm install express
```

---

## 3. Iniciar o servidor

Execute:

```bash
node server.js
```

Se estiver tudo correto, será exibida uma mensagem semelhante a:

```text
Servidor rodando em http://localhost:3000
```

---

## 4. Abrir o dashboard

Com o servidor funcionando, abra no navegador:

```text
http://localhost:3000
```

O próprio servidor Node.js disponibiliza o arquivo `index.html`.

---

## 5. Executar a aplicação C#

Em outro terminal, execute a aplicação responsável pela comunicação entre o STM32 e o servidor.

A aplicação deverá:

```text
STM32
   ↓
USB CDC
   ↓
C#
   ↓
JSON
   ↓
HTTP POST
   ↓
Node.js
```

---

# 📡 Comunicação entre os módulos

A comunicação completa do projeto ocorre da seguinte maneira:

### STM32 → C#

O STM32 realiza a leitura do ADC e transmite os dados utilizando **USB CDC**.

### C# → Node.js

A aplicação C# recebe a leitura e envia uma requisição HTTP para:

```text
POST http://localhost:3000/medicoes
```

O corpo da requisição utiliza JSON:

```json
{
    "satisfacao": 69.1
}
```

### Node.js → Dashboard

O dashboard consulta os dados através das rotas da API.

---

# 🛠️ API REST

O servidor possui as seguintes rotas:

| Método | Rota              | Função                         |
| ------ | ----------------- | ------------------------------ |
| `GET`  | `/`               | Abre o dashboard               |
| `POST` | `/medicoes`       | Recebe uma nova medição        |
| `GET`  | `/medicoes`       | Retorna todas as medições      |
| `GET`  | `/medicoes/atual` | Retorna a medição mais recente |

---

## 📥 POST `/medicoes`

Recebe uma nova medição.

### Exemplo:

```json
{
    "satisfacao": 69.1
}
```

O servidor verifica se:

* O valor foi enviado;
* O valor é numérico;
* O valor está entre 0 e 100.

Depois disso, é criada uma medição:

```json
{
    "id": 1,
    "satisfacao": 69.1,
    "classificacao": "Bom",
    "timestamp": "2026-08-19T14:00:00.000Z"
}
```

---

## 📤 GET `/medicoes`

Retorna todas as medições armazenadas.

Exemplo:

```json
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
```

---

## 📤 GET `/medicoes/atual`

Retorna somente a medição mais recente.

Exemplo:

```json
{
    "id": 2,
    "satisfacao": 42.5,
    "classificacao": "Medio",
    "timestamp": "2026-08-19T14:00:03.000Z"
}
```

---

# 🧪 Teste da API

É possível testar o servidor sem utilizar inicialmente o STM32 ou o C#.

No PowerShell:

```powershell
Invoke-RestMethod `
    -Uri "http://localhost:3000/medicoes" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"satisfacao":69.1}'
```

Se funcionar, o servidor deverá retornar a medição criada.

Depois, ao acessar:

```text
http://localhost:3000
```

o dashboard deverá apresentar a nova medição.

---

# 📊 Funcionamento da classificação

A classificação utilizada no sistema é baseada no valor de satisfação:

```text
        0              34              67             100
        │---------------│---------------│---------------│
             RUIM              MÉDIO             BOM
```

### Ruim

```text
0% até 33%
```

### Médio

```text
34% até 66%
```

### Bom

```text
67% até 100%
```

---

# 🧠 KNN

O algoritmo **K-Nearest Neighbors (KNN)** foi escolhido para o módulo de Inteligência Artificial do projeto.

O funcionamento consiste em comparar uma nova medição com os dados conhecidos e identificar quais exemplos são mais próximos.

O projeto utiliza **K = 3**, ou seja, são considerados os três vizinhos mais próximos para determinar a classificação.

```text
Nova medição
      │
      ▼
 ┌───────────┐
 │    KNN    │
 │   K = 3   │
 └─────┬─────┘
       │
       ▼
Comparação com
dados conhecidos
       │
       ▼
Classificação
       │
 ┌─────┼─────┐
 ▼     ▼     ▼
Ruim  Médio  Bom
```

---

# 🔄 Fluxo completo do sistema

```text
┌──────────────┐
│    STM32     │
│              │
│     ADC      │
└──────┬───────┘
       │
       │ USB CDC
       ▼
┌──────────────┐
│      C#      │
│              │
│ Recebe dado  │
│     ↓        │
│    JSON      │
└──────┬───────┘
       │
       │ HTTP POST
       ▼
┌──────────────────┐
│ Node.js / Express│
│                  │
│      API         │
│       ↓          │
│  Classificação   │
│       ↓          │
│    Histórico     │
└────────┬─────────┘
         │
         │ HTTP GET
         ▼
┌──────────────────┐
│    Dashboard     │
│                  │
│ Leitura atual    │
│ Classificação    │
│ Histórico        │
│ Estatísticas     │
└──────────────────┘
```

---

# 🧩 Decisões de implementação

### Comunicação USB CDC

Foi utilizada a comunicação **USB CDC** para permitir que o STM32 seja reconhecido pelo computador como uma interface de comunicação serial.

### JSON

O formato **JSON** foi utilizado na comunicação entre a aplicação C# e o servidor por ser simples, leve e adequado para APIs REST.

### API REST

O **Node.js com Express** foi escolhido para criar uma API simples responsável por receber, validar e disponibilizar as medições.

### Histórico em memória

As medições são armazenadas em um array no servidor.

Isso simplifica a implementação para a demonstração do projeto. Como consequência, os dados são perdidos quando o servidor é encerrado.

### Dashboard

O dashboard utiliza JavaScript para consultar automaticamente a API e atualizar as informações sem a necessidade de recarregar manualmente a página.

### Classificação

O sistema trabalha com três níveis de satisfação:

* **Ruim**
* **Médio**
* **Bom**

O módulo de Inteligência Artificial utiliza o algoritmo **KNN com K = 3** para a classificação proposta no projeto.

---

# 👥 Integrantes

* **João Lucas Fernandes Costa**
* **Isabela Pivoto**

---

## 🎓 Projeto Integrado

**Turma: 3º ano — Desenvolvimento de Sistemas**

**Ano: 2026**

**Projeto Integrado — Monitoramento do Nível de Satisfação**
