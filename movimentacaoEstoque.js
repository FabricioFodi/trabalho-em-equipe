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
    .then(response => {
        if(!response.ok){
            return response.json().then(data => {
                alert(data.erro || 'Erro ao cadastrar movimentação.');
            });
        }
        console.log('Movimentação cadastrada com sucesso.');
        return response.json();
    })
    .then(data => {
        if(data && data.sucesso){
            console.log('ID da movimentação cadastrada:', data.id);
            formMovimentacaoEstoque.reset();
        }
    })
    .catch(erro => {
        console.error('Erro ao cadastrar movimentação.', erro);
    });
});