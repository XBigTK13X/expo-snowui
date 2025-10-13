import React from 'react'
import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import { useInputContext } from '../../context/snow-input-context'
import { useLayerContext } from '../../context/snow-layer-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
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
    let modalView = null
    if (props.wrapper === false) {
        modalView = (
            <View
                navigationBarTranslucent
                statusBarTranslucent
                transparent={props.transparent}
                style={style}
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
            >
                {modalContent}
            </View>
        )
    }
    if (modalView) {
        React.useEffect(() => {
            pushModal(modalView)
            const backListenerKey = addBackListener(() => {
                props.onRequestClose()
                return true
            })
            return () => {
                removeBackListener(backListenerKey)
                popModal()
            }
        }, [])
    }
    return null
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal