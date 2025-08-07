import { ENDPOINT_MESSAGE_RECEIVED } from '../base/conference/actionTypes';
import { PARTICIPANT_LEFT } from '../base/participants/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import { stopRemoteAndroidControl } from './actions';

/**
 * Middleware for remote android control feature.
 */
MiddlewareRegistry.register(store => next => action => {
    const { dispatch, getState } = store;

    switch (action.type) {

        case PARTICIPANT_LEFT: {
            const state = getState();
            const { controlled } = state['features/remote-android-control'];

            if (controlled === action.participant.id) {
                dispatch(stopRemoteAndroidControl());
            }
            break;
        }
    }

    return next(action);
});
