const btnBuscar = document.getElementById('buscarMercado');
const input = document.getElementById('buscarId');

// Faz uma busca do mercado pelo ID //Método Get
btnBuscar.addEventListener('click', (e) => {
    e.preventDefault();
    const id = input.value;

    // Verifica se o ID foi preenchido
    if (!id) {
        alert('Por favor, insira um ID para buscar.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar mercado pelo ID.');
            return response.json();
        })
        .then(mercado => {
            const listaId = document.getElementById('ProcurarMercado');
            listaId.innerHTML = '';

            const item = document.createElement('li');
            item.textContent = `${mercado.nome} - ${mercado.endereco}`;
            listaId.appendChild(item);
        })
        .catch(erro => {
            alert(erro.message === 'Erro ao buscar mercado pelo ID.' ? erro.message : 'Mercado não encontrado!');
            console.error('Erro ao buscar mercado:', erro);
        });
});
