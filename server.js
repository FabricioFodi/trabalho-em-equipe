const express = require('express');
const cors = require('cors'); // Corrigido o nome do módulo
const server = express();
const conexao = require('./bancodados'); // Corrigido o caminho do módulo

// Middleware para tratar JSON
server.use(express.json());
server.use(cors()); // Corrigido o nome do middleware

// Rota GET para retornar a mensagem inicial e informar como acessar a API
server.get('/', (req, res) => {
    console.log('Rota GET inicial');
    res.json({ mensagem: 'Acesse a API através de http://localhost:3000/alunos ou http://localhost:3000/cursos' });
});

// Rota GET para retornar todos os alunos
server.get('/alunos', (req, res) => {
    console.log('Consulta de todos os alunos');
    conexao.query('SELECT * FROM alunos', (erro, resultados) => {
        if (erro) {
            console.error('Erro ao consultar alunos:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao consultar alunos.' });
        }
        res.json(resultados);
    });
});

// Rota GET para retornar todos os cursos
server.get('/cursos', (req, res) => {
    console.log('Consulta de todos os cursos');
    conexao.query('SELECT * FROM cursos', (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ mensagem: 'Erro ao consultar cursos.' });
        }
        res.json(resultados);
    });
});

// Rota POST para adicionar um novo aluno e matriculá-lo
server.post('/alunos', (req, res) => {
    console.log('Requisição para cadastro de aluno');
    console.log('Body da requisição:', req.body);

    const { id, nome, idMatricula, curso_id, data_matricula } = req.body;

    // Verificação básica
    if (!id || !nome || !idMatricula || !curso_id || !data_matricula) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    // Verificar se o aluno já existe
    conexao.query('SELECT * FROM alunos WHERE id = ?', [id], (erro, resultados) => {
        if (erro) {
            console.error('Erro ao verificar aluno existente:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao verificar aluno existente.' });
        }
        if (resultados.length > 0) {
            return res.status(409).json({ mensagem: 'ID de aluno já cadastrado.' });
        }

        const novoAluno = { id, nome, idMatricula };

        // Adiciona o novo aluno à tabela
        conexao.query('INSERT INTO alunos SET ?', novoAluno, (erro, resultado) => {
            if (erro) {
                console.error('Erro ao cadastrar aluno:', erro.message);
                return res.status(500).json({ mensagem: 'Erro ao cadastrar aluno.' });
            }
            console.log('Novo aluno adicionado:', novoAluno);

            // Verificar se o curso existe antes de matricular
            conexao.query('SELECT * FROM cursos WHERE id = ?', [curso_id], (erro, resultados) => {
                if (erro) {
                    console.error('Erro ao verificar curso existente:', erro.message);
                    return res.status(500).json({ mensagem: 'Erro ao verificar curso existente.' });
                }
                if (resultados.length === 0) {
                    return res.status(404).json({ mensagem: 'Curso não encontrado.' });
                }

                // Agora, vamos cadastrar a matrícula
                const novaMatricula = { aluno_id: id, curso_id, data_matricula };
                conexao.query('INSERT INTO matriculas SET ?', novaMatricula, (erro) => {
                    if (erro) {
                        console.error('Erro ao cadastrar matrícula:', erro.message);
                        return res.status(500).json({ mensagem: 'Erro ao cadastrar matrícula.' });
                    }
                    res.status(201).json({ mensagem: 'Aluno cadastrado e matriculado com sucesso!', aluno: novoAluno, matricula: novaMatricula });
                });
            });
        });
    });
});

// Rota GET para retornar todas as matrículas com informações do aluno e do curso
server.get('/matriculas', (req, res) => {
    console.log('Consulta de todas as matrículas');
    const sqlConsultaMatriculas = `
        SELECT 
            m.id AS matricula_id,  -- Use 'm.id' para referir-se à matrícula
            a.nome AS aluno_nome,
            m.curso_id,  -- Mantendo o curso_id, mas pode ser alterado conforme necessidade
            c.nome AS curso_nome,
            m.data_matricula
        FROM 
            matriculas m
        JOIN 
            alunos a ON m.aluno_id = a.id
        JOIN 
            cursos c ON m.curso_id = c.id
    `;
    
    conexao.query(sqlConsultaMatriculas, (erro, resultados) => {
        if (erro) {
            console.error('Erro ao consultar matrículas:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao consultar matrículas.' });
        }
        
        // Exibir informações das matrículas no console
        resultados.forEach((matricula) => {
            console.log(`Aluno: ${matricula.aluno_nome}, Matrícula: ${matricula.matricula_id}, Curso: ${matricula.curso_nome}, Data da Matrícula: ${matricula.data_matricula}`);
        });
        
        // Retorna os resultados
        res.json(resultados);
    });
});

// Rota PATCH para atualizar um aluno existente
server.patch('/alunos/:id', (req, res) => {
    const alunoId = req.params.id; // ID do aluno a ser atualizado
    const { nome, idMatricula } = req.body; // Dados para atualização

    // Verifica se todos os campos são obrigatórios
    if (!nome || !idMatricula) {
        return res.status(400).json({ mensagem: 'Nome e ID da matrícula são obrigatórios.' });
    }

    // Atualiza o aluno no banco de dados
    const sqlAtualizaAluno = 'UPDATE alunos SET nome = ?, idMatricula = ? WHERE id = ?';

    conexao.query(sqlAtualizaAluno, [nome, idMatricula, alunoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao atualizar aluno:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao atualizar aluno.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
        }
        res.json({ mensagem: 'Aluno atualizado com sucesso!', aluno: { id: alunoId, nome, idMatricula } });
    });
});

// Rota PUT para atualizar um aluno existente
server.put('/alunos/:id', (req, res) => {
    const alunoId = req.params.id;
    const { nome, idMatricula } = req.body;

    console.log(`Requisição para atualizar o aluno com id ${alunoId}`);
    console.log('Body da requisição:', req.body);

    // Verificação básica
    if (!nome || !idMatricula) {
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    // Atualiza o aluno na tabela
    const atualizarAlunoSql = 'UPDATE alunos SET nome = ?, idMatricula = ? WHERE id = ?';
    
    conexao.query(atualizarAlunoSql, [nome, idMatricula, alunoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao atualizar aluno:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao atualizar aluno.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
        }
        res.json({ mensagem: 'Aluno atualizado com sucesso!' });
    });
});

// Rota DELETE para remover um aluno existente
server.delete('/alunos/:id', (req, res) => {
    const alunoId = req.params.id; // ID do aluno a ser removido

    console.log(`Requisição para remover o aluno com id ${alunoId}`);

    // Deleta o aluno na tabela
    const sqlDeletaAluno = 'DELETE FROM alunos WHERE id = ?';

    conexao.query(sqlDeletaAluno, [alunoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao remover aluno:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao remover aluno.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Aluno não encontrado.' });
        }
        res.json({ mensagem: 'Aluno removido com sucesso!' });
    });
});

// Rota DELETE para remover um curso existente
server.delete('/cursos/:id', (req, res) => {
    const cursoId = req.params.id; // ID do curso a ser removido

    console.log(`Requisição para remover o curso com id ${cursoId}`);

    // Deleta o curso na tabela
    const sqlDeletaCurso = 'DELETE FROM cursos WHERE id = ?';

    conexao.query(sqlDeletaCurso, [cursoId], (erro, resultado) => {
        if (erro) {
            console.error('Erro ao remover curso:', erro.message);
            return res.status(500).json({ mensagem: 'Erro ao remover curso.' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensagem: 'Curso não encontrado.' });
        }
        res.json({ mensagem: 'Curso removido com sucesso!' });
    });
});

// Inicia o servidor na porta 3000
server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
