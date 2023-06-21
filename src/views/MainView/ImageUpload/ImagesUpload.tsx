import React, {PropsWithChildren, useEffect, useState} from 'react';
import {ImageData} from '../../../store/labels/types';
import {connect} from 'react-redux';
import {addImageData, updateActiveImageIndex} from '../../../store/labels/actionCreators';
import {AppState} from '../../../store';
import {ProjectType} from '../../../data/enums/ProjectType';
import {PopupWindowType} from '../../../data/enums/PopupWindowType';
import {updateActivePopupType, updateProjectData} from '../../../store/general/actionCreators';
import {ProjectData} from '../../../store/general/types';
import {ImageDataUtil} from '../../../utils/ImageDataUtil';
import {sortBy} from 'lodash';
import axios from "axios";

interface IProps {
    updateActiveImageIndexAction: (activeImageIndex: number) => any;
    addImageDataAction: (imageData: ImageData[]) => any;
    updateProjectDataAction: (projectData: ProjectData) => any;
    updateActivePopupTypeAction: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}

const ImagesUpload: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {


    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const response = await axios.get('http://localhost:5000/images');
            const fileData = response.data;
            const imageList: string[] = fileData.images;
            const acceptedFiles = await Promise.all(imageList.map((fileUrl: string) => downloadFile(fileUrl)));
            startEditor(ProjectType.OBJECT_DETECTION, acceptedFiles)
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };


    const downloadFile = async (fileUrl): Promise<File> => {
        try {
            const response = await axios.get(`http://localhost:5000/image/${fileUrl}`, {responseType: 'blob'});
            return new File([response.data], fileUrl.split('/').pop(), {type: 'application/octet-stream'});
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        return null;
    };


    const startEditor = (projectType: ProjectType, acceptedFiles: File[]) => {
        console.log(acceptedFiles)
        if (acceptedFiles.length > 0) {
            const files = sortBy(acceptedFiles, (item: File) => item.name)
            props.updateProjectDataAction({
                ...props.projectData,
                type: projectType
            });
            props.updateActiveImageIndexAction(0);
            props.addImageDataAction(files.map((file: File) => ImageDataUtil
                .createImageDataFromFileData(file)));
            props.updateActivePopupTypeAction(PopupWindowType.INSERT_LABEL_NAMES);
        }
    };

    return (
        <></>
    )
};

const mapDispatchToProps = {
    updateActiveImageIndexAction: updateActiveImageIndex,
    addImageDataAction: addImageData,
    updateProjectDataAction: updateProjectData,
    updateActivePopupTypeAction: updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesUpload);

