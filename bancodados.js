const mysql = require('mysql2');

const conexao = mysql.createConnection({
    host: "127.0.0.1",
    user: 'root',
    password: 'root',
    database: 'sistema_matriculas'
});

conexao.connect((erro) => {
    if (erro) {
        console.log('Deu erro:', erro.message);
        return;
    }
    console.log('Conectado com sucesso');

    // Verifica se a tabela já existe
    const checaTabela = `
        SELECT COUNT(*)
        FROM information_schema.tables 
        WHERE table_schema = 'sistema_matriculas' 
        AND table_name = 'alunos'`;
    
    conexao.query(checaTabela, (erro, resultado) => {
        if (erro) {
            console.log('Erro ao verificar tabela:', erro.message);
            return;
        }

        // Se a tabela não existir, cria a tabela
        if (resultado[0]['COUNT(*)'] === 0) {
            const criaTabelaSql = `
                CREATE TABLE alunos (
                    id INT NOT NULL PRIMARY KEY,
                    nome VARCHAR(150) NOT NULL,
                    idMatricula VARCHAR(10) NOT NULL
                )`;
            
            conexao.query(criaTabelaSql, (erro, resultado) => {
                if (erro) {
                    console.log('Erro ao criar tabela:', erro.message);
                    return;
                }
                console.log('Tabela alunos criada com sucesso');
            });
        } else {
            console.log('Tabela alunos já existe');
        }
    });
});

module.exports = conexao;
