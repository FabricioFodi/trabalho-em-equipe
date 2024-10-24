-- Criação do banco de dados para o sistema de estoque, apenas se ele ainda não existir
CREATE DATABASE IF NOT EXISTS sistema_estoque;

-- Seleciona o banco de dados para uso
USE sistema_estoque;

-- Criação da tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    quantidade INT NOT NULL
);

-- Criação da tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    contato VARCHAR(150),
    telefone VARCHAR(15),
    email VARCHAR(100)
);

-- Criação da tabela de estoque, relacionando produtos e fornecedores
CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    fornecedor_id INT NOT NULL,
    data_entrada DATE NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
);

-- Exemplo de inserção inicial de um produto (opcional)
INSERT INTO produtos (nome, descricao, preco, quantidade) 
VALUES ('Caderno', 'Caderno universitário de 100 folhas', 12.50, 200);

-- Exemplo de inserção inicial de um fornecedor (opcional)
INSERT INTO fornecedores (nome, contato, telefone, email) 
VALUES ('Papelaria Central', 'José da Silva', '1234-5678', 'contato@papelariacentral.com');

-- Exemplo de inserção de entrada no estoque
INSERT INTO estoque (produto_id, fornecedor_id, data_entrada, quantidade) 
VALUES (1, 1, CURDATE(), 50); -- Supondo que o produto com id 1 e o fornecedor com id 1 existam

-- Consultas para visualizar os dados
SELECT * FROM produtos;
SELECT * FROM fornecedores;
SELECT * FROM estoque;
