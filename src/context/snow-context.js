import React from 'react'

import { useToast } from 'expo-toast'

import { useStyleContext } from './snow-style-context'
import { useFocusAppContext, useFocusContext } from './snow-focus-context'
import { useInputContext } from './snow-input-context'
import { useNavigationContext } from './snow-navigation-context'
import { useLayerContext } from './snow-layer-context'
import { useEnvelopeAppContext, useEnvelopeContext } from './snow-envelope-context'

const SnowContext = React.createContext({})

export function useSnowContext() {
    const value = React.useContext(SnowContext)
    if (!value) {
        throw new Error('useSnowContext must be wrapped in a <SnowContextProvider />')
    }
    return value
}

export function SnowContextProvider(props) {
    const EnvelopeContext = useEnvelopeAppContext(props)
    const FocusContext = useFocusAppContext(props)
    const InputContext = useInputContext(props)
    const LayerContext = useLayerContext(props)
    const NavigationContext = useNavigationContext(props)
    const StyleContext = useStyleContext(props)
    const toast = useToast()

    const context = React.useMemo(() => ({
        ...EnvelopeContext,
        ...FocusContext,
        ...InputContext,
        ...LayerContext,
        ...NavigationContext,
        ...StyleContext,
        toast: { ...toast },
        useFocusContext,
        useEnvelopeContext
    }), [
        EnvelopeContext,
        FocusContext,
        InputContext,
        LayerContext,
        NavigationContext,
        StyleContext,
        toast,
        useFocusContext,
        useEnvelopeContext
    ])

    return (
        <SnowContext.Provider value={context}>
            {props.children}
        </SnowContext.Provider>
    )
}

export default SnowContextProvider