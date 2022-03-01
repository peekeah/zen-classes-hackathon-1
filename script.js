//Creating header
let title = document.createElement("div");
title.setAttribute("class", "container-fluid");
title.innerText = "Pokemons";
document.body.append(title);

//Creating element div with class content
let pokemon = document.createElement("div");
pokemon.setAttribute("class", "content");
document.body.appendChild(pokemon);

//Creating element div with class pokemon-list, all the pokemons are appending here
let pokemonList = document.createElement("div");
pokemonList.setAttribute("class", "pokemon-list");
document.body.querySelector(".content").appendChild(pokemonList);

//Creating element for pagination with class name pagination
let pagination = document.createElement("div");
pagination.setAttribute("class", "pagination");
document.body.appendChild(pagination);


//Creating pokemon
function createPokemon(name, abilities, moves, weight, id) {
    console.log(abilities);
    console.log(id);
    name = name.charAt(0).toUpperCase() + name.slice(1);    
    document.querySelector(".pokemon-list").innerHTML += `
        <div class="pokemon col-xl-3 col-lg-4 col-md-5 col-sm-8 col-10">
            <h2 class="d-flex justify-content-center">${name}</h2>
            <div class="pokemon-abilities d-flex my-2">
                <div class="entity col-5">Abilities:</div>
                <div class="pokemon-abilities-value-${id} col-7"></div>
            </div> 

            <div class="pokemon-moves d-flex my-2">
                <div class="entity col-5">Moves:</div>
                <div class="pokemon-moves-value-${id} col-7"></div>
            </div>

            <div class="pokemon-weight d-flex my-2">
                <div class="entity col-5">Weight:</div>
                <div class="pokemon-weight-value-${id} col-7"></div>
            </div>
        </div>
`;

//Updating Abilities, Moves, Weight of pokemon
getValues(abilities, moves, weight, id);
}

        

function getValues(abilities, moves, weight, id) {
    for(ability of abilities) {
        ability = ability.charAt(0).toUpperCase() + ability.slice(1);
        document.querySelector(`.pokemon-abilities-value-${id}`).innerHTML += `
            <div>${ability}</div> `;
    }  

    for(move of moves) {
        move = move.charAt(0).toUpperCase() + move.slice(1);
        document.querySelector(`.pokemon-moves-value-${id}`).innerHTML += `
            <div>${move}</div>
        `;
    }
    document.querySelector(`.pokemon-weight-value-${id}`).innerHTML += `${weight}`;
}


//Function to fetch data from api
async function getPokemon() {
  try {
    // Fetching first 20 Pokemons
    const url = "https://pokeapi.co/api/v2/pokemon/";
    const data = await fetch(url);
    const result = await data.json();
    const pokemonNames = result.results.map((s) => s.name);
    const pokemonsUrl = result.results.map((s) => s.url);
    
    //Fetching next 20 Pokemons
    const url2 = result.next;                                
    const data2 = await fetch(url2) 
    const result2 = await data2.json();                           
    const pokemonNames2 = result2.results.map((s) => s.name); 
    const pokemonsUrl2 = result.results.map((s) => s.url);
        
    //Fetching next 20 Pokemons
    const url3 = result2.next;                              
    const data3 = await fetch(url3)                           
    result3 = await data3.json();           
    const pokemonNames3 = result2.results.map((s) => s.name);
    const pokemonsUrl3 = result.results.map((s) => s.url);
                           
    const pokemonNamesAll = pokemonNames.concat(pokemonNames2).concat(pokemonNames3); //Storing all pokemons into single variable
    const pokemonsUrlAll = pokemonsUrl.concat(pokemonsUrl2).concat(pokemonsUrl3); //Storing all pokemon's url into single variable
    

    let pokemonAbilities = [];  //initialising empty array to append values from async function
    let pokemonMoves = [];      //initialising empty array to append values from async function
    let pokemonWeight = [];     //initialising empty array to append values from async function


    for(id in pokemonsUrlAll) {
        pokemonDetails(pokemonsUrlAll[id], id);
    }

    //using setTimeout for returning elements from async function to the root function
    setTimeout(() => {
            
        //pagination
        const page = document.querySelector(".pagination");
        const noOfPages = Math.ceil(pokemonNamesAll.length/6);

        for(let i=1; i<=noOfPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            page.appendChild(btn);
            btn.onclick = () => {
                const pagePokemonsName = pokemonNamesAll.slice((i-1)*6, i*6);
                const pagePokemonsAbilities = pokemonAbilities.slice((i-1)*6, i*6);
                const pagePokemonsMoves = pokemonMoves.slice((i-1)*6, i*6);
                const pagePokemonsWeight = pokemonWeight.slice((i-1)*6, i*6); 
                console.log("clicked =>", i)
                document.querySelector(".pokemon-list").innerHTML = "";
                for(id in pagePokemonsWeight) {
                    createPokemon(pagePokemonsName[id], pagePokemonsAbilities[id], pagePokemonsMoves[id], pagePokemonsWeight[id], (i*6)+id);
                }
            }
        }

        //First six default elements on page
            const firstSixPokemon = pokemonNamesAll.slice(0, 6)
            const firstSixPokemonsAbilities = pokemonAbilities.slice(0, 6)
            const firstSixPokemonsMoves = pokemonMoves.slice(0, 6)
            const firstSixPokemonsWeight = pokemonWeight.slice(0, 6)
            for(let id in firstSixPokemon)
            {
                createPokemon(firstSixPokemon[id], firstSixPokemonsAbilities[id], firstSixPokemonsMoves[id], firstSixPokemonsWeight[id], id);
            }

    }, 0.7*1000)

    //Getting details of pokemons
    async function pokemonDetails(url, id) {
        try{
            const data = await fetch(url);
            const result = await data.json();
        
            abilities = result.abilities.map(s => s.ability.name);
            moves = result.moves.map((s) => s.move.name).splice(0, 5);
            weight = result.weight;
            
            pokemonAbilities.push(abilities);
            pokemonMoves.push(moves);
            pokemonWeight.push(weight);
        }
        catch(err) {
                console.log(err);
            }
        }
    } 
    
    catch (err) {
        console.log(err);
    }
}

getPokemon();



