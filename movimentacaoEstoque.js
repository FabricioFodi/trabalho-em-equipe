const formMovimentacaoEstoque = document.getElementById('formMovimentacao');
const botaoSalvarMovimentacao = document.getElementById('botaoMovimentacao');
const botaoListarMovimentacao = document.getElementById('listarMovimentacoes');
const listaDeMovimentacoes = document.getElementById('listaMovimentacoes');

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
})