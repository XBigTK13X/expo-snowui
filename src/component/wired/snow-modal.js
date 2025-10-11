import React from 'react'
import { Modal, View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowFillView from '../snow-fill-view'
import SnowText from '../snow-text'

const SnowModalW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    if (props.assignFocus !== false) {
        if (!props.focusLayer) {
            return <SnowText>SnowModal requires a focusLayer prop</SnowText>
        }
    }

    let style = [SnowStyle.component.modal.prompt]
    if (props.transparent) {
        style.push(SnowStyle.component.modal.transparent)
    }
    if (props.center) {
        style.push(SnowStyle.component.modal.center)
    }
    if (props.contentStyle) {
        style.push(props.contentStyle)
    }
    if (props.wrapper === false) {
        return (
            <Modal
                navigationBarTranslucent
                statusBarTranslucent
                transparent={props.transparent}
                style={style}
                onRequestClose={props.onRequestClose}
                children={props.children} />
        )
    }
    let modalStyle = [SnowStyle.component.modal.prompt]
    if (props.modalStyle) {
        modalStyle.push(props.modalStyle)
    }

    let modalContent = (
        <SnowFillView
            scroll={props.scroll}
            children={props.children}
            style={style} />
    )

    if (props.assignFocus !== false) {
        const { pushFocusLayer, popFocusLayer, isFocusedLayer, focusedLayer } = useFocusContext()
        let focusLayer = `snow-modal-${props.focusLayer}`
        React.useEffect(() => {

            pushFocusLayer(focusLayer, true);
            return () => {
                popFocusLayer();
            }
        }, [props.focusLayer, pushFocusLayer, popFocusLayer]);

        if (!isFocusedLayer(focusLayer)) {
            console.log({ focusedLayer, focusLayer })
            modalContent = <SnowText>Waiting for focus...</SnowText>
        }
    }

    return <Modal
        style={modalStyle}
        navigationBarTranslucent
        statusBarTranslucent
        transparent={props.transparent}
        onRequestClose={props.onRequestClose}>
        {modalContent}
    </Modal>
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal