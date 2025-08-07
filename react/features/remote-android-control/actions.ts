import { IStore } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
import { showNotification } from '../notifications/actions';
import { NOTIFICATION_TIMEOUT_TYPE } from '../notifications/constants';

import {
    SET_REMOTE_ANDROID_CONTROL_ACTIVE,
    SET_REMOTE_ANDROID_CONTROL_CONTROLLED
} from './actionTypes';
import {
    REMOTE_ANDROID_CONTROL_EVENTS
} from './constants';
import { sendRemoteAndroidControlEndpointMessage } from './functions';

/**
 * Sets the remote android control active state.
 *
 * @param {boolean} active - Whether remote android control is active.
 * @returns {Object}
 */
export function setRemoteAndroidControlActive(active: boolean) {
    return {
        type: SET_REMOTE_ANDROID_CONTROL_ACTIVE,
        active
    };
}

/**
 * Sets the controlled participant for remote android control.
 *
 * @param {string} controlled - The participant ID being controlled.
 * @returns {Object}
 */
export function setRemoteAndroidControlControlled(controlled: string | undefined) {
    return {
        type: SET_REMOTE_ANDROID_CONTROL_CONTROLLED,
        controlled
    };
}

/**
 * Starts remote android control session with a participant.
 *
 * @param {string} participantId - The participant to control.
 * @returns {Function}
 */
export function startRemoteAndroidControl(participantId: string) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { conference } = state['features/base/conference'];
        
        if (!conference) {
            return;
        }
        
        dispatch(setRemoteAndroidControlActive(true));
        dispatch(setRemoteAndroidControlControlled(participantId));
        
        const messageResult = sendRemoteAndroidControlEndpointMessage(conference, participantId, {
            type: REMOTE_ANDROID_CONTROL_EVENTS.start
        });
        
        dispatch(showNotification({
            descriptionKey: 'remoteAndroidControl.started',
            titleKey: 'remoteAndroidControl.title'
        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
    };
}

/**
 * Stops the remote android control session.
 *
 * @returns {Function}
 */
export function stopRemoteAndroidControl() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { controlled } = state['features/remote-android-control'];
        const { conference } = state['features/base/conference'];

        if (controlled && conference) {
            sendRemoteAndroidControlEndpointMessage(conference, controlled, {
                type: REMOTE_ANDROID_CONTROL_EVENTS.stop
            });
        }

        dispatch(setRemoteAndroidControlActive(false));
        dispatch(setRemoteAndroidControlControlled(undefined));

        dispatch(showNotification({
            descriptionKey: 'remoteAndroidControl.stopped',
            titleKey: 'remoteAndroidControl.title'
        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
    };
}

/**
 * Handles mouse/touch move events and sends pointer coordinates.
 *
 * @param {React.MouseEvent | React.TouchEvent} event - The mouse or touch event.
 * @param {HTMLElement} videoElement - The video element for coordinate calculation.
 * @returns {Function}
 */
export function handlePointerMove(event: React.MouseEvent | React.TouchEvent, videoElement: HTMLElement) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { active, controlled } = state['features/remote-android-control'];
        const { conference } = state['features/base/conference'];
    
        if (!active || !controlled || !conference) {
            return;
        }

        const rect = videoElement.getBoundingClientRect();
        let clientX: number, clientY: number;

        // Handle mouse events
        if ('clientX' in event) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            console.log('🟦 handlePointerMove: Invalid event - no clientX/clientY');
            return;
        }

        // Calculate normalized coordinates (0-1 range) relative to video element
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        // Send pointer move message
        sendRemoteAndroidControlEndpointMessage(conference, controlled, {
            type: REMOTE_ANDROID_CONTROL_EVENTS.pointerMove,
            x,
            y
        });
    };
}

/**
 * Handles mouse/touch down events and sends pointer down coordinates.
 *
 * @param {React.MouseEvent | React.TouchEvent} event - The mouse or touch event.
 * @param {HTMLElement} videoElement - The video element for coordinate calculation.
 * @returns {Function}
 */
export function handlePointerDown(event: React.MouseEvent | React.TouchEvent, videoElement: HTMLElement) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { active, controlled } = state['features/remote-android-control'];
        const { conference } = state['features/base/conference'];

        if (!active || !controlled || !conference) {
            return;
        }

        const rect = videoElement.getBoundingClientRect();
        let clientX: number, clientY: number;

        // Handle both mouse and touch events
        if ('clientX' in event) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            return;
        }

        // Calculate normalized coordinates (0-1 range)
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        // Send pointer down message
        sendRemoteAndroidControlEndpointMessage(conference, controlled, {
            type: REMOTE_ANDROID_CONTROL_EVENTS.pointerDown,
            x,
            y
        });
    };
}

/**
 * Handles mouse/touch up events and sends pointer up coordinates.
 *
 * @param {React.MouseEvent | React.TouchEvent} event - The mouse or touch event.
 * @param {HTMLElement} videoElement - The video element for coordinate calculation.
 * @returns {Function}
 */
export function handlePointerUp(event: React.MouseEvent | React.TouchEvent, videoElement: HTMLElement) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { active, controlled } = state['features/remote-android-control'];
        const { conference } = state['features/base/conference'];

        if (!active || !controlled || !conference) {
            return;
        }

        const rect = videoElement.getBoundingClientRect();
        let clientX: number, clientY: number;

        // Handle both mouse and touch events
        if ('clientX' in event) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            return;
        }

        // Calculate normalized coordinates (0-1 range)
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

        // Send pointer up message
        sendRemoteAndroidControlEndpointMessage(conference, controlled, {
            type: REMOTE_ANDROID_CONTROL_EVENTS.pointerUp,
            x,
            y
        });
    };
}



/**
 * Handles showing the pointer.
 * NOTE: For Android apps, this just sends the message. Android handles the visualization.
 *
 * @returns {Function}
 */
export function showPointer() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { controlled } = state['features/remote-android-control'];
        const { conference } = state['features/base/conference'];

        if (controlled && conference) {
            sendRemoteAndroidControlEndpointMessage(conference, controlled, {
                type: REMOTE_ANDROID_CONTROL_EVENTS.pointerShow
            });
        }
    };
}

/**
 * Handles hiding the pointer.
 * NOTE: For Android apps, this just sends the message. Android handles the visualization.
 *
 * @returns {Function}
 */
/**
 * Handles hiding the pointer.
 * NOTE: For Android apps, this just sends the message. Android handles the visualization.
 *
 * @returns {Function}
 */
export function hidePointer() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { controlled } = state['features/remote-android-control'];
        const { conference } = state['features/base/conference'];

        console.log('🟦 Sending hidePointer message to Android app:', controlled);

        if (controlled && conference) {
            sendRemoteAndroidControlEndpointMessage(conference, controlled, {
                type: REMOTE_ANDROID_CONTROL_EVENTS.pointerHide
            });
        }
    };
}

/**
 * NOTE: handleRemoteAndroidControlMessage function removed since Android app handles all android control message receiving.
 * Web client only sends android control commands to Android app via endpoint messages.
 */
