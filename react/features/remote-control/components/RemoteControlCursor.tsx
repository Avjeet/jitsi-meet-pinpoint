import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { IReduxState } from '../../app/types';

/**
 * Component that renders and manages the custom dot cursor for remote control sessions.
 *
 * @returns {JSX.Element|null} - The rendered component or null if not in remote control mode.
 */
const RemoteControlCursor = (): JSX.Element | null => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const isRemoteControlActive = useSelector((state: IReduxState) => state['features/remote-control'].active);
    
    useEffect(() => {
        // Handle cursor visibility based on remote control state
        if (isRemoteControlActive) {
            enableCustomCursor();
        } else {
            disableCustomCursor();
        }

        // Cleanup when component unmounts
        return () => {
            disableCustomCursor();
        };
    }, [isRemoteControlActive]);

    /**
     * Enables the custom cursor dot and adds event listener for mouse movement.
     *
     * @returns {void}
     */
    const enableCustomCursor = (): void => {
        document.body.classList.add('jitsi-remote-control-active');
        
        if (cursorRef.current) {
            // Explicitly set initial position and make it visible
            const initialX = window.innerWidth / 2;
            const initialY = window.innerHeight / 2;
            cursorRef.current.style.left = `${initialX}px`;
            cursorRef.current.style.top = `${initialY}px`;
            cursorRef.current.style.display = 'block';
            cursorRef.current.style.opacity = '1';
        }
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        
        // Use a MutationObserver to catch any dynamically added elements and ensure they have cursor: none
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            (node as HTMLElement).style.cursor = 'none';
                            
                            // Also set cursor: none for all children
                            const childElements = (node as HTMLElement).querySelectorAll('*');
                            childElements.forEach(element => {
                                (element as HTMLElement).style.cursor = 'none';
                            });
                        }
                    });
                }
            });
        });
        
        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Store the observer in a data attribute for cleanup
        document.body.dataset.cursorObserver = 'active';
        
        // Add mouseover listener to ensure cursor remains hidden when hovering over different elements
        document.addEventListener('mouseover', handleMouseOver);

        // Force an immediate mouse move event to position the cursor if the mouse hasn't moved yet
        const mousePos = getCurrentMousePosition();
        if (mousePos) {
            handleMouseMove(new MouseEvent('mousemove', {
                clientX: mousePos.x,
                clientY: mousePos.y
            }));
        }
    };

    /**
     * Gets the current mouse position if available from the browser's pointer lock API.
     * 
     * @returns {Object|null} - The current mouse position or null if not available.
     */
    const getCurrentMousePosition = (): {x: number, y: number} | null => {
        // Try to get from any stored position or use center of screen
        return {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        };
    };

    /**
     * Updates the position of the cursor dot to follow mouse movements.
     *
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     */
    const handleMouseMove = (e: MouseEvent): void => {
        if (cursorRef.current) {
            cursorRef.current.style.left = `${e.clientX}px`;
            cursorRef.current.style.top = `${e.clientY}px`;
            
            // Ensure the element under the cursor has cursor: none
            const elemUnderCursor = document.elementFromPoint(e.clientX, e.clientY);
            if (elemUnderCursor && elemUnderCursor !== cursorRef.current) {
                (elemUnderCursor as HTMLElement).style.cursor = 'none';
            }
        }
    };

    /**
     * Handles mouseover events to ensure cursor remains hidden.
     * 
     * @param {MouseEvent} e - The mouse event.
     * @returns {void}
     */
    const handleMouseOver = (e: MouseEvent): void => {
        if (e.target && e.target !== cursorRef.current) {
            (e.target as HTMLElement).style.cursor = 'none';
        }
    };

    /**
     * Handles when the mouse leaves the window.
     * 
     * @returns {void}
     */
    const handleMouseLeave = (): void => {
        if (cursorRef.current) {
            cursorRef.current.style.display = 'none';
        }
    };

    /**
     * Disables the custom cursor and removes the event listener.
     *
     * @returns {void}
     */
    const disableCustomCursor = (): void => {
        document.body.classList.remove('jitsi-remote-control-active');
        
        if (cursorRef.current) {
            cursorRef.current.style.display = 'none';
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseover', handleMouseOver);
        
        // Disconnect any active MutationObserver
        if (document.body.dataset.cursorObserver === 'active') {
            delete document.body.dataset.cursorObserver;
            
            // Find all elements and restore their cursor style
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                if (element !== cursorRef.current) {
                    (element as HTMLElement).style.removeProperty('cursor');
                }
            });
        }
    };

    if (!isRemoteControlActive) {
        return null;
    }

    return (
        <div 
            className='jitsi-remote-cursor-dot' 
            ref={cursorRef}
            style={{
                display: 'block', // Ensure it's initially visible
                position: 'fixed'
            }}
        />
    );
};

export default RemoteControlCursor;