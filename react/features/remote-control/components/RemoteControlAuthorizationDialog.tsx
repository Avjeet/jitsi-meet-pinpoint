import React, { Component } from 'react';
import { connect } from 'react-redux';

import { IReduxState, IStore } from '../../app/types';
import { translate } from '../../base/i18n/functions';
import { getParticipantById } from '../../base/participants/functions';
import { getLocalVideoTrack } from '../../base/tracks/functions.any';
import Dialog from '../../base/ui/components/web/Dialog';
import { deny, grant } from '../actions';

/**
 * The type of the React {@code Component} props of
 * {@link RemoteControlAuthorizationDialog}.
 */
interface IProps {

    /**
     * The display name of the participant who is requesting authorization for
     * remote desktop control session.
     */
    _displayName: string;

    _isScreenSharing: boolean;
    _sourceType: string;

    /**
     * Used to show/hide the dialog on cancel.
     */
    dispatch: IStore['dispatch'];

    /**
     * The ID of the participant who is requesting authorization for remote
     * desktop control session.
     */
    participantId: string;

    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}

/**
 * The state of the component.
 */
interface IState {
    /**
     * The countdown value in seconds before auto-acceptance.
     */
    countdown: number;
}

/**
 * Implements a dialog for remote control authorization.
 */
class RemoteControlAuthorizationDialog extends Component<IProps, IState> {
    /**
     * Countdown timer reference.
     */
    _countdownTimer: number | null = null;

    /**
     * Initializes a new RemoteControlAuthorizationDialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps) {
        super(props);

        this.state = {
            countdown: 5
        };

        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._updateCountdown = this._updateCountdown.bind(this);
    }

    /**
     * Set up the countdown timer when the component mounts.
     *
     * @inheritdoc
     */
    override componentDidMount() {
        this._countdownTimer = window.setInterval(this._updateCountdown, 1000);
    }

    /**
     * Clear the countdown timer when the component unmounts.
     *
     * @inheritdoc
     */
    override componentWillUnmount() {
        if (this._countdownTimer !== null) {
            window.clearInterval(this._countdownTimer);
            this._countdownTimer = null;
        }
    }

    /**
     * Updates the countdown timer and automatically accepts when it reaches zero.
     *
     * @private
     * @returns {void}
     */
    _updateCountdown() {
        this.setState(prevState => {
            const countdown = prevState.countdown - 1;
            
            // Auto-accept when countdown reaches zero
            if (countdown <= 0) {
                if (this._countdownTimer !== null) {
                    window.clearInterval(this._countdownTimer);
                    this._countdownTimer = null;
                }
                this._onSubmit();
            }
            
            return { countdown };
        });
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    override render() {
        return (
            <Dialog
                ok = {{ translationKey: 'dialog.allow' }}
                onCancel = { this._onCancel }
                onSubmit = { this._onSubmit }
                titleKey = 'dialog.remoteControlTitle'>
                {
                    this.props.t(
                        'dialog.remoteControlRequestMessage',
                        { user: this.props._displayName })
                }
                {
                    this._getAdditionalMessage()
                }
                <div style = {{ marginTop: '10px', textAlign: 'center' }}>
                    {this.props.t('dialog.remoteControlAutoAccept', { seconds: this.state.countdown })}
                </div>
            </Dialog>
        );
    }

    /**
     * Renders additional message text for the dialog.
     *
     * @private
     * @returns {ReactElement}
     */
    _getAdditionalMessage() {
        const { _isScreenSharing, _sourceType } = this.props;

        if (_isScreenSharing && _sourceType === 'screen') {
            return null;
        }

        return (
            <div>
                <br />
                { this.props.t('dialog.remoteControlShareScreenWarning') }
            </div>
        );
    }

    /**
     * Notifies the remote control module about the denial of the remote control
     * request.
     *
     * @private
     * @returns {boolean} Returns true to close the dialog.
     */
    _onCancel() {
        const { dispatch, participantId } = this.props;

        // Clear the countdown timer when the user manually denies
        if (this._countdownTimer !== null) {
            window.clearInterval(this._countdownTimer);
            this._countdownTimer = null;
        }

        dispatch(deny(participantId));

        return true;
    }

    /**
     * Notifies the remote control module that the remote control request is
     * accepted.
     *
     * @private
     * @returns {boolean} Returns false to prevent closure because the dialog is
     * closed manually to be sure that if the desktop picker dialog can be
     * displayed (if this dialog is displayed when we try to display the desktop
     * picker window, the action will be ignored).
     */
    _onSubmit() {
        const { dispatch, participantId } = this.props;

        // Clear the countdown timer when the user manually accepts
        if (this._countdownTimer !== null) {
            window.clearInterval(this._countdownTimer);
            this._countdownTimer = null;
        }

        dispatch(grant(participantId));

        return false;
    }
}

/**
 * Maps (parts of) the Redux state to the RemoteControlAuthorizationDialog's
 * props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The React Component props passed to the associated
 * (instance of) RemoteControlAuthorizationDialog.
 * @private
 * @returns {{
 *     _displayName: string,
 *     _isScreenSharing: boolean,
 *     _sourceId: string,
 *     _sourceType: string
 * }}
 */
function _mapStateToProps(state: IReduxState, ownProps: any) {
    const { _displayName, participantId } = ownProps;
    const participant = getParticipantById(state, participantId);
    const tracks = state['features/base/tracks'];
    const track = getLocalVideoTrack(tracks);
    const _isScreenSharing = track?.videoType === 'desktop';
    const { sourceType } = track?.jitsiTrack || {};

    return {
        _displayName: participant ? participant.name : _displayName,
        _isScreenSharing,
        _sourceType: sourceType
    };
}

export default translate(
    connect(_mapStateToProps)(RemoteControlAuthorizationDialog));
