import React from 'react'

import { useToast } from 'expo-toast'

import { useFocusAppContext, useFocusContext } from './snow-focus-context'
import { useHubContext, useHubState, useHubEventListener } from './snow-hub-context'
import { useInputContext } from './snow-input-context'
import { useLayerContext } from './snow-layer-context'
import { useNavigationContext } from './snow-navigation-context'
import { useStyleContext } from './snow-style-context'

const SnowContext = React.createContext({})

export function useSnowContext() {
    const value = React.useContext(SnowContext)
    if (!value) {
        throw new Error('useSnowContext must be wrapped in a <SnowContextProvider />')
    }
    return value
}

export function SnowContextProvider(props) {
    const FocusContext = useFocusAppContext(props)
    const HubContext = useHubContext(props)
    const InputContext = useInputContext(props)
    const LayerContext = useLayerContext(props)
    const NavigationContext = useNavigationContext(props)
    const StyleContext = useStyleContext(props)
    const toast = useToast()

    const context = React.useMemo(() => ({
        ...FocusContext,
        ...HubContext,
        ...InputContext,
        ...LayerContext,
        ...NavigationContext,
        ...StyleContext,
        toast: { ...toast },
        useFocusContext,
        useHubContext,
        useHubState,
        useHubEventListener
    }), [
        FocusContext,
        HubContext,
        InputContext,
        LayerContext,
        NavigationContext,
        StyleContext,
        toast
    ])

    return (
        <SnowContext.Provider value={context}>
            {props.children}
        </SnowContext.Provider>
    )
}

export default SnowContextProvider