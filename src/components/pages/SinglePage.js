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

export default SinglePage;