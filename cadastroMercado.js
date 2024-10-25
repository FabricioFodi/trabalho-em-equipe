const form = document.getElementById('input-form');
const botaoCadastrar = document.getElementById('cadastrarMercado');
const botaoListar = document.getElementById('listarMercados');


//Cadastrar mercado //Método Post
botaoCadastrar.addEventListener('click', (e) => {
    e.preventDefault();

    const nome = form.elements['nome'].value;
    const endereco = form.elements['endereco'].value;

    if (!nome || !endereco) {
        alert('Nome e endereço são obrigatórios!');
        return;
    }

    fetch('http://localhost:3000/mercados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, endereco }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    alert(data.erro || 'Erro ao cadastrar mercado.');
                });
            }
            console.log('Mercado cadastrado com sucesso.');
            return response.json();
        })
        .then(data => {
            if (data && data.sucesso) {
                form.reset();
            }
        })
        .catch(erro => {
            console.error('Erro ao cadastrar mercado.', erro);
        });
});


//Listar mercados // Método Get
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
                btnExcluir.textContent = 'Excluir';
                item.textContent = `${mercado.nome} - ${mercado.endereco} <button id="excluirMercado">Excluir</button>`;
                lista.appendChild(item);
            });
        }).catch(erro => {
            console.error('Erro ao listar mercados.', erro);
        });

    // Excluir mercado // Método Delete
    
});

