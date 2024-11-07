// Função para renderizar os detalhes do Pokémon
function renderPokemonDetails(pokemon) {
    const detailsDiv = document.getElementById('modal-body');

    detailsDiv.innerHTML = `
        <h2 class="text-center">${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" class="card-img-top mx-auto d-block" alt="${pokemon.name}">
        <p><strong>Número:</strong> #${pokemon.id.toString().padStart(3, '0')}</p>
        <p><strong>Tipo(s):</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
        <p><strong>Habilidades:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
        <p><strong>Estatísticas:</strong></p>
        <ul>
            ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
    `;
}

