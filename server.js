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

//Método post para cadastrar mercados
app.post('/mercados', (req, res) => {
    console.log('Dados recebidos:', req.body);
    const { nome, endereco } = req.body;

    if (!nome || !endereco) {
        return res.status(400).json({ erro: 'Nome e endereço são obrigatórios.' });
    }
    
    const query = 'INSERT INTO mercados (nome, endereco) VALUES (?, ?)';
    conexao.query(query, [nome, endereco], (erro, resultado) => {
        if (erro){
            return res.status(500).json({ erro });   
        } 
            return res.json({ sucesso: true, id: resultado.insertId });
    });
});

//Método get para listar mercados
app.get('/mercados', (req, res) => {
    const query = 'SELECT * FROM mercados';

    conexao.query(query, (erro, resultado) => {
        if(!erro){
            console.log('Mercados listados com sucesso.');
            res.status(200).json(resultado);
            return;
        } else {
            res.status(400).json({erro: 'Erro ao listar mercados.', detalhe: erro});
        }
    })
});

//Método delete para exclur mercado
app.delete('/mercados/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM mercados WHERE id = ?';

    conexao.query(query, [id], (erro, resultado) => {
        if(!erro){
            res.status(200).json({sucesso: true, mensagem: 'Mercado deletado com sucesso.'});
        } else {
            res.status(400).json({erro: 'Erro ao deletar mercado.', detalhe: erro});
        }
    })
});

//Método get para buscar mercado pelo id
app.get('/mercados/:id', (req, res) => {
    const { id }= req.params;
    const query = 'SELECT nome, endereco FROM mercados WHERE id = ?';

    conexao.query(query, [id], (erro, resultado) => {
        if(!erro) {
            console.log('Mercado encontrado com sucesso.', resultado);
            res.status(200).json(resultado[0]);
            return;
        }
        res.status(400).json({erro: 'Erro ao buscar mercado pelo id.', detalhe: erro});
    })
});

//Método put para atualizar mercado
app.put('/mercados/:id', (req, res) => {
    const { id } = req.params;
    const { nome, endereco } = req.body;
    const query = 'UPDATE mercados SET nome = ?, endereco = ? WHERE id = ?';

    conexao.query(query, [nome, endereco, id], (erro, resultado) => {
        if(!erro){
            res.status(200).json({sucesso: true, mensagem: 'Mercado atualizado com sucesso.'});
            return;
        }
        res.status(400).json({erro: 'Erro ao atualizar mercado.', detalhe: erro});
    })
});

//Método post para cadastrar produtos em um mercado
app.post('/mercados/:id/produtos', (req, res) => {
    const { id } =req.params;
    const { nome, descricao, preco, quantidade } = req.body;
    const query = 'INSERT INTO produtos (nome, descricao, preco, quantidade, mercado_id) VALUES (?, ?, ?, ?, ?)';

    conexao.query(query, [nome, descricao, preco, quantidade, id], (erro, resultados) => {
        if(!erro){
            res.status(201).json({sucesso: true, id: resultados.insertId});
        }
        res.status(400).json({erro: 'Erro ao cadastrar produto.', detalhe: erro});

    })
})


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});