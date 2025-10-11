import { Modal } from 'react-native'
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
        const { useFocusLayer, isFocusedLayer, focusedLayer } = useFocusContext()
        useFocusLayer(props.focusLayer, true)
        console.log()
        if (!isFocusedLayer(props.focusLayer)) {
            console.log({ focusedLayer, focus: props.focusLayer })
            return null
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
        modalStyle.push(modalStyle)
    }
    return <Modal
        style={modalStyle}
        navigationBarTranslucent
        statusBarTranslucent
        transparent={props.transparent}
        onRequestClose={props.onRequestClose}>
        <SnowFillView
            scroll={props.scroll}
            children={props.children}
            style={style} />
    </Modal>
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal