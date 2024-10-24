const express = require('express');
const cors = require('cors');
const server = express();
const conexao = require('./bancodados'); // Módulo de conexão com o banco de dados

// Middleware para tratar JSON
server.use(express.json());
server.use(cors());

// Rota GET para retornar a mensagem inicial e informar como acessar a API
server.get('/', (req, res) => {
    console.log('Rota GET inicial');
    res.json({ mensagem: 'Acesse a API através de http://localhost:3000/produtos' });
});

// Rota GET para retornar todos os produtos
server.get('/produtos', (req, res) => {
    console.log('Consulta de todos os produtos');
    conexao.query('SELECT * FROM produtos', (erro, resultados) => {
        if (erro) {
            console.error('Erro ao consultar produtos:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao consultar produtos.' });
        }
        res.json(resultados);
    });
});

// Rota POST para adicionar um novo produto ao estoque
server.post('/produtos', (req, res) => {
    console.log('Requisição para adicionar produto');
    console.log('Body da requisição:', req.body);

    const { id, nome, quantidade, preco, data_adicao } = req.body;

    // Verificação básica
    if (!id || !nome || !quantidade || !preco || !data_adicao) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    // Verificar se o produto já existe
    conexao.query('SELECT * FROM produtos WHERE id = ?', [id], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao verificar produto existente:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao verificar produto existente.' });
        }
        if (resultados.length > 0) {
            return res.status(409).json({ mensagem: 'ID de produto já cadastrado.' });
        }

        const novoProduto = { id, nome, quantidade, preco, data_adicao };

        // Adiciona o novo produto à tabela
        conexao.query('INSERT INTO produtos SET ?', novoProduto, (erro) => {
            if (erro) {
                console.error('Erro ao cadastrar produto:', erro.message);
                return res.status(500).json({ mensagem: 'Erro ao cadastrar produto.' });
            }
            console.log('Novo produto adicionado:', novoProduto);
            res.status(201).json({ mensagem: 'Produto cadastrado com sucesso!', produto: novoProduto });
        });
    });
});

// Rota PATCH para atualizar a quantidade de um produto (entrada/saída)
server.patch('/produtos/:id/quantidade', (req, res) => {
    const produtoId = req.params.id;
    const { quantidade } = req.body;

    // Verifica se a quantidade foi informada
    if (quantidade === undefined) {
        return res.status(400).json({ mensagem: 'A quantidade é obrigatória.' });
    }

    // Atualiza a quantidade do produto no banco de dados
    const sqlAtualizaQuantidade = 'UPDATE produtos SET quantidade = quantidade + ? WHERE id = ?';

    conexao.query(sqlAtualizaQuantidade, [quantidade, produtoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao atualizar quantidade do produto:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao atualizar quantidade do produto.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }
        res.json({ mensagem: 'Quantidade do produto atualizada com sucesso!' });
    });
});

// Rota PUT para atualizar as informações de um produto
server.put('/produtos/:id', (req, res) => {
    const produtoId = req.params.id;
    const { nome, preco } = req.body;

    console.log(`Requisição para atualizar o produto com id ${produtoId}`);
    console.log('Body da requisição:', req.body);

    // Verificação básica
    if (!nome || !preco) {
        return res.status(400).json({ mensagem: 'Nome e preço são obrigatórios.' });
    }

    // Atualiza o produto na tabela
    const atualizarProdutoSql = 'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?';

    conexao.query(atualizarProdutoSql, [nome, preco, produtoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao atualizar produto:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao atualizar produto.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }
        res.json({ mensagem: 'Produto atualizado com sucesso!' });
    });
});

// Rota DELETE para remover um produto do estoque
server.delete('/produtos/:id', (req, res) => {
    const produtoId = req.params.id;

    console.log(`Requisição para remover o produto com id ${produtoId}`);

    const sqlDeletaProduto = 'DELETE FROM produtos WHERE id = ?';

    conexao.query(sqlDeletaProduto, [produtoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao remover produto:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao remover produto.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }
        res.json({ mensagem: 'Produto removido com sucesso!' });
    });
});

// Inicia o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
