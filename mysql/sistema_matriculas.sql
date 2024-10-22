-- Criação do banco de dados para o sistema de matrículas de alunos, apenas se ele ainda não existir
CREATE DATABASE IF NOT EXISTS sistema_matriculas;

-- Seleciona o banco de dados para uso
USE sistema_matriculas;

-- Criação da tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    idMatricula INT UNIQUE NOT NULL
);

-- Criação da tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT
);

-- Criação da tabela de matrículas, relacionando alunos e cursos
CREATE TABLE IF NOT EXISTS matriculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    curso_id INT NOT NULL,
    data_matricula DATE NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Exemplo de inserção inicial de um aluno (opcional)
INSERT INTO alunos (nome, idMatricula) VALUES ('Giancarlo', 907654);

-- Exemplo de inserção inicial de um curso (opcional)
INSERT INTO cursos (nome, descricao) VALUES ('Matemática Básica', 'Curso de introdução à matemática.');

-- Exemplo de inserção de uma matrícula
INSERT INTO matriculas (aluno_id, curso_id, data_matricula) 
VALUES (1, 1, CURDATE());  -- Supondo que o aluno com id 1 e o curso com id 1 existam

-- Consultas para visualizar os dados
SELECT * FROM alunos;
SELECT * FROM cursos;
SELECT * FROM matriculas;
