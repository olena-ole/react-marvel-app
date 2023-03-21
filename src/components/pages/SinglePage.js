import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({Component, dataType}) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const {loading, error, getComics, getCharacter, clearError} = useMarvelService();
    
    useEffect(() => {
        updateData();
        // eslint-disable-next-line
    }, [id]);


    const onDataLoaded = (newData) => {
        setData(newData);
    }

    const updateData = () => {
        clearError();
        
        if (dataType === 'character') {
            getCharacter(id)
                .then(onDataLoaded);
        } else if ((dataType === 'comics')) {
            getComics(id)
                .then(onDataLoaded);
        }    
    }

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error || !data) ? <Component data={data} /> : null;

    return (
        <>
            <AppBanner />
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

// const View = ({comics}) => {
//     const {title, description, pageCount, thumbnail, price, language} = comics;
//     return (
//         <div className="single-comic">
//             <img src={thumbnail} alt={title} className="single-comic__img"/>
//             <div className="single-comic__info">
//                 <h2 className="single-comic__name">{title}</h2>
//                 <p className="single-comic__descr">{description}</p>
//                 <p className="single-comic__descr">{pageCount}</p>
//                 <p className="single-comic__descr">Language: {language}</p>
//                 <div className="single-comic__price">{price}</div>
//             </div>
//             <Link to="/comics" className="single-comic__back">Back to all</Link>
//         </div>
//     )
// }

export default SinglePage;