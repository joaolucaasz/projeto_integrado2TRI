const express = require('express');
const path = require('path');

const app = express();
const PORTA = 3000;

app.use(express.json());

app.use(express.static(__dirname));

let medicoes = [];
let proximoId = 1;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/medicoes', (req, res) => {

    const satisfacao = req.body.satisfacao;
    const filtro = req.body.filtro;

    if (satisfacao === undefined) {
        return res.status(422).json({
            erro: 'O valor de satisfação não foi informado'
        });
    }

    if (typeof satisfacao !== 'number' || !Number.isFinite(satisfacao)) {
        return res.status(422).json({
            erro: 'O valor de satisfação deve ser numérico'
        });
    }

    if (satisfacao < 0 || satisfacao > 100) {
        return res.status(422).json({
            erro: 'O valor de satisfação deve estar entre 0 e 100'
        });
    }

    if (filtro === undefined) {
        return res.status(422).json({
            erro: 'O estado do filtro não foi informado'
        });
    }

    if (filtro !== 0 && filtro !== 1) {
        return res.status(422).json({
            erro: 'O filtro deve ser 0 ou 1'
        });
    }

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

    const medicao = {
        id: proximoId,
        satisfacao: Number(satisfacao.toFixed(1)),
        classificacao: classificacao,
        filtro: filtro,
        timestamp: new Date().toISOString()
    };

    medicoes.push(medicao);

    proximoId++;

    console.log('Nova medição:', medicao);

    res.status(201).json(medicao);
});

app.get('/medicoes', (req, res) => {
    res.json(medicoes);
});

app.get('/medicoes/atual', (req, res) => {

    if (medicoes.length === 0) {
        return res.json({
            mensagem: 'Nenhuma medição recebida'
        });
    }

    res.json(medicoes[medicoes.length - 1]);
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:3000`);
});