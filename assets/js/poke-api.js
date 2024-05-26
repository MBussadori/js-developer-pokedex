const pokeApi = {}


// Função que transforma as informações na nossa classe do pokemon-model
function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.type = types
    pokemon.type = type
    
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

//API que retorna as informações detalhadas do pokemon
pokeApi.GetPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

//API que retorna as informações do pokemon
pokeApi.getPokemons = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url) // Por padrão o fetch utiliza o GET
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.GetPokemonsDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetail) => pokemonsDetail)
        .catch((error) => console.error(error))

    
}

function convertPokemonDetailCard(pokemon) {
    const pokemonDetail = new PokemonCardDetail()

    pokemonDetail.abilites  = pokemon.abilities.map((ability) => ability.ability.name)

    pokemonDetail.height    = pokemon.height

    pokemonDetail.weight    = pokemon.weight

    pokemonDetail.image     = pokemon.sprites.front_default


    return pokemonDetail
}

pokeApi.getCardPokemonDetail = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}/`
    
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody)
        .then((pokemon) => convertPokemonDetailCard(pokemon))

}

pokeApi.getPokemon = (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/`

    return fetch(url)
    .then
}