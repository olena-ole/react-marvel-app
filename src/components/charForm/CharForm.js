import './charFrom.scss';

const CharFrom = () => {
    return (
        <div className="char__search">
            <p className="char__search-name">Or find a character by name:</p>
            <form className="char__form">
                <input type="text" name="name" placeholder="Enter name" className="char__form-item" />
                <button className="button button__main">
                    <div className="inner">Find</div>
                </button>
            </form>
        </div>
    )
}

export default CharFrom;