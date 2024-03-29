import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import { uid } from 'uid';

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
        // eslint-disable-next-line
    }, [props.charId]);


    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        const { charId } = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
}

const View = ({data}) => {
    const { name, description, thumbnail, homepage, wiki, comics } = data;

    const imgStyle = thumbnail.includes('image_not_available') ? 
                                        {objectFit: 'contain'} : 
                                        {objectFit: 'cover'};

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                    {comics.length ? null : 'There are no comics with this character'}
                    {
                        comics.map(item => {
                            return (
                                <li className="char__comics-item" key={uid()}>
                                    {item.name}
                                </li>
                            )
                        })
                    }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;