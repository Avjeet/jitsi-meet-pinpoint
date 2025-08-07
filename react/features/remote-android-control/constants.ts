/**
 * The name of the message that will be sent through the datachannel for remote android control communication.
 */
export const REMOTE_ANDROID_CONTROL_MESSAGE_NAME = 'remote-android-control';

/**
 * Remote android control events.
 */
export const REMOTE_ANDROID_CONTROL_EVENTS = {
    pointerMove: 'pointer-move',
    pointerShow: 'pointer-show',
    pointerHide: 'pointer-hide',
    pointerDown: 'pointer-down',
    pointerUp: 'pointer-up',
    start: 'start',
    stop: 'stop'
};

/**
 * Remote android control button states for the UI.
 */
export const REMOTE_ANDROID_CONTROL_BUTTON_STATES = {
    NOT_AVAILABLE: 0,
    AVAILABLE: 1,
    ACTIVE: 2
};
