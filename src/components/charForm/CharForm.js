import { useState } from 'react';
import useMarvelService from '../../services/MarvelService';

import './charFrom.scss';

const CharFrom = () => {
    const [name, setName] = useState('');
    const { loading, error, clearError, getCharacterByName } = useMarvelService();

    function handleChange(e) {
        e.preventDefault();
        getCharacterByName(name).then(res => console.log(res));
    }

    return (
        <div className="char__search">
            <p className="char__search-name">Or find a character by name:</p>
            <form className="char__form" onSubmit={handleChange}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Enter name" 
                    className="char__form-item" 
                    required
                    value={name}
                    onChange={e => setName(e.target.value)} />
                <button className="button button__main">
                    <div className="inner">Find</div>
                </button>
            </form>
        </div>
    )
}

export default CharFrom;