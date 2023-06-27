import React, {useEffect} from 'react';
import './EditorView.scss';
import EditorContainer from './EditorContainer/EditorContainer';
import {PopupWindowType} from '../../data/enums/PopupWindowType';
import {AppState} from '../../store';
import {connect, useDispatch, useSelector} from 'react-redux';
import TopNavigationBar from './TopNavigationBar/TopNavigationBar';
import ImagesUpload from "../MainView/ImageUpload/ImagesUpload";
import {updateLabelNames} from "~/store/labels/actionCreators";
import {LabelName} from "~/store/labels/types";
import LabelsUpload from "~/views/MainView/AnnotationsUpload/LabelsUpload";

interface IProps {
    activePopupType: PopupWindowType;
    updateLabelNamesAction: (labels: LabelName[]) => any;
}

const EditorView: React.FC<IProps> = ({activePopupType, updateLabelNamesAction}) => {

    const imagesData = useSelector((state: AppState) => state.labels.imagesData);

    const labels = useSelector((state: AppState) => state.labels.labels);

    const labelsDispatchAction = useDispatch();

    useEffect(() => {
        const l : LabelName[] = [{
            id: '0',
            name: 'peeble',
            color: '#ff0000',
        }]
        updateLabelNamesAction(l)
    },[])

    const isImagesDataEmpty = imagesData.length === 0;
    const isLabelsDataEmpty = labels.length === 0;

    return (
        <div className={'EditorView'} draggable={false}>
            {isImagesDataEmpty && <ImagesUpload/>}
            {isLabelsDataEmpty && <LabelsUpload/>}
            {!isImagesDataEmpty &&
                <>
                    <TopNavigationBar/>
                    <EditorContainer/>
                </>
            }
        </div>
    );
};

const mapStateToProps = (state: AppState) => ({
    activePopupType: state.general.activePopupType
});

const mapDispatchToProps = {
    updateLabelNamesAction: updateLabelNames,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditorView);
