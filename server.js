const express = require('express');
const { connect } = require('http2');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para analisar JSON
app.use(express.json());

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mercado_db'
});

connection.connect((erro) => {
    if (!erro) {
        console.log('Conectado ao banco de dados.');
        return;
    }
    console.log('Erro ao conectar no banco de dados.', erro);
});
