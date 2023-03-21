import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import AppHeader from '../appHeader/AppHeader';
import Spinner from '../spinner/Spinner';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const SingleComicsPage = lazy(() => import('../pages/singleComicsPage/SingleComicsPage'));
const SingleCharacterPage = lazy(() => import('../pages/singleCharacterPage/SingleCharacterPage'));

const App = () => {
    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner />}>
                        <Routes>
                            <Route path="/">
                                <Route index element={<MainPage />} />  
                                <Route path="characters/:id" element={<SingleCharacterPage />} />
                                <Route path="comics">
                                    <Route index element={<ComicsPage />} />
                                    <Route path=":id" element={<SingleComicsPage />}/>
                                </Route>
                            </Route> 
                            <Route path="*" element={<Page404 />} />
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
}

export default App;