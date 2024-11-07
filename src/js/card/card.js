import { pokemonList } from "../constants/constants.js"; // Importa a lista de Pokémon de um arquivo de constantes

// Função para capitalizar a primeira letra do nome
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para acionar a busca de Pokémon
function searchPokemon(query) {
    document.getElementById('pokemon-search').value = query; // Preenche o campo de busca com o nome do Pokémon
    document.getElementById('search-button').click(); // Simula o clique no botão de busca
}

// Mapeamento de cores por tipo de Pokémon
const typeColors = {
    fire: '#f08030',
    water: '#6890f0',
    grass: '#78c850',
    electric: '#f8d030',
    psychic: '#f85888',
    ice: '#98d8d8',
    dragon: '#7038f8',
    dark: '#705848',
    fairy: '#ee99ac',
    ghost: '#705898',
    steel: '#b8b8d0',
    poison: '#a040a0',
    rock: '#b8a038',
    flying: '#a890f0',
    bug: '#a8b820',
    fighting: '#c03028',
    normal: '#a8a878',
    ground: '#e0c068'
};



// Função assíncrona para criar um card de Pokémon
export async function createCard(pokemon, index, mainType) {
    try {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${index}`);
        if (!speciesResponse.ok) {
            throw new Error(`Erro ao buscar detalhes da espécie para o Pokémon: ${pokemon.name}`);
        }

        const speciesData = await speciesResponse.json();
        const description = speciesData.flavor_text_entries[0].flavor_text.replace(/\n|\f/g, ' ');
        const capitalizedPokemonName = capitalizeFirstLetter(pokemon.name);

        const card = document.createElement('div');
        card.classList.add('card', mainType); // Adiciona a classe do tipo principal do Pokémon
        card.style.width = '18rem';

        card.innerHTML = `
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png" class="card-img-top" alt="${capitalizedPokemonName}">
            <div class="card-body">
                <h5 class="card-title" style="text-align: center;">${capitalizedPokemonName}</h5>
                <p class="card-text">${description}</p>
            </div>
        `;

        const verMaisButton = document.createElement('button');
        verMaisButton.innerText = 'Ver mais';
        verMaisButton.classList.add('btn', 'btn-primary');
        verMaisButton.addEventListener('click', () => searchPokemon(pokemon.name));
        card.querySelector('.card-body').appendChild(verMaisButton);

        pokemonList.appendChild(card);
    } catch (error) {
        console.error("Erro ao criar o card:", error);
        pokemonList.innerHTML += `<div class="card-error">Não foi possível carregar ${pokemon.name}</div>`;
    }
}
