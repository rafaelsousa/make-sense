import React, {useEffect} from 'react';
import {Box, Button, InputLabel, LinearProgress, MenuItem, Select, Stack, styled} from "@mui/material";
import {io} from "socket.io-client";
import styles from './Vision.module.css'
import 'react-photo-view/dist/react-photo-view.css';
import {PhotoProvider, PhotoView} from "react-photo-view";
import {height} from "@mui/system";

interface TrainingData {
    currentEpoch: number;
    totalEpochs: number;
}

const StyledBox = styled(Box)(({theme}) => ({
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.common.white,
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    padding: '10px',
    gap: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
}));


const VisionEditor: React.FC = () => {

    const [progress, setProgress] = React.useState(0);
    const [currentEpoch, setCurrentEpoch] = React.useState(0);
    const [totalEpochs, setTotalEpochs] = React.useState(0);
    const [runs, setRuns] = React.useState([]);
    const [selectedRun, setSelectedRun] = React.useState('')
    const [imagesList, setImagesList] = React.useState([])

    const startTraining = () => {
        fetch('http://localhost:5000/train').then((response) => {
            console.log('training started')
        })
    }

    useEffect(() => {

        const socket = io('ws://localhost:5000/detection')

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('disconnect', () => {
            console.log('disconnected')
        })

        socket.on('training', (data) => {
            setCurrentEpoch(data.currentEpoch)
            setTotalEpochs(data.totalEpochs)
            setProgress(data.percentage)
        })
        return () => {
            socket.disconnect()
        }
    })

    useEffect(() => {
        fetch('http://localhost:5000/vision/runs').then((response) => {
            response.json().then((data) => {
                setSelectedRun(data.runs[0])
                setRuns(data.runs)
            })
        })
        fetch('http://localhost:5000/images').then((response) => {
            response.json().then((data) => {
                setImagesList(data.images)
            })
        })
    }, [])


    const handleRunSelection = (event) => {
        setSelectedRun(event.target.value)
    };
    return <>
        <StyledBox>
            <Button sx={{width: '150px'}} onClick={startTraining}>Train</Button>
            <Stack sx={{
                width: "100%",
                color: "grey.500",
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
            }}>
                <LinearProgress variant="determinate" value={progress} color={"secondary"}/>
            </Stack>
            {currentEpoch} of {totalEpochs} epochs completed
        </StyledBox>
        <StyledBox style={{justifyContent: 'flex-start'}}>
            <InputLabel id="runsLabel" className={styles.StyledBoxContent}>Runs</InputLabel>
            <Select variant='outlined' className={styles.StyledBoxContent} color='secondary' label={"Runs"}
                    labelId={"runsLabel"} value={selectedRun} onChange={handleRunSelection}>
                {runs.map((run) => {
                    return <MenuItem value={run}>
                        {run}
                    </MenuItem>
                })}
            </Select>
        </StyledBox>
        <PhotoProvider>
            <StyledBox style={{height: '100%'}}>
                {imagesList.map((item, index) => (
                    <PhotoView key={index} src={`http://localhost:5000/image/${item}`} width={100} height={100}>
                        <img src={`http://localhost:5000/image/${item}`} loading="lazy" width={100} height={100}/>
                    </PhotoView>
                ))}
            </StyledBox>
        </PhotoProvider>
    </>
}

export default VisionEditor;