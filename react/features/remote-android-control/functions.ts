import { IReduxState } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
import { getParticipantById } from '../base/participants/functions';
import { isScreenVideoShared } from '../screen-share/functions';

import { REMOTE_ANDROID_CONTROL_MESSAGE_NAME } from './constants';

/**
 * Checks if remote android control is available for a participant.
 * Remote android control is available when the participant is screen sharing.
 *
 * @param {IReduxState} state - The redux state.
 * @param {string} participantId - The participant ID to check.
 * @returns {boolean} True if remote android control is available.
 */
export function isRemoteAndroidControlAvailable(state: IReduxState, participantId: string): boolean {    
    const participant = getParticipantById(state, participantId);
    
    if (!participant) {
        return false;
    }

    // For local participant, check if they are screen sharing
    if (participant.local) {
        const isSharing = isScreenVideoShared(state);
        return isSharing;
    }

    // For remote participants, check if they have a desktop track
    const tracks = state['features/base/tracks'];
    const participantTracks = tracks.filter(t => t.participantId === participantId);
    
    const hasDesktopTrack = tracks.some((track: any) => {
        const matches = track.participantId === participantId && 
                       track.mediaType === 'screenshare' && 
                       track.videoType === 'desktop';
        
        return matches;
    });
    
    return hasDesktopTrack;
}

/**
 * Sends remote android control message to a participant through data channel.
 * This uses the external API mechanism to ensure Android apps receive the message.
 *
 * @param {IJitsiConference} conference - The conference instance.
 * @param {string} to - The participant ID to send to.
 * @param {any} event - The event data.
 * @returns {boolean} True if message was sent successfully.
 */
export function sendRemoteAndroidControlEndpointMessage(
    conference: IJitsiConference,
    to: string,
    event: any
): boolean {
    try { 
        // Send the message as a text message with JSON payload
        // This will trigger SEND_ENDPOINT_TEXT_MESSAGE on Android
        const messagePayload = JSON.stringify({
            name: REMOTE_ANDROID_CONTROL_MESSAGE_NAME,
            ...event
        });
                
        conference.sendEndpointMessage(to, {
            name: 'endpoint-text-message', // This is the ENDPOINT_TEXT_MESSAGE_NAME
            text: messagePayload
        });
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Gets the video element for coordinate calculations.
 * This can be the large video or a specific participant's video.
 *
 * @returns {HTMLElement | null} The video element or null if not found.
 */
export function getVideoElement(): HTMLElement | null {
    // Try to get the actual large video element first
    const largeVideoElement = document.getElementById('largeVideo');
    if (largeVideoElement) {
        const rect = largeVideoElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
            return largeVideoElement;
        }
    }

    // Fallback to main container
    const mainContainer = document.getElementById('videospace');
    return mainContainer;
}
