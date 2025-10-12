import React from 'react'
import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useLayerContext } from '../../context/snow-layer-context'

import SnowFillView from '../snow-fill-view'
import SnowText from '../snow-text'

const SnowModalW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { pushFocusLayer, popFocusLayer } = useFocusContext(props)
    const { pushModal, popModal } = useLayerContext(props)

    if (props.assignFocus !== false) {
        if (!props.focusLayer) {
            return <SnowText>SnowModal requires a focusLayer prop</SnowText>
        }
        else {
            React.useEffect(() => {
                pushFocusLayer(`snow-modal-${props.focusLayer}`, true)
                return () => {
                    popFocusLayer()
                }
            }, [])
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
    let modalView = null
    if (props.wrapper === false) {
        modalView = (
            <View
                navigationBarTranslucent
                statusBarTranslucent
                transparent={props.transparent}
                style={style}
                onRequestClose={props.onRequestClose}
                children={props.children} />
        )
    } else {
        let modalStyle = [
            SnowStyle.component.modal.default,
            SnowStyle.component.modal.prompt
        ]
        if (props.modalStyle) {
            modalStyle.push(props.modalStyle)
        }

        let modalContent = (
            <SnowFillView
                scroll={props.scroll}
                children={props.children}
                style={style} />
        )

        modalView = (
            <View
                style={modalStyle}
                navigationBarTranslucent
                statusBarTranslucent
                transparent={props.transparent}
                onRequestClose={props.onRequestClose}>
                {modalContent}
            </View>
        )
    }
    if (modalView) {
        React.useEffect(() => {
            pushModal(modalView)
            return () => {
                popModal()
            }
        }, [])
    }
    return null
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal