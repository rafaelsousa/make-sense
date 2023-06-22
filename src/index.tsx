import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import configureStore from './configureStore';
import {Provider} from 'react-redux';
import {AppInitializer} from './logic/initializer/AppInitializer';
import EditorView from "~/views/EditorView/EditorView";

export const store = configureStore();
AppInitializer.inti();

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            {/*<App isObjectDetectorLoaded={false} isPoseDetectionLoaded={false} />*/}
            <EditorView />
        </Provider>
    </React.StrictMode>
);

