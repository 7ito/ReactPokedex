import React from 'react'

const PokemonThumbnail = ({id, name, types, image, openModal}) => {

    const style = `thumb-container ${types[0].type.name}`
    return (
        <div className={style}>
            <div className="number">
                <small>#0{id}</small>
            </div>
            <img src={image} alt={name} onClick={() => openModal(id)} />
            <div className="detail-wrapper">
                <h3>{name}</h3>
                <small>Type: {types[0].type.name}{types[1] && ", " + types[1].type.name}</small>
            </div>
        </div>
    )
}

export default PokemonThumbnail 