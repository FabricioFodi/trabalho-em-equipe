const formAtualizarMercado = document.getElementById('formAtualizarMercado');
const botaoAtualizar = document.getElementById('BotaoAtualizar');

// Atualiza um mercado // Método PUT
botaoAtualizar.addEventListener('click', (e) => {
    e.preventDefault();

    const id = formAtualizarMercado.elements['id'].value;
    const nome = formAtualizarMercado.elements['nomeMercado'].value;
    const endereco = formAtualizarMercado.elements['enderecoMercado'].value;

    if( !id || !nome || !endereco){
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch(`http://localhost:3000/mercados/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, endereco })
    })
    .then(response => {
        if(!response.ok){
            return response.json().then(data =>
                alert(data.erro || 'Erro ao atualziar mercado.')
            )
        }
        return response.json();
    })
    .then(data => {
        if(data && data.sucesso){
            console.log('Mercado atualizado com succeso.');
            formAtualizarMercado.reset();
        }
    })
    .catch(erro => {
        console.error('Erro ao atualizar mercado.', erro);
    })
});