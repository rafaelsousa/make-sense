import React, {useEffect, useState} from 'react';
import './App.scss';
import EditorView from './views/EditorView/EditorView';
import PopupView from './views/PopupView/PopupView';
import classNames from 'classnames';
import NotificationsView from './views/NotificationsView/NotificationsView';
import {ImagesDownload} from "~/utils/ImagesDownload";
import {LabelsUpload} from "~/utils/LabelsUpload";
import {LabelName} from "~/store/labels/types";
import {useDispatch, useSelector} from "react-redux";
import {store} from "~/index";
import {updateLabelNames} from "~/store/labels/actionCreators";
import {ContextType} from "~/data/enums/ContextType";


export const App: React.FC = (

) => {
    const [projectLoaded, setProjectLoaded] = useState(false)
    const dispatch = useDispatch()
    const currentContext = useSelector((state: any) => state.general.activeContext)
    console.log('currentContext', currentContext)
    useEffect(() => {
        (async () => {
            await ImagesDownload()
            await LabelsUpload()
            const l: LabelName[] = [{
                id: '0',
                name: 'peeble',
                color: '#ff0000',
            }]
            dispatch(updateLabelNames(l))
            setProjectLoaded(true)
        })()
    }, [])
    return (projectLoaded &&
        <div className={classNames('App', {'AI': false})} draggable={false}>
            {currentContext == ContextType.EDITOR && <EditorView />}
            <PopupView/>
            <NotificationsView/>
        </div>
    );
};



