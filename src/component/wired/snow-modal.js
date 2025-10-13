import React from 'react'
import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import { useInputContext } from '../../context/snow-input-context'
import { useStyleContext } from '../../context/snow-style-context'

import SnowFillView from '../snow-fill-view'
import SnowText from '../snow-text'

const SnowModalW = (props) => {
    console.log({ props })
    const { SnowStyle } = useStyleContext(props)
    const { addBackListener, removeBackListener } = useInputContext()
    const { pushFocusLayer, popFocusLayer } = useFocusContext(props)

    if (!props.onRequestClose) {
        return <SnowText>SnowModal requires an onRequestClose prop</SnowText>
    }

    if (props.assignFocus !== false) {
        if (!props.focusLayer) {
            return <SnowText>SnowModal requires a focusLayer prop</SnowText>
        }
    }

    React.useEffect(() => {
        if (props.assignFocus && props.focusLayer) {
            pushFocusLayer(`snow-modal-${props.focusLayer}`, true)
            return () => {
                popFocusLayer()
            }
        }
    }, [])

    React.useEffect(() => {
        const backListenerKey = addBackListener(() => {
            props.onRequestClose()
            return true
        })
        return () => {
            removeBackListener(backListenerKey)
        }
    }, [])

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
                {props.render()}
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
                        {props.render()}
                    </SnowFillView>
                </View>
            )
    }
    return modalContent
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal