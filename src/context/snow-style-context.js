import React from 'react';
import Style from '../snow-style'

const StyleContext = React.createContext({});

export function useStyleContext(componentProps) {
    const value = React.useContext(StyleContext);
    if (!value) {
        throw new Error('useStyleContext must be wrapped in a <StyleContextProvider />');
    }
    if (componentProps.snowStyle) {
        value.SnowStyle = { ...value.SnowStyle, ...componentProps.snowStyle }
    }
    if (componentProps.snowConfig) {
        value.SnowConfig = { ...value.SnowConfig, ...componentProps.snowConfig }
    }
    return value;
}

const AppConfig = {
    inputDebounceMilliseconds: 700
}

export function StyleContextProvider(props) {
    let style = Style
    if (props.snowStyle) {
        style = { ...style, ...props.snowStyle }
    }
    let config = AppConfig
    if (props.snowConfig) {
        config = { ...config, ...props.snowConfig }
    }
    const context = {
        SnowStyle: style,
        SnowConfig: config
    }
    return (
        <StyleContext.Provider value={context}>
            {props.children}
        </StyleContext.Provider>
    )
}

export default StyleContextProvider