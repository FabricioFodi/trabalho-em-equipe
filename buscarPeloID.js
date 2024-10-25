const btnBuscar = document.getElementById('buscarMercado');
const input = document.getElementById('buscarId');



// Faz uma busca do mercado pelo ID //Método Get
btnBuscar.addEventListener('click', (e) => {
    e.preventDefault();
    const id = input.value;

    if (!id) {
        alert('ID não pode ser vazio!');
        return;
    }

    fetch(`http://localhost:300/mercado_id/${id}`)
    .then(response => response.json())
    .then(mercados => {
        console.log(mercados);
        const listaId = document.getElementById('ProcurarMercado');
        listaId.innerHTML = '';
        const item = document.createElement('li');
        item.textContent = `${mercados.nome} - ${mercados.endereco}`;
        listaId.appendChild(item);
    })
    .catch(erro => {
        console.error('Erro ao buscar mercado.', erro);
    });
});