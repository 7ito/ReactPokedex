import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query';

function DexEntryModal({ open, id, onClose }) {

  const pokemonUrl = 'https://pokeapi.co/api/v2/pokemon/'+id
  // const [pokemonDetails, setPokemonDetails] = useState(undefined)
  const speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species/'+id
  // const [speciesDetails, setSpeciesDetails] = useState(undefined)
  const [style, setStyle] = useState("portrait-frame")
  const [stats, setStats] = useState([])

  const { status: pokemonStatus, error: pokemonError, data: pokemonDetails } = useQuery(["getPokemonDetails", id], async () => {
    const response = await fetch(pokemonUrl)
    const data = await response.json()
    return data;
  }, {
    onSuccess: (data) => {
      setStyle(`portrait-frame ${data.types[0].type.name}-portrait`)
      getStats(data)
    }
  }
  )

  const { status: speciesStatus, error: speciesError, data: speciesDetails } = useQuery(['getPokemonSpecies', id], async () => {
    const response = await fetch(speciesUrl)
    const data = await response.json()
    return data;
  }
  );

  function getStats(data) {
    setStats([])
    for (let i = 0; i < 6; i++) {
      const stat = {
        name: data.stats[i].stat.name,
        baseValue: data.stats[i].base_stat
      }
      setStats(currentList => [...currentList, stat])
    }
  }

  // const getPokemonDetails = async () => {
  //   const response = await fetch(pokemonUrl)
  //   const data = await response.json()

  //   setPokemonDetails(data)
  //   setStyle(`portrait-frame ${data.types[0].type.name}-portrait`)
  // }

  // const getPokemonSpecies = async () => {
  //   const response = await fetch(speciesUrl)
  //   const data = await response.json()

  //   setSpeciesDetails(data)
  //   getStats()
  // }

  // useEffect(() => {
  //   if (open) {
  //     getPokemonDetails()
  //     getPokemonSpecies()
  //   }
  // })

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  function displayStat(stat) {
    let displayName = ""
    switch(stat.name) {
      case "hp":
        displayName = "HP"
        break;
      case "attack":
        displayName = "Atk"
        break;
      case "defense":
        displayName = "Def"
        break;
      case "special-attack":
        displayName = "Sp. Atk"
        break;
      case "special-defense":
        displayName = "Sp. Def"
        break;
      case "speed": 
        displayName = "Speed"
        break;
    }
    return (
      <tr>
        <th>{displayName}</th>
        <td>{stat.baseValue}</td>
      </tr>
    )
  }

  if(!open) return null
  if (pokemonDetails == undefined) return null
  if (speciesDetails == undefined) return null
  return (
    <div className='overlay'>
        <div className='modal'>
            <div className='modal-left'>
              <div className={style}>
                <div className='pokemon-number'>#{pokemonDetails.id}</div>
                <img src={pokemonDetails.sprites.other["official-artwork"].front_default} alt={pokemonDetails.name} />
                <div className='pokemon-name'>{capitalize(pokemonDetails.name)}</div>
              </div>
            </div>
            <div className='modal-center'>
              <div className='bio-container'>
                <h3>Bio</h3>
                <p>{speciesDetails.flavor_text_entries[0].flavor_text}</p>
                <table>
                  <tbody>
                    <tr>
                      <th>Height:</th>
                      <td>{pokemonDetails.height/10}m</td>
                    </tr>
                    <tr>
                      <th>Weight:</th>
                      <td>{pokemonDetails.weight/10}kg</td>
                    </tr>
                    <tr>
                      <th>Abilities:</th>
                      <td>{capitalize(pokemonDetails.abilities[0].ability.name)}{pokemonDetails.abilities[1] && ", " + capitalize(pokemonDetails.abilities[1].ability.name)}{pokemonDetails.abilities[2] && ", " + capitalize(pokemonDetails.abilities[2].ability.name)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='training-container'>
                <h3>Training</h3>
                <table>
                  <tbody>
                    <tr>
                      <th>Base EXP:</th>
                      <td>{pokemonDetails.base_experience}</td>
                    </tr>
                    <tr>
                      <th>Base Happiness:</th>
                      <td>{speciesDetails.base_happiness}</td>
                    </tr>
                    <tr>
                      <th>Capture Rate:</th>
                      <td>{speciesDetails.capture_rate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='modal-right'>
              <button onClick={onClose} className='close-btn'>X</button>
              <div className='evolution-container'>

              </div>
              <div className='stats-container'>
                <h3>Stats</h3>
                <table>
                  <tbody>
                    {stats.map(displayStat)}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
    </div>
  )
}

export default DexEntryModal