import { Modal } from 'react-native'
import SnowFillView from './snow-fill-view'
import { useStyleContext } from '../context/snow-style-context'

export function SnowModal(props) {
    const { SnowStyle } = useStyleContext(props)

    console.log({ SnowStyle })

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

export default SnowModal