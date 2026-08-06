import React from 'react'
import { useWindowDimensions } from 'react-native'
import _ from 'lodash'
import { createStyle, getWindowHeight, getWindowWidth } from '../snow-style'

const StyleContext = React.createContext({})

export function useStyleContext(componentProps) {
    let value = React.useContext(StyleContext)
    if (!value) {
        throw new Error('useStyleContext must be wrapped in a <StyleContextProvider />')
    }
    if (componentProps?.snowStyle) {
        value = { ...value }
        value.SnowStyle = _.merge({}, value.SnowStyle, componentProps.snowStyle)
    }
    if (componentProps?.snowConfig) {
        value = { ...value }
        value.SnowConfig = _.merge({}, value.SnowConfig, componentProps.snowConfig)
    }
    return value
}

const AppConfig = {
    inputDebounceMilliseconds: 700
}

export function StyleContextProvider(props) {
    const { width, height } = useWindowDimensions()

    const style = React.useMemo(() => {
        return createStyle(props.snowStyle)
    }, [width, height, props.snowStyle])

    let config = AppConfig
    if (props.snowConfig) {
        config = { ...config, ...props.snowConfig }
    }

    const context = React.useMemo(() => ({
        SnowStyle: style,
        SnowConfig: config,
        getWindowHeight,
        getWindowWidth,
    }), [style, config])

    return (
        <StyleContext.Provider value={context}>
            <React.Fragment key={`${width}-${height}`}>
                {props.children}
            </React.Fragment>
        </StyleContext.Provider>
    )
}

export default StyleContextProvider