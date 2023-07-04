import React, {useEffect, useState} from 'react';
import {Box, Button, LinearProgress, Stack, styled} from "@mui/material";
import {io} from "socket.io-client";
import BBoxAnnotator from "react-bbox-annotator";
import {EntryType} from "react-bbox-annotator";

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
}));


const VisionEditor: React.FC = () => {

    const [progress, setProgress] = React.useState(0);

    const labels = ['peeble']

    const [entries, setEntries] = useState<EntryType[]>([]);

    const startTraining = () => {
        fetch('http://localhost:5000/train').then((response) => {
            console.log(response)
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
            console.log('from socket:', data.percentage)
            setProgress(data.percentage)
        })

        return () => {
            socket.disconnect()
        }
    })

    return <>
        <StyledBox>
            <Button sx={{width: '150px'}} onClick={startTraining}>Train</Button>
            <Button sx={{width: '150px'}}>Detect</Button>
            <Stack sx={{
                width: "100%",
                color: "grey.500",
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
            }}>
                <LinearProgress variant="determinate" value={progress} color={"secondary"}/>
            </Stack>
            % of epochs completed
        </StyledBox>
        <StyledBox>
            lalala
        </StyledBox>
    </>
}

export default VisionEditor;