import React from 'react'
import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import { useInputContext } from '../../context/snow-input-context'
import { useLayerContext } from '../../context/snow-layer-context'
import { useStyleContext } from '../../context/snow-style-context'

import SnowFillView from '../snow-fill-view'
import SnowText from '../snow-text'

const SnowModalW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { addBackListener, removeBackListener } = useInputContext()
    const { pushFocusLayer, popFocusLayer } = useFocusContext(props)
    const { pushModal, popModal } = useLayerContext(props)

    if (!props.onRequestClose) {
        return <SnowText>SnowModal requires an onRequestClose prop</SnowText>
    }

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
    let modalContent = null
    if (props.wrapper === false) {
        modalContent = (
            <View
                navigationBarTranslucent
                statusBarTranslucent
                transparent={props.transparent}
                style={style}
            >
                {props.renderer()}
            </View>
        )
    } else {
        let modalStyle = [
            SnowStyle.component.modal.default,
            SnowStyle.component.modal.prompt
        ]
        if (props.modalStyle) {
            modalStyle.push(props.modalStyle)
        }

        modalContent =
            (
                <View
                    style={modalStyle}
                    navigationBarTranslucent
                    statusBarTranslucent
                    transparent={props.transparent}
                >
                    <SnowFillView
                        scroll={props.scroll}
                        style={style}>
                        {props.renderer()}
                    </SnowFillView>
                </View>
            )
    }
    React.useEffect(() => {
        const backListenerKey = addBackListener(() => {
            props.onRequestClose()
            return true
        })
        return () => {
            removeBackListener(backListenerKey)
        }
    }, [])
    return modalContent
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal