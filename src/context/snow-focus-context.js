import React from 'react';
import { Platform } from 'react-native'
import { SnowSafeArea } from '../component/snow-safe-area'

const FocusContext = React.createContext({});

export function useFocusContext() {
    const value = React.useContext(FocusContext);
    if (!value) {
        throw new Error('useFocusContext must be wrapped in a <FocusContextProvider />');
    }
    return value;
}

export function FocusContextProvider(props) {
    const [lockedElement, setLockedElement] = React.useState(null)
    const focusIsLocked = !!lockedElement
    const allowFocusing = Platform.isTV

    const focusContext = {
        allowFocusing,
        lockedElement,
        setLockedElement,
        focusIsLocked
    }
    return (
        <FocusContext.Provider
            value={focusContext}>
            <SnowSafeArea>
                {props.children}
            </SnowSafeArea>
        </FocusContext.Provider>
    );
}

export default FocusContextProvider