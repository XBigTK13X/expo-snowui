import React from 'react'
import { FocusContextProvider } from './context/snow-focus-context'
import { GuiContextProvider } from './context/snow-gui-context'

export function SnowUi(props) {
    if (!props.children) {
        return (<React.Text>Children are required to use SnowUI</React.Text>)
    }
    return (
        <FocusContextProvider>
            <GuiContextProvider>
                {props.children}
            </GuiContextProvider>
        </FocusContextProvider>
    )
}