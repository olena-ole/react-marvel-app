import { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './charList.scss';

const setContent = (process, Component, newItemsLoading) => {
    switch(process) {
        case 'waiting':
            return <Spinner />;
        case 'error':
            return <ErrorMessage />;
        case 'loading': 
            return newItemsLoading ? <Component /> : <Spinner />;
        case 'confirmed':
            return <Component />;
        default:
            throw new Error('Enexpected process state');
    }
}

const CharList = (props) => {

    const [characters, setCharacters] = useState([]);
    const [newItemsLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charsEnded, setCharsEnded] = useState(false);

    const {getAllCharacters, process, setProcess} = useMarvelService();
    
    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, []);

    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllCharacters(offset)
            .then(onCharsLoaded)
            .then(() => setProcess('confirmed'))
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
                <CSSTransition
                    key={char.id}
                    timeout={500}
                    classNames="char__item">
                    <li className="char__item" 
                        ref={el => itemRefs.current[i] = el}
                        onClick={() => handleCharacterClick(i, char.id)}>
                        <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                        <div className="char__name">{char.name}</div>
                    </li>
                </CSSTransition>
            )
        });

        return (
                <TransitionGroup component={'ul'} className="char__grid">
                    {characterElements}
                </TransitionGroup>  
        );
    }

    const elements = useMemo(() => {
        return setContent(process, () => renderItems(characters), newItemsLoading);
        // eslint-disable-next-line
    }, [process]);

    return (
        <div className="char__list">
            {elements}
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