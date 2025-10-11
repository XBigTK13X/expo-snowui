import React from 'react';

import { prettyLog } from '../util'

const LayerContext = React.createContext({});

export function useLayerContext() {
    let value = React.useContext(LayerContext);
    if (!value) {
        throw new Error('useLayerContext must be wrapped in a <LayerContextProvider />');
    }
    return value;
}

export function LayerContextProvider(props) {
    const [modals, setModals] = React.useState([])
    const [overlays, setOverlays] = React.useState([])

    const DEBUG = props.DEBUG_LAYERS

    const pushOverlay = (overlay) => {
        setOverlays((prev) => {
            if (DEBUG) {
                prettyLog({ context: 'layer', action: 'pushOverlay', prev, overlay })
            }
            return [...prev, overlay]
        })
    }

    const popOverlay = () => {
        setOverlays((prev) => {
            let result = [...prev]
            if (result.length) {
                result.pop()
            }
            if (DEBUG) {
                prettyLog({ context: 'layer', action: 'popOverlay', prev, result })
            }
            return result
        })
    }

    let currentOverlay = null
    if (overlays.length) {
        currentOverlay = modals.at(-1)
    }

    const clearOverlays = () => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'clearOverlays' })
        }
        setOverlays([])
    }

    const pushModal = (modal) => {
        setModals((prev) => {
            if (DEBUG) {
                prettyLog({ context: 'layer', action: 'pushModal', prev, modal })
            }
            return [...prev, modal]
        })
    }

    const popModal = () => {
        setModals((prev) => {
            let result = [...prev]
            if (result.length) {
                result.pop()
            }
            if (DEBUG) {
                prettyLog({ context: 'layer', action: 'popModal', prev, result })
            }
            return result
        })
    }

    let currentModal = null
    if (modals.length) {
        currentModal = modals.at(-1)
    }

    const clearModals = () => {
        setModals([])
    }

    if (DEBUG === 'verbose') {
        prettyLog({ context: 'layer', action: 'render', currentModal, currentOverlay })
    }


    const context = {
        DEBUG_LAYERS: DEBUG,
        pushOverlay,
        pushModal,
        popModal,
        popOverlay,
        clearModals,
        clearOverlays,
        currentModal,
        currentOverlay
    }
    return (
        <LayerContext.Provider style={{ flex: 1 }} value={context}>
            {props.children}
        </LayerContext.Provider>
    )
}

export default LayerContextProvider