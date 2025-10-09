import React from 'react'

import { useFocusContext } from './snow-focus-context'
import { useNavigationContext } from './snow-navigation-context'
import { useStyleContext } from './snow-style-context'

const SnowContext = React.createContext({});

export function useSnowContext() {
    const value = React.useContext(SnowContext);
    if (!value) {
        throw new Error('useSnowContext must be wrapped in a <SnowContextProvider />');
    }
    return value;
}

export function SnowContextProvider(props) {
    const StyleContext = useStyleContext()
    const FocusContext = useFocusContext()
    const NavigationContext = useNavigationContext()
    const context = React.useMemo(() => ({
        ...StyleContext,
        ...FocusContext,
        ...NavigationContext
    }), [
        StyleContext,
        FocusContext,
        NavigationContext
    ]);
    return (
        <SnowContext.Provider
            style={{ flex: 1 }}
            value={context}
        >
            {props.children}
        </SnowContext.Provider>
    )
}

export default SnowContextProvider