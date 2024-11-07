import { createCard } from "./card/card.js";
import { listAllPokemons } from "./fetchApi/fetchfunctions.js";

console.clear(); // Limpa o console no início para evitar ruído

let currentPage = 1;
const pokemonsPerPage = 18;

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

// Função para carregar Pokémon por página
async function loadPokemons(page = 1) {
    const pokemonsPerPage = 18;
    const offset = (page - 1) * pokemonsPerPage;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonsPerPage}&offset=${offset}`;

    const response = await fetch(url);
    const { results } = await response.json();

    const pokemonList = document.getElementById("pokemon-list");
    pokemonList.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
        const pokemon = results[i];
        const pokemonId = offset + i + 1;

        const pokemonDataResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = await pokemonDataResponse.json();
        const mainType = pokemonData.types[0].type.name;

        // Passa o tipo principal para createCard
        createCard(pokemon, pokemonId, mainType);
    }

    currentPage = page;
    updatePagination();
}

await loadPokemons();

// Atualiza a paginação
function updatePagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = 41; 
    const visiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    // Botão "Anterior"
    if (currentPage > 1) {
        const prevButton = createPaginationButton("Anterior", () => loadPokemons(currentPage - 1));
        paginationContainer.appendChild(prevButton);
    }

    // Botões de páginas
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPaginationButton(i, () => loadPokemons(i));
        if (i === currentPage) pageButton.classList.add("active");
        paginationContainer.appendChild(pageButton);
    }

    // Botão "Próximo"
    if (currentPage < totalPages) {
        const nextButton = createPaginationButton("Próximo", () => loadPokemons(currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }
}

// Cria um botão de paginação
function createPaginationButton(label, onClick) {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "m-1");
    button.innerText = label;
    button.addEventListener("click", onClick);
    return button;
}

// Função para buscar um Pokémon específico
async function searchPokemon(query) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
        if (!response.ok) throw new Error('Pokémon não encontrado');

        const pokemon = await response.json();
        openModal(pokemon);

    } catch (error) {
        console.error(error.message);
        alert('Pokémon não encontrado! Por favor, verifique o nome ou número.');
    }
}

// Função para abrir o modal com os detalhes do Pokémon
async function openModal(pokemon) {
    const modal = document.getElementById('pokemon-modal');
    const modalBody = document.getElementById('modal-body');

    // Buscar detalhes da espécie para obter a cadeia evolutiva
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesData = await speciesResponse.json();

    // Obter cadeia de evolução
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    // Obter lista de evoluções
    const evolutionChain = getEvolutionList(evolutionData.chain);

    // Encontra o índice do Pokémon atual na lista de evoluções
    const currentIndex = evolutionChain.findIndex(evo => evo.name === pokemon.name);

    // Cria o conteúdo do modal
    modalBody.innerHTML = `
    <div class="modal-details-container">
        <div class="pokemon-image">
            <img src="${pokemon.sprites.front_default}" class="img-fluid" alt="${pokemon.name}">
            <h2 class="text-center">${capitalizeFirstLetter(pokemon.name)}</h2>
        </div>
        <div class="pokemon-info">
            <p><strong>Número da Carta:</strong> #${pokemon.id}</p>
            <p><strong>Tipo(s):</strong> ${pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
            <p><strong>Habilidade Principal:</strong> ${capitalizeFirstLetter(pokemon.abilities[0]?.ability.name || 'Nenhuma')}</p>
            <p><strong>Habilidade Secundária:</strong> ${capitalizeFirstLetter(pokemon.abilities[1]?.ability.name || 'Nenhuma')}</p>
            <div class="estatistica-tabela">
    <h4>Estatísticas Base:</h4>
    <table>
        <tr>
            <th>Estatística</th>
            <th>Valor</th>
        </tr>
        <tr>
            <td><strong>HP:</strong></td>
            <td>${pokemon.stats.find(stat => stat.stat.name === "hp")?.base_stat || 0}</td>
        </tr>
        <tr>
            <td><strong>Ataque:</strong></td>
            <td>${pokemon.stats.find(stat => stat.stat.name === "attack")?.base_stat || 0}</td>
        </tr>
        <tr>
            <td><strong>Defesa:</strong></td>
            <td>${pokemon.stats.find(stat => stat.stat.name === "defense")?.base_stat || 0}</td>
        </tr>
        <tr>
            <td><strong>Velocidade:</strong></td>
            <td>${pokemon.stats.find(stat => stat.stat.name === "speed")?.base_stat || 0}</td>
        </tr>
        <tr>
            <td><strong>Ataque Especial:</strong></td>
            <td>${pokemon.stats.find(stat => stat.stat.name === "special-attack")?.base_stat || 0}</td>
        </tr>
    </table>
</div>
        </div>
    </div>
    <div class="evolution-navigation">
        <button id="prev-evolution" class="btn btn-secondary" ${currentIndex <= 0 ? 'disabled' : ''}>Evolução Anterior</button>
        <button id="next-evolution" class="btn btn-secondary" ${currentIndex >= evolutionChain.length - 1 ? 'disabled' : ''}>Próxima Evolução</button>
    </div>
`;

    modal.classList.remove('d-none');

    // Eventos para os botões de navegação de evolução
    document.getElementById('prev-evolution').addEventListener('click', async () => {
        if (currentIndex > 0) {
            const previousPokemon = evolutionChain[currentIndex - 1];
            await fetchPokemonByName(previousPokemon.name);
        }
    });

    document.getElementById('next-evolution').addEventListener('click', async () => {
        if (currentIndex < evolutionChain.length - 1) {
            const nextPokemon = evolutionChain[currentIndex + 1];
            await fetchPokemonByName(nextPokemon.name);
        }
    });
}

// Função para buscar Pokémon pelo nome
async function fetchPokemonByName(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!response.ok) throw new Error('Pokémon não encontrado');
        const pokemon = await response.json();
        openModal(pokemon);
    } catch (error) {
        console.error(error.message);
    }
}

// Função para obter a lista de evoluções a partir da cadeia de evoluções
function getEvolutionList(chain) {
    const evolutions = [];
    let current = chain;

    // Percorrer a cadeia de evoluções
    while (current) {
        evolutions.push({ name: current.species.name, url: current.species.url });
        current = current.evolves_to[0]; // Ir para a próxima evolução, se houver
    }

    return evolutions;
}

// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para fechar o modal
function closeModal() {
    const modal = document.getElementById('pokemon-modal');
    modal.classList.add('d-none');
}

// Adiciona evento ao botão de busca
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('pokemon-search').value;
    if (query) {
        searchPokemon(query);
    }
});

// Evento para fechar o modal ao clicar no "X"
document.getElementById('close-modal').addEventListener('click', closeModal);

// Evento para fechar o modal ao clicar fora do conteúdo
document.getElementById('pokemon-modal').addEventListener('click', (event) => {
    if (event.target === document.getElementById('pokemon-modal')) {
        closeModal();
    }
});
