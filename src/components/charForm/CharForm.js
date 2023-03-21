import { useState } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/MarvelService';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charFrom.scss';

const CharFrom = () => {
    const [char, setChar] = useState(null);
    const { error, clearError, getCharacterByName } = useMarvelService();

    function updateChar(name) {
        clearError();

        getCharacterByName(name).then(res => setChar(res));
    }
    
    const result = char && char.name && (
        <div className="char__form">
            <div className="char__search-success">There is! Visit {char.name} page?</div>
            <Link to={`/characters/${char.id}`} className="button button__secondary">
                <div className="inner">To page</div>
            </Link>
        </div>
    )

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
                    {char && char.length && !error ? <div className="char__search-error">{char}</div> : null}
                    {error ? <div className="char__search-critical-error"><ErrorMessage /></div> : null}
                    {result}
                </div>
            )}
        </Formik>
    )
}

export default CharFrom;