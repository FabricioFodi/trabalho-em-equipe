const formProcurar = document.getElementById('formMercadoProduto');
const botaoProcurar = document.getElementById('listarOsProdutos');
const ulProdutos = document.getElementById('listaProdutosEspecificos');

botaoProcurar.addEventListener('click', (e) => {
    e.preventDefault();

    const mercado = formProcurar.elements['IdDoMercado'].value;
    const produto = formProcurar.elements['IdDoProduto'].value;

    if(!mercado || !produto){
        alert('Preencha todos os campos!');
        return;
    }

    fetch(`http://localhost:3000/mercados/${mercado}/produtos/${produto}`)
    .then(response =>{  
        if(!response.ok){
            return response.json().then(data => {
                alert(data.erro || 'Erro ao buscar produto.')
            })
        }
        return response.json();
    })
    .then(data => {
        if(data && data.sucesso && data.produto){
            ulProdutos.innerHTML = '';
            const li = document.createElement('li');
            li.textContent = `Nome: ${data.produto.nome} | Descrição: ${data.produto.descricao} | Preço: ${data.produto.preco} | Quantidade: ${data.produto.quantidade}`;
            ulProdutos.appendChild(li);
        } else {
            alert('Produto não encontrado!');
        }
        })
    .catch(erro => {
        alert(erro.message === 'Erro ao buscar produto pelo ID.' ? erro.message : 'Produto não encontrado!');
        console.error('Erro ao buscar produto:', erro);
    });
});