import classNames from "classnames";
import EditorView from "~/views/EditorView/EditorView";
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {ImagesDownload} from "~/utils/ImagesDownload";
import {LabelsUpload} from "~/utils/LabelsUpload";
import {LabelName} from "~/store/labels/types";
import {updateLabelNames} from "~/store/labels/actionCreators";


const AnnotationView: React.FC = () => {

    const [projectLoaded, setProjectLoaded] = useState(false)
    const dispatch = useDispatch()


    useEffect(() => {
        (async () => {
            await ImagesDownload()
            await LabelsUpload()
            const l: LabelName[] = [{
                id: '0',
                name: 'peeble',
                color: '#ff0000',
            }]
            dispatch(updateLabelNames(l))
            setProjectLoaded(true)
        })()
    }, [])
    return (projectLoaded &&
        <>
            <div className={classNames('App', {'AI': false})} draggable={false}>
                <EditorView/>
            </div>
        </>
    );
};

export default AnnotationView;