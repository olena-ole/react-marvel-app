import { useState } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charFrom.scss';

function setContent(process, data) {
    switch(process) {
        case 'waiting':
        case 'loading':
            return null;
        case 'confirmed':
            return data.name ?
                <div className="char__form">
                    <div className="char__search-success">There is! Visit {data.name} page?</div>
                    <Link to={`/characters/${data.id}`} className="button button__secondary">
                        <div className="inner">To page</div>
                    </Link>
                </div> :
                <div className="char__search-error">{data}</div>;
        case 'error':
            return <div className="char__search-critical-error"><ErrorMessage /></div>;
        default:
            return null;
    }

}

const CharFrom = () => {
    const [char, setChar] = useState(null);
    const { clearError, getCharacterByName, process, setProcess } = useMarvelService();

    function updateChar(name) {
        clearError();

        getCharacterByName(name)
            .then(res => setChar(res))
            .then(() => setProcess('confirmed'));
    }
    
    return (
        <Formik
            initialValues={{ name: '' }}
            validationSchema={Yup.object({
                name: Yup.string()
                        .min(2, 'The name is too short')
                        .required('The field is required')
            })}
            onSubmit={(values, actions) => {
                updateChar(values.name);
                actions.setSubmitting(false);
                actions.resetForm();
            }}
            >
            {({ isSubmitting }) => (
                <div className="char__search">
                    <p className="char__search-name">Or find a character by name:</p>
                    <Form className="char__form">
                        <Field 
                            type="text" 
                            name="name" 
                            placeholder="Enter name" 
                            className="char__form-item"/>
                        <button type="submit" disabled={isSubmitting} className="button button__main">
                            <div className="inner">Find</div>
                        </button>
                    </Form>
                    <FormikErrorMessage name="name" component="div" className="char__search-error" />
                    {setContent(process, char)}
                </div>
            )}
        </Formik>
    )
}

export default CharFrom;