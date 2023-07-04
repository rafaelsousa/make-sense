import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import {AppInitializer} from './logic/initializer/AppInitializer';
import {App} from "~/App";
import ServerOfflineView from "~/views/ServerOfflineView/ServerOfflineView";

export const store = configureStore();
AppInitializer.inti();

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));
fetch('http://localhost:5000/health')
    .then(() => {
        root.render(
            <React.StrictMode>
                <Provider store={store}>
                    <App/>
                </Provider>
            </React.StrictMode>
        );
    })
    .catch(() => {
        root.render(
            <React.StrictMode>
                <ServerOfflineView />
            </React.StrictMode>
        );
    });




