import {addImageData, updateActiveImageIndex, updateImageData} from '~/store/labels/actionCreators';
import {ProjectType} from '~/data/enums/ProjectType';
import {updateProjectData} from '~/store/general/actionCreators';
import {ImageDataUtil} from '~/utils/ImageDataUtil';
import {ImageData} from '~/store/labels/types';
import {sortBy} from 'lodash';
import axios from "axios";
import {store} from "~/index";


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
    if (acceptedFiles.length > 0) {
        const files = sortBy(acceptedFiles, (item: File) => item.name)
        const projectData = store.getState().general.projectData;
        store.dispatch(updateProjectData({
            ...projectData,
            type: projectType
        }));
        store.dispatch(updateActiveImageIndex(0))
        let imagesData = store.getState().labels.imagesData;
        files.forEach((file: File) => {
            const existingImageData = imagesData.find(
                (i) => i.fileData.name === file.name
            );
            if (!existingImageData) {
                imagesData = [...imagesData, ImageDataUtil.createImageDataFromFileData(file)];
            }
        });
        store.dispatch(updateImageData(imagesData));
    }
};

export const ImagesDownload = async () => {
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


