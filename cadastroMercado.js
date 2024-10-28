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
                console.log('ID do mercado cadastrado:', data.id);
                form.reset();
            }
        })
        .catch(erro => {
            console.error('Erro ao cadastrar mercado.', erro);
        });
});


// Listar mercados // Método GET
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
                item.innerHTML = `${mercado.nome} - ${mercado.endereco}`;

                const btnExcluir = document.createElement('button');
                btnExcluir.textContent = 'Excluir';

                // Passando o ID correto do mercado para a função excluirMercado
                btnExcluir.addEventListener('click', () => {
                    excluirMercado(mercado.id);
                });

                item.appendChild(btnExcluir);
                lista.appendChild(item);
            });
        }).catch(erro => {
            console.error('Erro ao listar mercados.', erro);
        });
});
function excluirMercado(id) {
    console.log('ID do mercado a ser excluído:', id);

    fetch(`http://localhost:3000/mercados/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    alert(data.erro || 'Erro ao excluir mercado.');
                });
            }
            console.log('Mercado excluído com sucesso.');
            botaoListar.click();
        })
        .catch(erro => {
            console.error('Erro ao excluir mercado.', erro);
        });
};