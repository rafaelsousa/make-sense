import {PhotoProvider, PhotoView} from "react-photo-view";
import {Button, LinearProgress, Stack} from "@mui/material";
import React, {Fragment, useEffect} from "react";
import {StyledBox} from "~/views/VisionView/StyledBox";
import {io} from "socket.io-client";

interface ImagePreviewProps {
    selectedRun: string
}

const ImagePreviewComponent: React.FC<ImagePreviewProps> = ({selectedRun}) => {

    const [imagesList, setImagesList] = React.useState([])
    const [progress, setProgress] = React.useState(0);
    const [currentImage, setCurrentImage] = React.useState(0);
    const [totalImages, setTotalImages] = React.useState(0);

    useEffect(() => {

        const socket = io('ws://localhost:5000/prediction')

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on('disconnect', () => {
            console.log('disconnected')
        })

        socket.on('predicting', (data) => {
            setCurrentImage(data.currentImage)
            setTotalImages(data.totalImages)
            setProgress(data.percentage)
            updateImagesList()
        })
        return () => {
            socket.disconnect()
        }
    })

    const updateImagesList = () => {
        fetch(`http://localhost:5000/vision/prediction/${selectedRun}`).then((response) => {
            response.json().then((data) => {
                setImagesList(data.images)
            })
        })
    }

    useEffect(() => updateImagesList(), [])
    const startPrediction = () => {
        fetch(`http://localhost:5000/prediction/${selectedRun}`).then((response) => {
            console.log('prediction started')
        })
    };

    return <PhotoProvider>
        <StyledBox>
            <Button sx={{width: "150px"}} onClick={startPrediction}>Predict</Button>
            <Stack sx={{
                width: "100%",
                color: "grey.500",
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'column',
            }}>
                <LinearProgress variant="determinate" value={progress} color={"secondary"}/>
            </Stack>
            {currentImage} of {totalImages} images completed
        </StyledBox>
        <PhotoProvider>
            <StyledBox style={{height: '100%'}}>
                {imagesList.map((item, index) => (
                    <Fragment key={index}>
                        <PhotoView key={index} src={`http://localhost:5000/image/${item}`} width={100} height={100}>
                            <img src={`http://localhost:5000/image/${item}`} loading="lazy" width={100} height={100}/>
                        </PhotoView>
                    </Fragment>
                ))}
            </StyledBox>
        </PhotoProvider>
    </PhotoProvider>;
}

export default ImagePreviewComponent;