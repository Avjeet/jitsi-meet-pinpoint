import React, { Component } from 'react';
import { WithTranslation } from 'react-i18next';

import { translate } from '../../../base/i18n/functions';
import { IconPointer, IconPointerOff } from '../../../base/icons/svg';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';

import { REMOTE_ANDROID_CONTROL_BUTTON_STATES } from '../../constants';

interface IProps extends WithTranslation {
    /**
     * Callback to execute when the button is clicked.
     */
    onClick: () => void;

    /**
     * The ID of the participant.
     */
    participantID: string;

    /**
     * The current state of remote android control.
     */
    remoteAndroidControlState: number;
}

/**
 * Remote android control button component for participant context menu.
 */
class RemoteAndroidControlButton extends Component<IProps> {
    constructor(props: IProps) {
        super(props);

        this._onClick = this._onClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     */
    override render() {
        const { remoteAndroidControlState, t } = this.props;

        if (remoteAndroidControlState === REMOTE_ANDROID_CONTROL_BUTTON_STATES.NOT_AVAILABLE) {
            return null;
        }

        const isActive = remoteAndroidControlState === REMOTE_ANDROID_CONTROL_BUTTON_STATES.ACTIVE;
        const icon = isActive ? IconPointerOff : IconPointer;
        const text = isActive ? 'remoteAndroidControl.stop' : 'remoteAndroidControl.start';

        return (
            <ContextMenuItem
                accessibilityLabel={t(text)}
                icon={icon}
                onClick={this._onClick}
                text={t(text)}
            />
        );
    }

    /**
     * Handles button click.
     */
    _onClick() {
        this.props.onClick();
    }
}

export default translate(RemoteAndroidControlButton);
