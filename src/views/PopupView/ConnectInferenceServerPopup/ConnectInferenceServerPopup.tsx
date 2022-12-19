import React, { useState } from 'react';
import { PopupActions } from '../../../logic/actions/PopupActions';
import { AppState } from '../../../store';
import { connect } from 'react-redux';
import { GenericSideMenuPopup } from '../GenericSideMenuPopup/GenericSideMenuPopup';
import { ImageButton } from '../../Common/ImageButton/ImageButton';
import { InferenceServerDataMap } from '../../../data/info/InferenceServerData';
import { InferenceServerType } from '../../../data/enums/InferenceServerType';
import { INotification, NotificationsActionType } from '../../../store/notifications/types';
import { submitNewNotification } from '../../../store/notifications/actionCreators';
import { NotificationUtil } from '../../../utils/NotificationUtil';
import { NotificationsDataMap } from '../../../data/info/NotificationsData';
import { Notification } from '../../../data/enums/Notification';
import './ConnectInferenceServerPopup.scss'
import { StyledTextField } from '../../Common/StyledTextField/StyledTextField';
import { updateRoboflowAPIDetails } from '../../../store/ai/actionCreators';
import { AIActionTypes, RoboflowAPIDetails } from '../../../store/ai/types';

interface IProps {
    roboflowAPIDetails: RoboflowAPIDetails;
    submitNewNotificationAction: (notification: INotification) => NotificationsActionType;
    updateRoboflowAPIDetailsAction: (roboflowAPIDetails: RoboflowAPIDetails) => AIActionTypes;
}

const ConnectInferenceServerPopup: React.FC<IProps> = (
    {
        roboflowAPIDetails,
        submitNewNotificationAction,
        updateRoboflowAPIDetailsAction
    }
) => {
    // general
    const [currentServerType, setCurrentServerType] = useState(InferenceServerType.ROBOFLOW);

    // roboflow
    const [roboflowModel, setRoboflowModel] = useState(roboflowAPIDetails.model);
    const [roboflowKey, setRoboflowKey] = useState(roboflowAPIDetails.key);

    const wrapServerOnClick = (newServerType: InferenceServerType) => {
        return () => {
            if (!InferenceServerDataMap[newServerType].isDisabled) {
                setCurrentServerType(newServerType)
            } else {
                submitNewNotificationAction(NotificationUtil.createMessageNotification(
                    NotificationsDataMap[Notification.UNSUPPORTED_INFERENCE_SERVER_MESSAGE]));
                return;
            }
        }
    }

    const disableAcceptButton = () => {
        switch(currentServerType) {
            case InferenceServerType.ROBOFLOW:
                return roboflowModel === '' || roboflowKey === ''
            default:
                return true;
        }
    }

    const onAccept = () => {
        if (disableAcceptButton()) {
            return;
        }
        updateRoboflowAPIDetailsAction({
            model: roboflowModel,
            key: roboflowKey
        })
        PopupActions.close();
    };

    const onReject = () => {
        PopupActions.close();
    };

    const roboflowModelOnChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoboflowModel(event.target.value)
    }

    const roboflowKeyOnChangeCallback = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoboflowKey(event.target.value)
    }

    const renderContent = (): JSX.Element => {
        if (currentServerType === InferenceServerType.ROBOFLOW) {
            return <>
                <div className='message'>
                    Provide details of the Roboflow model you want to run over tha API, as well as your API key.
                </div>
                <div className='details'>
                    <StyledTextField
                        variant='standard'
                        id={'key'}
                        autoComplete={'off'}
                        autoFocus={true}
                        type={'text'}
                        margin={'dense'}
                        label={'roboflow model'}
                        value={roboflowModel}
                        onChange={roboflowModelOnChangeCallback}
                        style={{ width: 280 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <StyledTextField
                        variant='standard'
                        id={'key'}
                        autoComplete={'off'}
                        autoFocus={true}
                        type={'password'}
                        margin={'dense'}
                        label={'roboflow api key'}
                        value={roboflowKey}
                        onChange={roboflowKeyOnChangeCallback}
                        style={{ width: 280 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
            </>;
        }
        return <div className='load-model-popup-content'/>
    };

    const renderSideMenuContent = (): JSX.Element[] => {
        return Object.entries(InferenceServerDataMap).map(([serverType, serverData], index: number) => {
            return <ImageButton
                key={index}
                image={serverData.imageSrc}
                imageAlt={serverData.imageAlt}
                buttonSize={{width: 40, height: 40}}
                padding={20}
                onClick={wrapServerOnClick(serverType as InferenceServerType)}
                isActive={currentServerType === serverType}
                isDisabled={serverData.isDisabled}
            />
        })
    }
    return (
        <GenericSideMenuPopup
            title={InferenceServerDataMap[currentServerType].name}
            renderContent={renderContent}
            renderSideMenuContent={renderSideMenuContent}
            acceptLabel={'Connect'}
            onAccept={onAccept}
            disableAcceptButton={disableAcceptButton()}
            rejectLabel={'Back'}
            onReject={onReject}
        />
    );
}

const mapDispatchToProps = {
    submitNewNotificationAction: submitNewNotification,
    updateRoboflowAPIDetailsAction: updateRoboflowAPIDetails
};

const mapStateToProps = (state: AppState) => ({
    roboflowAPIDetails: state.ai.roboflowAPIDetails
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectInferenceServerPopup);