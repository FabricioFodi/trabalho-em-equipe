const form = document.getElementById('input-form');
const botaoCadastrar = document.getElementById('cadastrarMercado');
const botaoListar = document.getElementById('listarMercados');

botaoCadastrar.addEventListener('click', (e) => {
    e.preventDefault();

    const nome = form.elements['nome'].value;
    const endereco = form.elements['endereco'].value;

    fetch('http://localhost:3000/mercados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, endereco }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar mercado.');
            }
            console.log('Mercado cadastrado com sucesso.');
            return response.json();
        })
        .then(data => {
            console.log(data);
            form.reset();
        })
        .catch(erro => {
            console.error('Erro ao cadastrar mercado.', erro);
        });
});


botaoListar.addEventListener('click', (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/mercados')
        .then(response => response.json())
        .then(mercados => {
            console.log(mercados);
            const lista = document.getElementById('listaMercados');
            lista.innerHTML = '';
            mercados.forEach(mercado => {
                const item = document.createElement('li');
                const btnExcluir = document.createElement('button');
                item.textContent = `${mercado.nome} - ${mercado.endereco}`;
                btnExcluir.textContent = 'Excluir';
                lista.appendChild(item);
            });
        }).catch(erro => {
            console.error('Erro ao listar mercados.', erro);
        });
});

