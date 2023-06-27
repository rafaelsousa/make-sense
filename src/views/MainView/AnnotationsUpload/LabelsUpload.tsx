import React, {PropsWithChildren, useEffect} from 'react';
import {ImageData, LabelName} from '~/store/labels/types';
import {connect} from 'react-redux';
import {updateActiveLabelType, updateImageData, updateLabelNames} from '~/store/labels/actionCreators';
import {AppState} from '~/store';
import axios from "axios";
import {ImporterSpecData} from "~/data/ImporterSpecData";
import {LabelType} from "~/data/enums/LabelType";
import {AnnotationFormatType} from "~/data/enums/AnnotationFormatType";

interface IProps {
    activeLabelType: LabelType,
    updateImageDataAction: (imageData: ImageData[]) => any,
    updateLabelNamesAction: (labels: LabelName[]) => any,
    updateActiveLabelTypeAction: (activeLabelType: LabelType) => any;
}

const LabelsUpload: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {


    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {

            // Get the labels.txt file
            const response = await axios.get('http://localhost:5000/annotations');
            const fileData = response.data;
            const fileList: string[] = fileData.annotations;
            const acceptedFiles = await Promise.all(fileList.map((fileUrl: string) => downloadFile(fileUrl)));

            const importer = new (ImporterSpecData[AnnotationFormatType.YOLO])([LabelType.RECT]);
            importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const onAnnotationLoadSuccess = (imagesData: ImageData[], labelNames: LabelName[]) => {
        props.updateImageDataAction(imagesData);
        props.updateLabelNamesAction(labelNames);
        props.updateActiveLabelTypeAction(LabelType.RECT);
    };

    const onAnnotationsLoadFailure = (error?: Error) => {
        console.log(error);
    };


    const downloadFile = async (fileUrl): Promise<File> => {
        try {
            const response = await axios.get(`http://localhost:5000/annotation/${fileUrl}`, {responseType: 'blob'});
            return new File([response.data], fileUrl.split('/').pop(), {type: 'application/octet-stream'});
        } catch (error) {
            console.error("Error downloading file:", error);
        }
        return null;
    };

    return (
        <></>
    )
};

const mapDispatchToProps = {
    updateImageDataAction: updateImageData,
    updateLabelNamesAction: updateLabelNames,
    updateActiveLabelTypeAction: updateActiveLabelType
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LabelsUpload);

