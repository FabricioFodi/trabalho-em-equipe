const formMovimentacaoEstoque = document.getElementById('formMovimentacao');
const botaoSalvarMovimentacao = document.getElementById('botaoMovimentacao');
const botaoListarMovimentacao = document.getElementById('listarMovimentacoes');
const listaDeMovimentacoes = document.getElementById('listarMovimentacoes');
const deletar = document.getElementById('deletarMovimentacao');

//Método POST para cadastrar movimentação de estoque
botaoSalvarMovimentacao.addEventListener('click', (e) => {
    e.preventDefault();

    const idLoja = formMovimentacaoEstoque.elements['idLoja'].value;
    const idProduct = formMovimentacaoEstoque.elements['idProduct'].value;
    const quantidadeMovimentacao = formMovimentacaoEstoque.elements['quantidadeMovimentacao'].value;
    const tipoMovimentacao = formMovimentacaoEstoque.elements['tipoMovimentacao'].value;

    fetch(`http://localhost:3000/mercados/${idLoja}/produtos/${idProduct}/movimentacoes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idLoja, idProduct, tipoMovimentacao, quantidadeMovimentacao})
    })
    .then(response => {
        if(!response.ok){
            alert('Erro ao salvar movimentação');
            throw new Error('Erro ao salvar movimentação');
        }
        return response.json();
    })
    .then(data => {
        alert('Movimentação salva com sucesso');
        console.log('Movimentação salva com sucesso',data);
    })
    .catch(error => {
        console.error('Erro ao salvar movimentação', error);
    });
});

//Método GET para listar movimentações de um produto

listaDeMovimentacoes.addEventListener('click', (e) => {
    e.preventDefault();

    const idLoja = formMovimentacaoEstoque.elements['idLoja'].value;
    const idProduct = formMovimentacaoEstoque.elements['idProduct'].value;

    fetch(`http://localhost:3000/mercados/${idLoja}/produtos/${idProduct}/movimentacoes`)
    .then(response => {
        if(!response.ok){
            alert('Erro ao listar movimentações');
            throw new Error('Erro ao listar movimentações');
        }
        return response.json();
    })
    .then(data => {
        alert('Movimentações listadas com sucesso');
        console.log('Movimentações listadas com sucesso',data);
    })
    .catch(error => {
        console.error('Erro ao listar movimentações', error);
    });
});

// Método DELETE para deletar uma movimentação específica
deletar.addEventListener('click', (e) => {
    e.preventDefault();

    const idLoja = formMovimentacaoEstoque.elements['idLoja'].value;
    const idMercado= formMovimentacaoEstoque.elements['idMercado'].value;
    const idMovimentacao = formMovimentacaoEstoque.elements['idMovimentacao'].value;

    fetch(`http://localhost:3000/mercados/${idLoja}/produtos/${idMercado}/movimentacoes/${idMovimentacao}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idLoja, idMercado, idMovimentacao })
    })
    .then(response => {
        if(!response.ok){
            alert('Erro ao deletar movimentação');
            throw new Error('Erro ao deletar movimentação');
        }
        return response.json();
    })
    .then(data => {
        alert('Movimentação deletada com sucesso');
        console.log('Movimentação deletada com sucesso',data);
    })
    .catch(error => {
        console.error('Erro ao deletar movimentação', error);
    });
});