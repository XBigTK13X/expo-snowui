import { InputContextProvider } from './context/snow-input-context'
import { StyleContextProvider } from './context/snow-style-context'
import { FocusContextProvider } from './context/snow-focus-context'
import { NavigationContextProvider } from './context/snow-navigation-context'
import { LayerContextProvider } from './context/snow-layer-context'
import { SnowContextProvider } from './context/snow-context'

import { SnowSafeArea } from './component/snow-safe-area'

export function SnowApp(props) {
    return (
        <StyleContextProvider
            snowStyle={props.snowStyle}
            snowConfig={props.snowConfig} >

            <InputContextProvider
                DEBUG_INPUT={props?.DEBUG_INPUT ?? props?.DEBUG_SNOW} >

                <LayerContextProvider
                    DEBUG_LAYERS={props?.DEBUG_LAYERS ?? props?.DEBUG_SNOW}>

                    <FocusContextProvider
                        DEBUG_FOCUS={props?.DEBUG_FOCUS ?? props?.DEBUG_SNOW}
                        focusVerticalOffset={props.focusVerticalOffset}
                    >

                        <NavigationContextProvider
                            routePaths={props.routePaths}
                            routePages={props.routePages}
                            initialRoutePath={props.initialRoutePath}
                            resetRoutePath={props.resetRoutePath}
                            DEBUG_NAVIGATION={props?.DEBUG_NAVIGATION ?? props?.DEBUG_SNOW} >



                            <SnowContextProvider >
                                <SnowSafeArea >
                                    {props.children}
                                </SnowSafeArea>
                            </SnowContextProvider>


                        </NavigationContextProvider>
                    </FocusContextProvider>
                </LayerContextProvider>
            </InputContextProvider>
        </StyleContextProvider >
    )
}

export default SnowApp