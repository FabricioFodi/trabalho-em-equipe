const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para analisar JSON
app.use(express.json());

// Conexão com o banco de dados
const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mercado_db'
});

conexao.connect((erro) => {
    if (!erro) {
        console.log('Conectado ao banco de dados.');
        return;
    }
    console.log('Erro ao conectar no banco de dados.', erro);
});

// Servir arquivos estáticos da raiz do projeto
app.use(express.static(path.join(__dirname)));


app.post('/mercados', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { nome, endereco } = req.body;
    const query = 'INSERT INTO mercados (nome, endereco) VALUES (?, ?)';

    conexao.query(query, [nome, endereco], (erro, resultado) => {
        if (!erro){
            console.log('Mercado cadastrado com sucesso.', resultado);
            res.status(201).json({id: resultado.insertId, nome, endereco});
            return;
        } else {
            res.status(400).status('Erro ao cadastrar mercado.', erro);
        }
    })
});

app.get('/mercados', (req, res) => {
    const query = 'SELECT nome, endereco FROM mercados';

    conexao.query(query, (erro, resultado) => {
        if(!erro){
            console.log('Mercados listados com sucesso.');
            res.status(200).json(resultado);
            return;
        } else {
            res.status(400).status('Erro ao listar mercados.', erro);
        }
    })
});

app.delete('/mercados/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM mercados WHERE id = ?';

    conexao.query(query, [id], (erro, resultado) => {
        if(!erro){
            console.log('Mercado deletado com sucesso.', resultado);
            res.status(200).json(resultado);
            return;
        } else {
            res.status(400).status('Erro ao deletar mercado.', erro);
        }
    })
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});