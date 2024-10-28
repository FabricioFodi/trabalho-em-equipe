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

select * from mercados;
select * from produtos;