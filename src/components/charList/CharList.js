import { Component } from 'react';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {

    state = {
        characters: []
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(res => this.setState({characters: res}))
    }

    render() {
        const { characters } = this.state;
        const characterElements = characters.map(char => {
            let imgStyle = {'objectFit' : 'cover'};
            if (char.thumbnail.includes('image_not_available')) {
                imgStyle = {'objectFit' : 'unset'};
            }

            let active = false;

            return (
                <li className={`char__item ${active ? 'char__item_selected' : ''}`} key={char.name}>
                    <img src={char.thumbnail} alt={char.name} style={imgStyle}/>
                    <div className="char__name">{char.name}</div>
                </li>
            )
        });

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {characterElements}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}

export default CharList;