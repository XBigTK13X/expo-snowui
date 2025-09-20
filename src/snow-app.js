import { StyleContextProvider } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'

export function SnowApp(props) {
    return (
        <StyleContextProvider snowStyle={props.snowStyle} snowConfig={props.snowConfig}>
            <FocusContextProvider>
                {props.children}
            </FocusContextProvider>
        </StyleContextProvider>
    )
}

export default SnowApp