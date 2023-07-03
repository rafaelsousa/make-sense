import React from "react";
import TopNavigationBar from "~/views/Common/TopNavigationBar/TopNavigationBar";
import TrainingEditor from "~/views/TrainingView/TrainingEditor";

const TrainingView: React.FC = () => {

    return (
        <div className={'EditorView'} draggable={false}>
            <TopNavigationBar/>
            <TrainingEditor/>
        </div>
    );
};


export default TrainingView;