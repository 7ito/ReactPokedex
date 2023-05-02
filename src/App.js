import React, { useEffect, useState } from "react";
import PokemonThumbnail from "./components/PokemonThumbnail";
import Pagination from "./components/Pagination";
import DexEntryModal from "./components/DexEntryModal";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'
import RandomPokemon from "./components/RandomPokemon";

const queryClient = new QueryClient();

function App() {
  const [allPokemon, setAllPokemon] = useState([])
  const [currentPageUrl, setCurrentPageUrl] = useState('https://pokeapi.co/api/v2/pokemon?limit=20')
  const [nextPageUrl, setNextPageUrl] = useState()
  const [prevPageUrl, setPrevPageUrl] = useState()
  const [modalState, setModalState] = useState(false)
  const [modalID, setModalID] = useState(1)

  const getAllPokemon = async () => {
    const response = await fetch(currentPageUrl)
    const data = await response.json()
    
    setNextPageUrl(data.next)
    setPrevPageUrl(data.previous)

    async function createPokemonObject(results) {
      for (const pokemon of results) {
        const res = await fetch(pokemon.url)
        const data = await res.json()
        setAllPokemon(currentList => [...currentList, data])
      }
    } 

    setAllPokemon([])
    createPokemonObject(data.results)
  }

  useEffect(() => {
    getAllPokemon()
  }, [currentPageUrl])

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl)
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl)
  }
  
  function openModal(id) {
    setModalID(id)
    setModalState(true)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <RandomPokemon openModal={openModal}/>
        <h1>Pokemon</h1>
        <div className="pokemon-container">
          <div className="all-container">
            { allPokemon.map( (pokemon) => 
              <PokemonThumbnail 
                id={pokemon.id}
                name={pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                types={pokemon.types}
                image={pokemon.sprites.other.dream_world.front_default}
                key={pokemon.id}
                openModal={openModal}
              />  
            )}
          </div>
            <Pagination
              gotoNextPage={nextPageUrl ? gotoNextPage : null}
              gotoPrevPage={prevPageUrl ? gotoPrevPage : null }
            />
            <DexEntryModal open={modalState} id={modalID} onClose={() => setModalState(false)}/>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}


export default App;