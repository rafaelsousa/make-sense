import React from 'react';
import './EditorView.scss';
import EditorContainer from './EditorContainer/EditorContainer';
import {PopupWindowType} from '~/data/enums/PopupWindowType';
import {AppState} from '~/store';
import {connect} from 'react-redux';
import TopNavigationBar from '~/views/Common/TopNavigationBar/TopNavigationBar';
import {updateLabelNames} from "~/store/labels/actionCreators";
import {LabelName} from "~/store/labels/types";

interface IProps {
    activePopupType: PopupWindowType;
    updateLabelNamesAction: (labels: LabelName[]) => any;
}

const EditorView: React.FC<IProps> = ({activePopupType, updateLabelNamesAction}) => {

    return (
        <div className={'EditorView'} draggable={false}>
            <TopNavigationBar/>
            <EditorContainer/>
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
