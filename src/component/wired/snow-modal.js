import React from 'react'
import { useFocusContext } from '../../context/snow-focus-context'
import { useInputContext } from '../../context/snow-input-context'
import { useStyleContext } from '../../context/snow-style-context'

import SnowFillView from '../snow-fill-view'
import SnowText from '../snow-text'

export const SnowModal = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { addBackListener, removeBackListener } = useInputContext()
    const { focusPath, focusWrap } = useFocusContext('modal', {
        ...props,
        boundary: true
    })

    if (!props.onRequestClose) {
        return <SnowText>SnowModal requires an onRequestClose prop</SnowText>
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
    return focusWrap(
        <SnowFillView
            scroll={props.scroll}
            style={style}
        >
            {props.render()}
        </SnowFillView>
    )
}

export default SnowModal