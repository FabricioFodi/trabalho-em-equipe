create database mercado_db;
use mercado_db;

create table mercados (
	id int not null  auto_increment primary key,
    nome varchar(80),
    endereco varchar(100)
);

create table produtos (
	id int not null  auto_increment primary key,
    nome varchar(60),
    descricao varchar(100),
    preco float,
    quantidade int,
    mercado_id int,
    CONSTRAINT fk_mercado_id
    FOREIGN KEY (mercado_id) REFERENCES mercados(id)
);

CREATE TABLE movimentacoes_estoque (
    id_movimentacao INT AUTO_INCREMENT PRIMARY KEY,
    id_mercado INT NOT NULL,
    id_produto INT NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATE NOT NULL,
    CONSTRAINT fk_mercado FOREIGN KEY (id_mercado) REFERENCES mercados(id_mercado),
    CONSTRAINT fk_produto FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);


insert into mercados (nome, endereco) values ('Mercado do João', 'Rua das Flores, 123');
insert into mercados (nome, endereco) values ('Mercado da Maria', 'Rua das Rosas, 456');

insert into produtos (nome, descricao, preco, quantidade, mercado_id) values ('Arroz', 'Arroz tipo 1', 10.00, 100, 1);

select * from mercados;
select * from produtos;