import React, {useEffect, useState} from 'react';
import './App.scss';
import {ImagesDownload} from "~/utils/ImagesDownload";
import {LabelsUpload} from "~/utils/LabelsUpload";
import {LabelName} from "~/store/labels/types";
import {useDispatch} from "react-redux";
import {updateLabelNames} from "~/store/labels/actionCreators";
import {createTheme, ThemeProvider} from "@mui/material";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AnnotationView from "~/views/AnnotationView/AnnotationView";
import VisionView from "~/views/VisionView/VisionView";

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


export const App: React.FC = () => {

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<AnnotationView/>}/>
                    <Route path="/vision" element={<VisionView/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
};



