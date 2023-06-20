import React, {useState} from 'react';
import './MainView.scss';
import classNames from 'classnames';
import {ISize} from '../../interfaces/ISize';
import {ImageButton} from '../Common/ImageButton/ImageButton';
import {ISocialMedia, SocialMediaData} from '../../data/info/SocialMediaData';
import {EditorFeatureData, IEditorFeature} from '../../data/info/EditorFeatureData';
import {styled, Tooltip, tooltipClasses, TooltipProps} from '@mui/material';
import Fade from '@mui/material/Fade';
import ImagesUpload from "~/views/MainView/ImageUpload/ImagesUpload";

const MainView: React.FC = () => {
    const [projectInProgress, setProjectInProgress] = useState(false);
    const [projectCanceled, setProjectCanceled] = useState(false);

    const startProject = () => {
        setProjectInProgress(true);
    };

    const endProject = () => {
        setProjectInProgress(false);
        setProjectCanceled(true);
    };

    const getClassName = () => {
        return classNames(
            'MainView', {
            'InProgress': projectInProgress,
            'Canceled': !projectInProgress && projectCanceled
        }
        );
    };

    const DarkTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: '#171717',
            color: '#ffffff',
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: 120
        },
    }));

    const getSocialMediaButtons = (size: ISize) => {
        return SocialMediaData.map((data: ISocialMedia, index: number) => {
            return <DarkTooltip
                key={index}
                disableFocusListener={true}
                title={data.tooltipMessage}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement='left'
            >
                <div>
                    <ImageButton
                        buttonSize={size}
                        image={data.imageSrc}
                        imageAlt={data.imageAlt}
                        href={data.href}
                    />
                </div>
            </DarkTooltip>;
        });
    };

    const getEditorFeatureTiles = () => {
        return EditorFeatureData.map((data: IEditorFeature) => {
            return <div
                className='EditorFeaturesTiles'
                key={data.displayText}
            >
                <div
                    className='EditorFeaturesTilesWrapper'
                >
                    <img
                        draggable={false}
                        alt={data.imageAlt}
                        src={data.imageSrc}
                    />
                    <div className='EditorFeatureLabel'>
                        {data.displayText}
                    </div>
                </div>
            </div>;
        });
    };

    return (
        <ImagesUpload />
    );
};

export default MainView;
