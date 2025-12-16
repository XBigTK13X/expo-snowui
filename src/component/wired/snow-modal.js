import React from 'react'
import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import { useInputContext } from '../../context/snow-input-context'
import { useStyleContext } from '../../context/snow-style-context'

import SnowFillView from '../snow-fill-view'
import SnowText from '../snow-text'

const SnowModalW = (props) => {
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
        if (props.assignFocus !== false && props.focusLayer) {
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

    let style = [SnowStyle.component.modal.default]
    let depth = SnowStyle.depth.modal + props.depth
    style.push({
        elevation: depth,
        zIndex: depth
    })
    if (props.obscure) {
        style.push(SnowStyle.component.modal.obscure)
    }
    else if (props.transparent !== true) {
        style.push(SnowStyle.component.modal.black)
    }

    if (props.center) {
        style.push(SnowStyle.component.modal.center)
    }
    if (props.style) {
        style.push(props.style)
    }
    return (
        <SnowFillView
            scroll={props.scroll}
            style={style}
        >
            {props.render()}
        </SnowFillView>
    )
}

SnowModalW.isSnowFocusWired = true

export const SnowModal = SnowModalW

export default SnowModal