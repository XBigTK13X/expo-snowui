import React from 'react'

import { useStyleContext } from './snow-style-context'
import { useFocusContext } from './snow-focus-context'
import { useInputContext } from './snow-input-context'
import { useNavigationContext } from './snow-navigation-context'
import { useLayerContext } from './snow-layer-context'

const SnowContext = React.createContext({});

export function useSnowContext() {
    const value = React.useContext(SnowContext);
    if (!value) {
        throw new Error('useSnowContext must be wrapped in a <SnowContextProvider />');
    }
    return value;
}

export function SnowContextProvider(props) {
    const StyleContext = useStyleContext(props)
    const InputContext = useInputContext(props)
    const FocusContext = useFocusContext(props)
    const NavigationContext = useNavigationContext(props)
    const LayerContext = useLayerContext(props)

    const context = React.useMemo(() => ({
        ...StyleContext,
        ...InputContext,
        ...FocusContext,
        ...NavigationContext,
        ...LayerContext
    }), [
        StyleContext,
        InputContext,
        FocusContext,
        NavigationContext,
        LayerContext
    ]);

    return (
        <SnowContext.Provider value={context}>
            {props.children}
        </SnowContext.Provider>
    )
}

export default SnowContextProvider