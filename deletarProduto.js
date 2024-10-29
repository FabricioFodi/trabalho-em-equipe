const formDeletar = document.getElementById('DeletarProduto');
const botaoDeletar = document.getElementById('botaoDeletarProduto');

botaoDeletar.addEventListener('click', (e) => {
    e.preventDefault();

    const idMercadoDelete = formDeletar.elements['idMercadoDelete'].value;
    const idProdutoDelete = formDeletar.elements['idProdutoDelete'].value;

    if(!idMercadoDelete || !idProdutoDelete){
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch(`http://locahost:3000/mercados/${idMercadoDelete}/produtos/${idProdutoDelete}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idMercadoDelete, idProdutoDelete })
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(data =>
                alert(data.erro || 'Erro ao deletar produto.')
            )
        }
        return response.json();
    })
    .then(data => {
        if(data && data.sucesso){
            console.log('Produto deletado com sucesso.');
            form.reset();
        }
    })
    .catch(erro => {
        console.error('Erro ao deletar produto.', erro);
    });
});