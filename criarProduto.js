const { response } = require("express");

const formProduto = document.getElementById('formProduto');
const botaoCriar = document.getElementById('BotaoCriar');

// Cria um produto // Método POST
botaoCriar.addEventListener('click', (e) => {
    e.preventDefault();

    const nome = formProduto.elements['nomeProduto'].value;
    const descricao = formProduto.elements['descricaoProduto'].value;
    const preco = formProduto.elements['precoProduto'].value;
    const quantidade = formProduto.elements['quantidadeProduto'].value;

    if( !nome || !descricao || !preco || !quantidade){
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${id}/produtos`, {
        method: 'POST',
        heaaders: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, descricao, preco, quantidade })
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(data => {
                alert(data.erro || 'Erro ao criar produto.')
            })
        }
    })
    .then(data => {
        if(data && data.suceeso){
            console.log('Produto criado com sucesso.');
            formProduto.requestFullscreen();
        }
    })
    .catch(erro => {
        console.error('Erro ao criar produto.', erro);
    });
});