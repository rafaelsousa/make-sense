import {ImageData, LabelName} from '~/store/labels/types';
import {updateActiveLabelType, updateImageData, updateLabelNames} from '~/store/labels/actionCreators';
import axios from "axios";
import {ImporterSpecData} from "~/data/ImporterSpecData";
import {LabelType} from "~/data/enums/LabelType";
import {AnnotationFormatType} from "~/data/enums/AnnotationFormatType";
import {store} from "~/index";


const onAnnotationLoadSuccess = (imagesData: ImageData[], labelNames: LabelName[]) => {
    store.dispatch(updateImageData(imagesData));
    store.dispatch(updateLabelNames(labelNames));
    store.dispatch(updateActiveLabelType(LabelType.RECT));
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

export const LabelsUpload = async () => {
    try {
        // Get the labels.txt file
        const labelsResponse = await axios.get(`http://localhost:5000/labels`, {responseType: 'text'});
        const labelsFile =  new File([labelsResponse.data], 'labels.txt', {type: 'application/txt'});

        const response = await axios.get('http://localhost:5000/annotations');
        const fileData = response.data;
        const fileList: string[] = fileData.annotations;
        const acceptedFiles = await Promise.all(fileList.map((fileUrl: string) => downloadFile(fileUrl)));
        acceptedFiles.push(labelsFile);

        const importer = new (ImporterSpecData[AnnotationFormatType.YOLO])([LabelType.RECT]);
        importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
    } catch (error) {
        console.error("Error fetching files:", error);
    }
};




