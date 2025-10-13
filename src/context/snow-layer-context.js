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
    const [modalPayload, setModalPayload] = React.useState(null)
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

    const showModal = (payload) => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'showModal', modalPayload, payload })
        }
        setModalPayload(payload)
    }

    const hideModal = () => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'hideModal', modalPayload })
        }
        setModalPayload(null)
    }

    if (DEBUG === 'verbose') {
        prettyLog({ context: 'layer', action: 'render', modalPayload, overlayPayload })
    }

    const context = {
        DEBUG_LAYERS: DEBUG,
        enableOverlay,
        disableOverlay,
        overlayPayload,
        showModal,
        hideModal,
        modalPayload,
    }
    return (
        <LayerContext.Provider style={{ flex: 1 }} value={context}>
            {props.children}
        </LayerContext.Provider>
    )
}

export default LayerContextProvider