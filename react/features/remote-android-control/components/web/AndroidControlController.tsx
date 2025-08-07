import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IReduxState } from '../../../app/types';

import { handlePointerMove, handlePointerDown, handlePointerUp, hidePointer, showPointer } from '../../actions';
import { getVideoElement } from '../../functions';

/**
 * Component that handles android control events when remote android control is active.
 * Optimized for Web → Android control.
 */
const AndroidControlController: React.FC = () => {
    const dispatch = useDispatch();
    const { active } = useSelector((state: IReduxState) => state['features/remote-android-control']);
    const videoElementRef = useRef<HTMLElement | null>(null);

    const onPointerMove = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        const videoElement = videoElementRef.current;
        if (videoElement && active) {
            dispatch(handlePointerMove(event, videoElement));
        }
    }, [dispatch, active]);

    const onPointerDown = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        const videoElement = videoElementRef.current;
        if (videoElement && active) {
            dispatch(handlePointerDown(event, videoElement));
        }
    }, [dispatch, active]);

    const onPointerUp = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        const videoElement = videoElementRef.current;
        if (videoElement && active) {
            dispatch(handlePointerUp(event, videoElement));
        }
    }, [dispatch, active]);

    const onPointerEnter = useCallback(() => {
        if (active) {
            dispatch(showPointer());
        }
    }, [dispatch, active]);

    const onPointerLeave = useCallback(() => {
        if (active) {
            dispatch(hidePointer());
        }
    }, [dispatch, active]);

    useEffect(() => {
        if (active) {
            videoElementRef.current = getVideoElement();
            const videoElement = videoElementRef.current;

            if (videoElement) {
                // Add event listeners for mouse/touch events
                videoElement.addEventListener('mousemove', onPointerMove as any);
                videoElement.addEventListener('mousedown', onPointerDown as any);
                videoElement.addEventListener('mouseup', onPointerUp as any);
                videoElement.addEventListener('mouseenter', onPointerEnter);
                videoElement.addEventListener('mouseleave', onPointerLeave);

                return () => {
                    // Cleanup event listeners
                    videoElement.removeEventListener('mousemove', onPointerMove as any);
                    videoElement.removeEventListener('mousedown', onPointerDown as any);
                    videoElement.removeEventListener('mouseup', onPointerUp as any);
                    videoElement.removeEventListener('mouseenter', onPointerEnter);
                    videoElement.removeEventListener('mouseleave', onPointerLeave);
                };
            }
        }
    }, [active, onPointerMove, onPointerDown, onPointerUp, onPointerEnter, onPointerLeave]);

    // This component doesn't render anything visible
    return null;
};

export default AndroidControlController;
