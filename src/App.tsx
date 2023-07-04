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
import {updateLabelNames} from "~/store/labels/actionCreators";
import {ContextType} from "~/data/enums/ContextType";
import TrainingView from "~/views/TrainingView/TrainingView";
import {Alert, Box, createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#5893df',
        },
        secondary: {
            main: '#2ec5d3',
        },
        background: {
            default: '#192231',
            paper: '#24344d',
        },
    },
})

enum ServerStatus {
    LOADING,
    ONLINE,
    OFFLINE,
}


export const App: React.FC = () => {
    const [projectLoaded, setProjectLoaded] = useState(false)
    const dispatch = useDispatch()
    const currentContext = useSelector((state: any) => state.general.activeContext)

    // Server Status Check
    const [serverStatus, setServerStatus] = useState(ServerStatus.LOADING);

    useEffect(() => {
        fetch('http://localhost:5000/health')
            .then(response => {
                setServerStatus(ServerStatus.ONLINE)
            })
            .catch(error => {
                setServerStatus(ServerStatus.OFFLINE);
            });
    }, []);


    useEffect(() => {
        if (serverStatus == ServerStatus.ONLINE) {
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
        }
    }, [serverStatus])
    return (
        <>
            {serverStatus == ServerStatus.ONLINE && projectLoaded &&
                <ThemeProvider theme={theme}>
                    <div className={classNames('App', {'AI': false})} draggable={false}>
                        {currentContext == ContextType.EDITOR && <EditorView/>}
                        {currentContext == ContextType.TRAINING && <TrainingView/>}
                        <PopupView/>
                        <NotificationsView/>
                    </div>
                </ThemeProvider>}

            {serverStatus == ServerStatus.OFFLINE &&
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh'
                    }}
                >
                    <Alert severity="error">
                        Server is not responding. Please refresh the page or try again later.
                    </Alert>
                </Box>

            }
        </>
    )
};



