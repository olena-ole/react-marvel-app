import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {

    state = {
        characters: [],
        isLoading: true,
        error: false,
        newItemsLoading: false,
        offset: 210,
        charsEnded: false
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.onRequest()
    }

    onRequest = (offset) => {
        this.onCharsLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharsLoading = () => {
        this.setState({
            newItemsLoading: true
        })
    }

    onCharsLoaded = (newCharacters) => {
        const ended = newCharacters.length < 9;
        this.setState(({characters, offset}) => ({
            characters: [...characters, ...newCharacters], 
            isLoading: false,
            newItemsLoading: false,
            offset: offset + 9,
            charsEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            isLoading: false,
            error: true
        })
    }

    renderItems = (arr) => {
        const characterElements = arr.map(char => {
            let imgStyle = {'objectFit' : 'cover'};
            if (char.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }

            let active = false;

            return (
                <li className={`char__item ${active ? 'char__item_selected' : ''}`} 
                    key={char.id}
                    onClick={() => this.props.onCharSelected(char.id)}>
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

    render() {
        const { characters, isLoading, error, newItemsLoading, offset, charsEnded } = this.state;
        const items = this.renderItems(characters);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = isLoading ? <Spinner /> : null;
        const content = !(isLoading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    disabled={newItemsLoading}
                    onClick={() => this.onRequest(offset)}
                    style={{'display': charsEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;