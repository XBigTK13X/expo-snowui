import React from 'react';

const InteractionLayerContext = React.createContext({});

export function useInteractionLayerContext() {
    let value = React.useContext(InteractionLayerContext);
    if (!value) {
        throw new Error('useInteractionLayerContext must be wrapped in a <InteractionLayerContextProvider />');
    }
    return value;
}

export function InteractionLayerContextProvider(props) {
    const [modals, setModals] = React.useState([])
    const [overlays, setOverlays] = React.useState([])

    const pushOverlay = (overlay) => {
        setOverlays((prev) => {
            return [...prev, overlay]
        })
    }

    const popOverlay = () => {
        setOverlays((prev) => {
            let result = [...prev]
            if (result.length) {
                result.pop()
            }
            return result
        })
    }

    let currentOverlay = null
    if (overlays.length) {
        currentOverlay = modals.at(-1)
    }


    const clearOverlays = () => {
        setOverlays([])
    }

    const pushModal = (modal) => {
        setModals((prev) => {
            return [...prev, modal]
        })
    }

    const popModal = () => {
        setModals((prev) => {
            let result = [...prev]
            if (result.length) {
                result.pop()
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


    const context = {
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
        <InteractionLayerContext.Provider style={{ flex: 1 }} value={context}>
            {props.children}
        </InteractionLayerContext.Provider>
    )
}

export default InteractionLayerContextProvider