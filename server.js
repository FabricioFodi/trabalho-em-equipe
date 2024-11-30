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
            return res.status(200).json(resultado); 
        } 
            res.status(400).json({erro: 'Erro ao listar mercados.', detalhe: erro});
    })
});

//Método delete para exclur mercado
app.delete('/mercados/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM mercados WHERE id = ?';

    conexao.query(query, [id], (erro, resultado) => {
        if(!erro){
            return res.status(200).json({sucesso: true, mensagem: 'Mercado deletado com sucesso.'});
        } 
            res.status(400).json({erro: 'Erro ao deletar mercado.', detalhe: erro});
    })
});

//Método get para buscar mercado pelo id
app.get('/mercados/:id', (req, res) => {
    const { id }= req.params;
    const query = 'SELECT nome, endereco FROM mercados WHERE id = ?';

    conexao.query(query, [id], (erro, resultado) => {
        if(!erro) {
            console.log('Mercado encontrado com sucesso.', resultado);
            return res.status(200).json(resultado[0]);
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
            return res.status(200).json({sucesso: true, mensagem: 'Mercado atualizado com sucesso.'});    
        }
        res.status(400).json({erro: 'Erro ao atualizar mercado.', detalhe: erro});
    })
});

//Método post para cadastrar produtos em um mercado
app.post('/mercados/:id/produtos', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;
    const query = 'INSERT INTO produtos (nome, descricao, preco, quantidade, mercado_id) VALUES (?, ?, ?, ?, ?)';

    conexao.query(query, [nome, descricao, preco, quantidade, id], (erro, resultados) => {
        if(!erro){
            return res.status(201).json({sucesso: true, id: resultados.insertId});
        }
        res.status(400).json({erro: 'Erro ao cadastrar produto.', detalhe: erro});

    });
});

//Método GET para listar produtos de um mercado
app.get('/mercados/:id/produtos', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM produtos WHERE mercado_id = ?';

    conexao.query(query, [id], (erro, resultados) => {
        if(!erro){
            return res.status(200).json(resultados);    
        }
        res.status(400).json({erro: 'Erro ao listar produtos do mercados.', detalhe: erro});
    });
});

//Método GET para buscar o id do produto pelo id do mercado
app.get('/mercados/:id/produtos/:produtoId', (req, res) => {
    const { id, produtoId } = req.params;
    const query = 'SELECT * FROM produtos WHERE mercado_id = ? AND id = ?';

    conexao.query(query, [id, produtoId], (erro, resultados) => {
        if(!erro){
            return res.status(200).json({sucesso: true, produto: resultados[0]});
        }
        res.status(400).json({erro: 'Erro ao buscar produto pelo ID.', detalhe: erro});
    });
});

//Método PUT para atualizar produto específico
app.put('/mercados/:id/produtos/:produtoId', (req, res) => {
    const { id, produtoId } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;
    const query = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade = ? WHERE mercado_id = ? AND id = ?';

    conexao.query(query, [nome, descricao, preco, quantidade, id, produtoId], (erro, resultados) => {
        if(!erro){
            return res.status(200).json({sucesso: true, mensagem: 'Produto atualizado com sucesso.'});
        }
        res.status(400).json({erro: 'Erro ao atualizar produto.', detalhe: erro});
    });
});

//Método DELETE para deletar produto específico
app.delete('/mercados/:id/produtos/:produtoId', (req, res) => {
    const { id, produtoId } = req.params;
    const query = 'DELETE FROM produtos WHERE mercado_id = ? AND id = ?';

    conexao.query(query, [id, produtoId], (erro, resultados) => {
        if (erro) {
            return res.status(400).json({ erro: 'Erro ao deletar produto.', detalhe: erro });
        }
        
        if (resultados.affectedRows === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado.' });
        }

        res.status(200).json({ sucesso: true, mensagem: 'Produto deletado com sucesso.' });
    });
});
//Método POST para cadastrar movimentação de estoque
app.post('/mercados/:id/produtos/:produtoId/movimentacoes', (req, res) => {
    const { id, produtoId } = req.params;
    const { tipoMovimentacao, quantidadeMovimentacao } = req.body;
    const query = 'INSERT INTO movimentacoes (tipo, quantidade, produto_id) VALUES (?, ?, ?)';

    conexao.query(query, [tipoMovimentacao, quantidadeMovimentacao, produtoId], (erro, resultados) => {
        if(!erro){
            return res.status(201).json({sucesso: true, id: resultados.insertId});
        }
        res.status(400).json({erro: 'Erro ao cadastrar movimentação.', detalhe: erro});
    });
});

//Método GET para listar movimentações de um produto
app.get('/mercados/:id/produtos/:produtoId/movimentacoes', (req, res) => {
    const { id, produtoId } = req.params;
    const query = 'SELECT * FROM movimentacoes WHERE produto_id = ?';

    conexao.query(query, [produtoId], (erro, resultados) => {
        if(!erro){
            return res.status(200).json(resultados);
        }
        res.status(400).json({erro: 'Erro ao listar movimentações.', detalhe: erro});
    });
});

// Método DELETE para deletar uma movimentação específica
app.delete('/mercados/:id/produtos/:produtoId/movimentacoes/:movimentacaoId', (req, res) => {
    const { movimentacaoId } = req.params;
    const query = 'DELETE FROM movimentacoes WHERE id = ?';

    conexao.query(query, [movimentacaoId], (erro, resultado) => {
        if (!erro) {
            // Verifica se alguma linha foi afetada
            if (resultado.affectedRows > 0) {
                return res.status(200).json({ sucesso: true, mensagem: 'Movimentação deletada com sucesso' });
            } else {
                return res.status(404).json({ sucesso: false, mensagem: 'Movimentação não encontrada' });
            }
        }
        res.status(400).json({ erro: 'Erro ao deletar movimentação.', detalhe: erro });
    });
});


//Método POST para cadastrar movimentação de estoque
app.post('/mercados/:id/produtos/:produtoId/movimentacoes', (req, res) => {
    const { id, produtoId } = req.params;
    const { quantidadeMovimentacao, tipoMovimentacao } = req.body;
    const query = 'INSERT INTO movimentacoes (quantidade, tipo, produto_id) VALUES (?, ?, ?)';

    conexao.query(qurey, [quantidadeMovimentacao, tipoMovimentacao, produtoId], (erro, resultados) => {
        if(!erro){
            return res.status(201).json({sucesso: true, id: resultados.insertId });
        }
        res.status(400).json({erro: 'Erro ao cadastrar movimentações.', detalhe: erro});
    });
});

//Método GET para listar movimentações de um produto
app.get('/mercados/:id/produtos/:produtoId/movimentacoes', (req, res) => {
    const { id, produtoId } = req.params;
    const query = 'SELECT * FROM movimentacoes WHERE produto_id = ?';

    conexao.query(query, [produtoId, id], (erro, resultados) => {
        if(!erro){
            return res.status(200).json(resultados);
        }
        res.status(400).json({erro: 'Erro ao listar movimentações.', detalhe: erro});
    });
});


// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando http://localhost:${PORT}`);
});