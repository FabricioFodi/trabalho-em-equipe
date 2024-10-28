const formProduto = document.getElementById('formProduto');
const botaoCriar = document.getElementById('botaoCriar');
const botaoListarProdutos = document.getElementById('botaoListar');

// Cria um produto // Método POST
botaoCriar.addEventListener('click', (e) => {
    e.preventDefault();

    const id = formProduto.elements['IDMercado']?.value;
    console.log("ID Mercado:", id);
    const nome = formProduto.elements['nomeProduto'].value;
    const descricao = formProduto.elements['descricaoProduto'].value;
    const preco = formProduto.elements['precoProduto'].value;
    const quantidade = formProduto.elements['qtdProduto'].value;

    if( !nome || !descricao || !preco || !quantidade){
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${id}/produtos`, {
        method: 'POST',
        headers: {
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
        return response.json();
    })
    .then(data => {
        if(data && data.sucesso){
            console.log('Produto criado com sucesso.');
            formProduto.reset();
        }
    })
    .catch(erro => {
        console.error('Erro ao criar produto.', erro);
    });
});

//Método GET para listar produtos
botaoListarProdutos.addEventListener('click', (e) => {
    e.preventDefault();

    const id = formProduto.elements['IDMercado'].value;

    if(!id){
        alert('Por favor, preencha o campo ID do mercado.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${id}/produtos`)
    .then(response => {
        if(!response.ok){
            return response.json().then(data => {
                alert(data.erro || 'Erro ao buscar produtos.');
            })
        }
        return response.json();
    })
    .then(produtos => {
        if(!produtos){
            alert('Nenhum produto encontrado.');
            return;
        }

        const listaProdutos = document.getElementById('listaProdutos');
        listaProdutos.innerHTML = '';

        produtos.forEach(produto => {
            const item = document.createElement('li');
            item.textContent = `${produto.nome} - ${produto.descricao} - R$ ${produto.preco} - Qtd: ${produto.quantidade}`;
            listaProdutos.appendChild(item);
        })
    })
    .catch(erro => {
        alert(error.message === 'Erro ao buscar produtos.' ? erro.message : 'Erro ao buscar produtos.');
        console.log('Erro ao buscar produtos.', erro);
    });
});