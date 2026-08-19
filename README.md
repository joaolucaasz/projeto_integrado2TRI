# Projeto Integrado — Sistema de Avaliação de Satisfação

## 📌 Sobre o projeto

Este projeto foi desenvolvido como parte do **Projeto Integrado do 2º trimestre** do curso de **Desenvolvimento de Sistemas**.

O sistema tem como objetivo realizar o **registro, processamento e classificação de avaliações de satisfação**. A aplicação utiliza uma interface web conectada a um servidor, além de um sistema de classificação desenvolvido em Python.

O projeto também possui uma aplicação em **C# para comunicação USB**, permitindo a integração com dispositivos externos.

## 👥 Integrantes

* **João Lucas Fernandes Costa**
* **Isabela Pivoto**

## 🛠️ Tecnologias utilizadas

* **HTML5** — desenvolvimento da interface web
* **JavaScript** — lógica e interação da aplicação
* **Node.js** — execução do servidor
* **Express.js** — desenvolvimento da API
* **Python** — processamento e classificação dos dados
* **Scikit-learn** — modelo de classificação
* **C# / .NET** — comunicação USB
* **Git / GitHub** — versionamento do projeto

## 📂 Estrutura do projeto

```text
projeto_integrado2TRI/
│
├── Comunicação USB/
│   ├── ComunicacaoUSB.csproj
│   └── Program.cs
│
├── Medições/
│   └── ...
│
├── Servidor/
│   ├── classify.py
│   ├── index.html
│   ├── requisitos.txt
│   └── servidor.js
│
└── README.md
```

## 🌐 Servidor

A pasta **Servidor** contém os principais arquivos responsáveis pelo funcionamento da aplicação web e pelo processamento dos dados.

### `servidor.js`

Arquivo responsável pelo servidor da aplicação, desenvolvido utilizando **Node.js e Express.js**.

Entre suas funções estão:

* Inicializar o servidor;
* Disponibilizar a aplicação web;
* Receber requisições;
* Processar os dados enviados;
* Disponibilizar os endpoints da API.

### `index.html`

Página principal da aplicação web.

É responsável pela interface utilizada para realizar as avaliações de satisfação e visualizar as informações do sistema.

### `classify.py`

Arquivo responsável pela **classificação dos dados utilizando Python e Scikit-learn**.

O programa recebe os valores enviados pelo sistema e utiliza o modelo de classificação para determinar a categoria correspondente à avaliação.

### `requisitos.txt`

Arquivo que contém as dependências necessárias para o funcionamento da parte Python do projeto.

## 📊 Medições

A pasta **Medições** contém os arquivos relacionados ao registro e gerenciamento das medições realizadas pelo sistema.

Esses dados são utilizados durante o funcionamento da aplicação para representar as avaliações de satisfação e permitir seu processamento e classificação.

## 🔌 Comunicação USB

A pasta **Comunicação USB** contém a aplicação desenvolvida em **C#/.NET**, responsável pela comunicação USB e pela integração com dispositivos externos.

### `Program.cs`

Contém o código principal da aplicação de comunicação USB.

### `ComunicacaoUSB.csproj`

Arquivo de configuração do projeto **.NET**, contendo as informações necessárias para a compilação da aplicação.

## ⚙️ Funcionamento do sistema

De maneira geral, o sistema funciona por meio da integração entre suas diferentes partes:

```text
Usuário
   ↓
Interface Web
   ↓
Servidor Node.js / Express
   ↓
Registro das medições
   ↓
Processamento dos dados
   ↓
Classificação em Python
   ↓
Resultado da avaliação
```

A comunicação USB também permite a integração entre o sistema e dispositivos externos.

## 🤖 Classificação das avaliações

O sistema possui uma etapa de classificação desenvolvida em **Python**, utilizando **Machine Learning com Scikit-learn**.

Os valores das avaliações são processados pelo modelo, que determina a categoria correspondente de satisfação conforme os dados definidos no projeto.

## 🎯 Objetivos do projeto

O projeto busca aplicar conhecimentos de diferentes áreas do desenvolvimento de sistemas, incluindo:

* Desenvolvimento de aplicações web;
* Criação e utilização de APIs;
* Desenvolvimento com Node.js e Express.js;
* Programação em Python;
* Machine Learning;
* Desenvolvimento em C#/.NET;
* Comunicação USB;
* Integração entre diferentes tecnologias;
* Registro e processamento de medições;
* Versionamento utilizando Git e GitHub.

## 📚 Projeto Integrado — 2º Trimestre

Projeto desenvolvido para fins acadêmicos no curso de **Desenvolvimento de Sistemas**.


