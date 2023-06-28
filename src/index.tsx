import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import {AppInitializer} from './logic/initializer/AppInitializer';
import {App} from "~/App";

export const store = configureStore();
AppInitializer.inti();

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
);

