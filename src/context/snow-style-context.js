import React from 'react';
import _ from 'lodash'
import { createStyle, getWindowHeight, getWindowWidth } from '../snow-style'

const StyleContext = React.createContext({});

export function useStyleContext(componentProps) {
    let value = React.useContext(StyleContext);
    if (!value) {
        throw new Error('useStyleContext must be wrapped in a <StyleContextProvider />');
    }
    if (componentProps && componentProps.snowStyle) {
        value = { ...value }
        value.SnowStyle = _.merge({}, value.SnowStyle, componentProps.snowStyle)
    }
    if (componentProps && componentProps.snowConfig) {
        value = { ...value }
        value.SnowConfig = _.merge({}, value.SnowConfig, componentProps.snowConfig)
    }
    return value;
}

const AppConfig = {
    inputDebounceMilliseconds: 700
}

export function StyleContextProvider(props) {
    let style = createStyle(props.snowStyle)
    let config = AppConfig
    if (props.snowConfig) {
        config = { ...config, ...props.snowConfig }
    }
    const context = {
        SnowStyle: style,
        SnowConfig: config,
        getWindowHeight,
        getWindowWidth,
    }
    return (
        <StyleContext.Provider value={context}>
            {props.children}
        </StyleContext.Provider>
    )
}

export default StyleContextProvider