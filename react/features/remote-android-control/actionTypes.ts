/**
 * The type of (redux) action which sets the remote android control active state.
 *
 * {
 *     type: SET_REMOTE_ANDROID_CONTROL_ACTIVE,
 *     active: boolean
 * }
 */
export const SET_REMOTE_ANDROID_CONTROL_ACTIVE = 'SET_REMOTE_ANDROID_CONTROL_ACTIVE';

/**
 * The type of (redux) action which sets the controlled participant for remote android control.
 *
 * {
 *     type: SET_REMOTE_ANDROID_CONTROL_CONTROLLED,
 *     controlled: string
 * }
 */
export const SET_REMOTE_ANDROID_CONTROL_CONTROLLED = 'SET_REMOTE_ANDROID_CONTROL_CONTROLLED';

/**
 * The type of (redux) action which starts remote android control.
 *
 * {
 *     type: REMOTE_ANDROID_CONTROL_START,
 *     participantId: string
 * }
 */
export const REMOTE_ANDROID_CONTROL_START = 'REMOTE_ANDROID_CONTROL_START';

/**
 * The type of (redux) action which stops remote android control.
 *
 * {
 *     type: REMOTE_ANDROID_CONTROL_STOP
 * }
 */
export const REMOTE_ANDROID_CONTROL_STOP = 'REMOTE_ANDROID_CONTROL_STOP';
