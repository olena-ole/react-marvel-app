import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [characters, setCharacters] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charsEnded, setCharsEnded] = useState(false);

    const {loading, error, getAllCharacters} = useMarvelService();
    
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded);
    }

    const onCharsLoaded = (newCharacters) => {
        const ended = newCharacters.length < 9;
        setCharacters(characters => [...characters, ...newCharacters]); 
        setNewItemsLoading(false);
        setOffset(offset => offset + 9);
        setCharsEnded(ended);
    }

    const itemRefs = useRef([]);

    const setActiveChar = (i) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'))
        itemRefs.current[i].classList.add('char__item_selected')
        itemRefs.current[i].focus()
    }

    const handleCharacterClick = (i, id) => {
        setActiveChar(i);
        props.onCharSelected(id)
    }

    function renderItems(arr) {
        const characterElements = arr.map((char, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (char.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li className="char__item" 
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => handleCharacterClick(i, char.id)}
                    key={char.id}>
                    <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {characterElements}
            </ul>
        );
    }

    // const { characters, loading, error, newItemsLoading, offset, charsEnded } = this.state;
    const items = renderItems(characters);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemsLoading ? <Spinner /> : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemsLoading}
                onClick={() => onRequest(offset)}
                style={{'display': charsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )  
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;