import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';
import AppBanner from '../appBanner/AppBanner';

const SinglePage = ({Component, dataType}) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const {getComics, getCharacter, clearError, process, setProcess} = useMarvelService();
    
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
                .then(onDataLoaded)
                .then(() => setProcess('confirmed'));
        } else if ((dataType === 'comics')) {
            getComics(id)
                .then(onDataLoaded)
                .then(() => setProcess('confirmed'));
        }    
    }

    return (
        <>
            <AppBanner />
            {setContent(process, Component, data)}
        </>
    )
}

export default SinglePage;