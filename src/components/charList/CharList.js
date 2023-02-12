import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {

    state = {
        characters: [],
        isLoading: true,
        error: false
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded)
            .catch(this.onError)
    }

    onCharsLoaded = (characters) => {
        this.setState({
            characters, 
            isLoading: false,
        })
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
        const { characters, isLoading, error } = this.state;
        const items = this.renderItems(characters);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = isLoading ? <Spinner /> : null;
        const content = !(isLoading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

export default CharList;