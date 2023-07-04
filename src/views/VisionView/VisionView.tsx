import React from "react";
import TopNavigationBar from "~/views/Common/TopNavigationBar/TopNavigationBar";
import VisionEditor from "~/views/VisionView/VisionEditor";

const VisionView: React.FC = () => {

    return (
        <div className={'EditorView'} draggable={false}>
            <TopNavigationBar/>
            <VisionEditor/>
        </div>
    );
};


export default VisionView;