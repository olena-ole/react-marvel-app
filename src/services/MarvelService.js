import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError, process, setProcess} = useHttp();

    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=4e0edc4fc27a42ebaad59a765f3d4b06';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(item => _transformCharacter(item));
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(item => _transformComics(item));
    }

    const getComics = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?&${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getCharacterByName = async (name) => {
        const res = await request(`${_apiBase}characters?name=${name}&${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    function _transformCharacter(char) {
        if (!char) return 'The character was not found. Check the name and try again!';
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.length > 10 ? char.comics.items.slice(0, 10) : char.comics.items
        }
    }

    function _transformComics(comics) {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description for this character',
            pageCount: comics.pageCount ? `${comics.pageCount} pages` : "No information about the number of pages",
            thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
            price: comics.prices[0].price  || 'Not available',
            language: (comics.textObjects[0] && comics.textObjects[0].language) || 'en-us'
        }
    }

    return {
        loading, 
        error, 
        process,
        setProcess,
        getAllCharacters, 
        getCharacter, 
        getCharacterByName,
        getAllComics,
        getComics,
        clearError
    }
}

export default useMarvelService;