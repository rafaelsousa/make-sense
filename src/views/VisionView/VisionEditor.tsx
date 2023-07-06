import React, {useEffect} from 'react';
import {Button, InputLabel, LinearProgress, MenuItem, Select, Stack} from "@mui/material";
import {io} from "socket.io-client";
import styles from './Vision.module.css'
import 'react-photo-view/dist/react-photo-view.css';
import ImagePreviewComponent from "~/views/VisionView/ImagePreviewComponent";
import {StyledBox} from "~/views/VisionView/StyledBox";


const VisionEditor: React.FC = () => {

    const [progress, setProgress] = React.useState(0);
    const [currentEpoch, setCurrentEpoch] = React.useState(0);
    const [totalEpochs, setTotalEpochs] = React.useState(0);
    const [runs, setRuns] = React.useState([]);
    const [selectedRun, setSelectedRun] = React.useState('')


    const startTraining = () => {
        fetch('http://localhost:5000/train').then((response) => {
            console.log('training started')
        })
    }

    useEffect(() => {

        const socket = io('ws://localhost:5000/training')

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('disconnect', () => {
            console.log('disconnected')
        })

        socket.on('endepoch', (data) => {
            setCurrentEpoch(data.currentEpoch)
            setTotalEpochs(data.totalEpochs)
            setProgress(data.percentage)
        })
        socket.on('endtraining', updateRuns)
        return () => {
            socket.disconnect()
        }
    })

    const updateRuns = () => {
        fetch('http://localhost:5000/vision/runs').then((response) => {
            response.json().then((data) => {
                setSelectedRun(data.runs[0])
                setRuns(data.runs)
            })
        })
    }

    useEffect(() => updateRuns(), [])


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
        <ImagePreviewComponent selectedRun={selectedRun}/>
    </>
}

export default VisionEditor;