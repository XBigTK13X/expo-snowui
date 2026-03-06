import React from 'react';

import { prettyLog } from '../util'

import { useNavigationContext } from './snow-navigation-context'
import { useFocusAppContext } from './snow-focus-context'

const LayerContext = React.createContext({});

export function useLayerContext() {
    let value = React.useContext(LayerContext);
    if (!value) {
        throw new Error('useLayerContext must be wrapped in a <LayerContextProvider />');
    }
    return value;
}

export function LayerContextProvider(props) {
    const { focusOn } = useFocusAppContext()
    const { blockBackAction } = useNavigationContext()

    const DEBUG = props.DEBUG_LAYERS

    const [modalPayloads, setModalPayloads] = React.useState([])
    const [overlayPayload, setOverlayPayload] = React.useState(null)

    React.useEffect(() => {
        blockBackAction(!!modalPayloads?.length)
    }, [modalPayloads])

    const openOverlay = (payload) => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'openOverlay', overlayPayload, payload })
        }
        setOverlayPayload(payload)
    }

    const closeOverlay = () => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'closeOverlay', overlayPayload })
        }
        setOverlayPayload(null)
    }

    const pushModal = (payload) => {
        if (payload?.focusPath) {
            focusOn(payload?.focusPath)
        }
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
        openOverlay,
        closeOverlay,
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