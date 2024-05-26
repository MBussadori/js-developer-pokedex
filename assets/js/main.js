//Pegando a lista de Pokemons do HTML e atribuindo a uma variavel
const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const buttonSearch = document.getElementById('buttonSearch')
const cardDetail = document.getElementById('cardDetail')


const limit = 10
const maxRecords = 151
let offset = 0
let lastPokemonList = ""
let pokemonButtonDetail


async function loadPokemonItens(offset, limit) {
        await pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
            const newHtml = pokemons.map((pokemon) =>  
            `            
                <li class="pokemon ${pokemon.type}">
                    <span class="number">${pokemon.number}</span>
                    <span class="name">${pokemon.name}</span>

                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                        </ol>

                        <img src="${pokemon.photo}" 
                            alt="${pokemon.name}">
                    </div>
                        <button class="pokemonDetailButton" type="button">
                            Detail
                        </button>
                </li>
            `).join('')

            pokemonList.innerHTML += newHtml
            addEventListenersToButtons()
            }
        )
        lastPokemonList = pokemonList.innerHTML 

}

async function loadPokemonCardDetail(pokemonSelect) {
    const pokemonId = pokemonSelect.outerText.split("\n")[0]
    let htmlCard = ''
    
    const detailPokemon = await pokeApi.getCardPokemonDetail(pokemonId)

    htmlCard = `
    <button id='closeButtonCard'>X</button>
    <img id="imageCard" src="${detailPokemon.image}">
    <ol id="cardDetailList">
    <li>Height      <span>${detailPokemon.height}</span></li>
    <li>Weight      <span>${detailPokemon.weight}</span></li>
    <li>Abilites    <span>${detailPokemon.abilites.map((ability) => capitalizeFirstLetter(ability))}</span></li>
    </ol>`


    cardDetail.innerHTML = htmlCard

    const closeButtonCard = document.getElementById('closeButtonCard')

    closeButtonCard.addEventListener('click', (event) => {
        pokemonList.style.width = ''
        pokemonList.style.display = ''
        pokemonList.style.flexDirection = ''

        cardDetail.style.display = 'none'
    })
}


function addEventListenersToButtons() {
    const pokemonButtons = document.querySelectorAll('.pokemonDetailButton')
    pokemonButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            let pokemonDetail = event.target.closest('li')
            const classCardDetail = []

            //Alterando o CSS da lista de pokemons
            pokemonList.style.width = '250px'
            pokemonList.style.display = 'flex'
            pokemonList.style.flexDirection = 'column'

            //Altrando o css do card de detalhes do pokemon
            cardDetail.style.display = 'block'
            cardDetail.classList.add('cardDetail-open')
            cardDetail.classList.add(`${pokemonDetail.innerText.split('\n')[2].toLowerCase()}`)
            
            if(cardDetail.classList.length > 2){
                cardDetail.classList.remove(`${cardDetail.classList[1]}`)
            }
            loadPokemonCardDetail(pokemonDetail)
        })
    })
}


loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', async () => {
    offset += limit 

    const qtdRecordsNextPage = offset + limit 

    if (qtdRecordsNextPage >= maxRecords) {
        const mewLimit =  maxRecords - offset
        await loadPokemonItens(offset, mewLimit)
        
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        await loadPokemonItens(offset, limit)
    }
})

//Função para deixar a primeira letra maiuscula
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }

//Função em REGEX para validar se o conteudo da string pertence ao alfabeto
function isAlphabetic(str) {
    // A expressão regular /^[A-Za-z]+$/ corresponde a strings que contêm apenas letras maiúsculas e minúsculas
    const regex = /^[A-Za-z]+$/;
    return regex.test(str);
}

buttonSearch.addEventListener('keyup', (event) => {
    
    //Faz o filtro somente ao pressionar "Enter"
    if(event.key === 'Enter') {
        let input = document.getElementById('buttonSearch').value
        
        //Valida se não está em branco
        if(input.length != 0) {
            if(isAlphabetic(input)){
                input = input.toLowerCase()
            
                let pokemons = document.getElementsByClassName('pokemon')
                let newListHTML = ``
                let achouPokemon = false
            
                for (let i = 0; i < pokemons.length; i++) {
                    if(!pokemons[i].innerText.split('\n')[1].toLowerCase().includes(input)){
                        pokemons[i].style.dispaly = "none"
                    }else {
                        achouPokemon = true
                        newListHTML += pokemons[i].outerHTML
                    }
                }
                    if(achouPokemon){ 
                        pokemonList.innerHTML = newListHTML
                    }else {
                        alert('Não foi encontrado nenhum pokemon!')
                        buttonSearch.value = ''
                    }
            } 
            else {
                alert('Digite um caracter válido')
                buttonSearch.value = ''
            }
        }
        else{
            pokemonList.innerHTML = lastPokemonList 
        }

        }
    }
)