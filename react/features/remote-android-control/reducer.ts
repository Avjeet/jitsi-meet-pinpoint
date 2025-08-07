import { AnyAction } from 'redux';

import ReducerRegistry from '../base/redux/ReducerRegistry';

import { 
    SET_REMOTE_ANDROID_CONTROL_ACTIVE,
    SET_REMOTE_ANDROID_CONTROL_CONTROLLED
} from './actionTypes';

export interface IRemoteAndroidControlState {
    active: boolean;
    controlled?: string;
}

const initialState: IRemoteAndroidControlState = {
    active: false,
    controlled: undefined
};

/**
 * Reduces the Redux actions of the feature remote-android-control.
 */
export default ReducerRegistry.register(
    'features/remote-android-control',
    (state: IRemoteAndroidControlState = initialState, action: AnyAction): IRemoteAndroidControlState => {
        switch (action.type) {
        case SET_REMOTE_ANDROID_CONTROL_ACTIVE:
            return {
                ...state,
                active: action.active
            };

        case SET_REMOTE_ANDROID_CONTROL_CONTROLLED:
            return {
                ...state,
                controlled: action.controlled
            };

        default:
            return state;
        }
    }
);
