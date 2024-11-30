const formAtualizarProduto = document.getElementById('atualizarProdutoEspecifico');
const botaoAtualizarProduto = document.getElementById('botaoAtualizarProduto');

botaoAtualizarProduto.addEventListener('click', (e) => {
    e.preventDefault();

    const idMercado = formAtualizarProduto.elements['idMercado'].value;
    const idProduto = formAtualizarProduto.elements['idProduto'].value;
    const nome = formAtualizarProduto.elements['nomeProduto'].value;
    const descricao = formAtualizarProduto.elements['descricaoProduto'].value;
    const preco = formAtualizarProduto.elements['precoProduto'].value;
    const quantidade = formAtualizarProduto.elements['qtdProduto'].value;

    if( !idMercado || !idProduto || !nome || !descricao || !preco || !quantidade){
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${idMercado}/produtos/${idProduto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, descricao, preco, quantidade })
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(data =>
                alert(data.erro || 'Erro ao atualizar produto.')
            )
        }
        return response.json();
    })
    .then(data => {
        if(data && data.sucesso){
            console.log('Produto atualizado com sucesso.');
            formAtualizarProduto.reset();
        }
    })
    .catch(erro => {
        console.error('Erro ao atualizar produto.', erro);
    })
});