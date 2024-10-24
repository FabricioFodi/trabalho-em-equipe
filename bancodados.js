const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: "127.0.0.1",
    user: 'root',
    password: 'root',
    database: 'sistema_estoque' // Atualizado para refletir o novo contexto de estoque
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Deu erro:', erro.message);
        return;
    }
    console.log('Conectado com sucesso');

    // Verifica se a tabela de produtos já existe
    const checaTabela = `
        SELECT COUNT(*)
        FROM information_schema.tables 
        WHERE table_schema = 'sistema_estoque' 
        AND table_name = 'produtos'`;
    
    conexao.query(checaTabela, (erro, resultado) => {
        if (erro) {
            console.log('Erro ao verificar tabela:', erro.message);
            return;
        }

        // Se a tabela não existir, cria a tabela de produtos
        if (resultado[0]['COUNT(*)'] === 0) {
            const criaTabelaSql = `
                CREATE TABLE produtos (
                    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                    nome VARCHAR(150) NOT NULL,
                    descricao TEXT,
                    preco DECIMAL(10, 2) NOT NULL,
                    quantidade INT NOT NULL
                )`;
            
            conexao.query(criaTabelaSql, (erro, resultado) => {
                if (erro) {
                    console.log('Erro ao criar tabela:', erro.message);
                    return;
                }
                console.log('Tabela produtos criada com sucesso');
            });
        } else {
            console.log('Tabela produtos já existe');
        }
    });
});

module.exports = conexao;
