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
    const [modalPayloads, setModalPayloads] = React.useState([])
    const [overlayPayload, setOverlayPayload] = React.useState(null)

    const DEBUG = props.DEBUG_LAYERS

    const enableOverlay = (payload) => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'enableOverlay', overlayPayload, payload })
        }
        setOverlayPayload(payload)
    }

    const disableOverlay = () => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'disableOverlay', overlayPayload })
        }
        setOverlayPayload(null)
    }

    const pushModal = (payload) => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'pushModal', modalPayloads, payload })
        }
        setModalPayloads((prev) => { return [...prev, payload] })
    }

    const clearModals = () => {
        setModalPayloads([])
    }

    const popModal = () => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'popModal', modalPayloads })
        }
        setModalPayloads((prev) => {
            let result = [...prev]
            if (result.length) {
                result.pop()
            }
            return result
        })
    }

    if (DEBUG === 'verbose') {
        prettyLog({ context: 'layer', action: 'render', modalPayloads, overlayPayload })
    }

    const context = {
        DEBUG_LAYERS: DEBUG,
        enableOverlay,
        disableOverlay,
        overlayPayload,
        pushModal,
        popModal,
        clearModals,
        modalPayloads
    }
    return (
        <LayerContext.Provider style={{ flex: 1 }} value={context}>
            {props.children}
        </LayerContext.Provider>
    )
}

export default LayerContextProvider