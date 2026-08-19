const express = require('express');
const path = require('path');

const app = express();
const PORTA = 3000;

app.use(express.json());

// Faz o Express servir os arquivos HTML, CSS e JS
app.use(express.static(__dirname));

let medicoes = [];
let proximoId = 1;

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Recebe a medição enviada pelo C#
app.post('/medicoes', (req, res) => {

    const satisfacao = req.body.satisfacao;

    // Verifica se foi enviado
    if (satisfacao === undefined) {
        return res.status(422).json({
            erro: 'O valor de satisfação não foi informado'
        });
    }

    // Verifica se é número
    if (typeof satisfacao !== 'number' || !Number.isFinite(satisfacao)) {
        return res.status(422).json({
            erro: 'O valor de satisfação deve ser numérico'
        });
    }

    // Verifica se está entre 0 e 100
    if (satisfacao < 0 || satisfacao > 100) {
        return res.status(422).json({
            erro: 'O valor de satisfação deve estar entre 0 e 100'
        });
    }

    // Classificação
    let classificacao;

    if (satisfacao < 34) {
        classificacao = 'Ruim';
    }
    else if (satisfacao < 67) {
        classificacao = 'Medio';
    }
    else {
        classificacao = 'Bom';
    }

    // Cria a medição
    const medicao = {
        id: proximoId,
        satisfacao: Number(satisfacao.toFixed(1)),
        classificacao: classificacao,
        timestamp: new Date().toISOString()
    };

    // Salva a medição
    medicoes.push(medicao);

    proximoId++;

    console.log('Nova medição:', medicao);

    // Retorna a medição para quem enviou
    res.status(201).json(medicao);
});

// Retorna todas as medições
app.get('/medicoes', (req, res) => {
    res.json(medicoes);
});

// Retorna a medição mais recente
app.get('/medicoes/atual', (req, res) => {

    if (medicoes.length === 0) {
        return res.json({
            mensagem: 'Nenhuma medição recebida'
        });
    }

    res.json(medicoes[medicoes.length - 1]);
});

// Inicia o servidor
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});