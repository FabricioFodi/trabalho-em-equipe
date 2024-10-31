const formDeletar = document.getElementById('deletarProduto');
const botaoDeletar = document.getElementById('botaoDeletarProduto');

botaoDeletar.addEventListener('click', (e) => {
    e.preventDefault();

    const idMercadoDelete = formDeletar.elements['idMercadoDelete'].value;
    const idProdutoDelete = formDeletar.elements['idProdutoDelete'].value;

    if(!idMercadoDelete || !idProdutoDelete){
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${idMercadoDelete}/produtos/${idProdutoDelete}`, {
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
        if(data && data.sucesso === true){
            alert('Produto deletado com sucesso.');
            console.log('Produto deletado com sucesso.');
            form.reset();
        } else {
            if(data.status === 404){
                alert(data.erro);
            }
        }
    })
    .catch(erro => {

        console.error('Erro ao deletar produto.', erro);
    });
});