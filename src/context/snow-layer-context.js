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
    const {
        focusOn,
        resetFocusStart,
        getActiveFocusedHash
    } = useFocusAppContext()
    const {
        blockBackAction,
        navRemove,
        navUpdate
    } = useNavigationContext()

    const DEBUG = props.DEBUG_LAYERS

    const [modalPayloads, setModalPayloads] = React.useState([])
    const [overlayPayload, setOverlayPayload] = React.useState(null)
    const premodalHashRef = React.useRef(null)

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
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'pushModal', modalPayloads, payload })
        }
        premodalHashRef.current = getActiveFocusedHash()
        if (payload?.focusPath) focusOn(payload?.focusPath)
        setModalPayloads((prev) => [...prev, payload])
    }

    const popModal = () => {
        if (DEBUG) {
            prettyLog({ context: 'layer', action: 'popModal', modalPayloads })
        }
        setModalPayloads((prev) => {
            let result = [...prev]
            if (result.length) result.pop()
            return result
        })
        const target = premodalHashRef.current
        premodalHashRef.current = null
        resetFocusStart()
        if (target) {
            navUpdate({ focusedHash: target })
        } else {
            navRemove('focusedHash')
        }
    }
    const clearModals = () => {
        setModalPayloads([])
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