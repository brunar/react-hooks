import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

ReactDOM.render(
    <AuthContextProvider>
        <BrowserRouter basename="/view/react-hooks">
            <App />
        </BrowserRouter>
    </AuthContextProvider>,
    document.getElementById('root')
);
