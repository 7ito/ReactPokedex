import React, { useState } from 'react'
import { useQuery } from 'react-query';

function RandomPokemon({ openModal }) {

    const [style, setStyle] = useState("portrait-frame")
    const [shouldGenerate, setShouldGenerate] = useState(true)
    
    const { status: randomStatus, error: randomError, data: id } = useQuery('generateRandomNumber', () => {
        return Math.floor(Math.random()*100)
    }, {
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchInterval: 3000,
        enabled: shouldGenerate
    }
    )

    const { status, error, data } = useQuery(['pokemon', id], async () => {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + id)
        const data = await response.json()
        return data;
    }, {
        onSuccess: (data) => {
            setStyle(`portrait-frame ${data.types[0].type.name}`)
        }, 
        staleTime: 10000,
        cacheTime: 2000,
    }
    )

    if (status === "loading") {
        return <h1>Loading</h1>
    }
  return (
    <div>
        <div className={style}>
            <div className="number">
                <small>#0{data.id}</small>
            </div>
            <img src={data.sprites.other.dream_world.front_default} alt={data.name} onClick={() => openModal(data.id)} />
            <div className="detail-wrapper">
                <h3>{data.name}</h3>
                <small>Type: {data.types[0].type.name}{data.types[1] && ", " + data.types[1].type.name}</small>
            </div>
        </div>
        <button onClick={() => {setShouldGenerate(prev => !prev)}}>{shouldGenerate ? 'stop' : 'start'}</button>
    </div>
  )
}

export default RandomPokemon