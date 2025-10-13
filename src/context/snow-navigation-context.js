import React from 'react'
import { Platform, View } from 'react-native'

import { useFocusContext } from './snow-focus-context'
import { useInputContext } from './snow-input-context'
import { useLayerContext } from './snow-layer-context'

import util, { prettyLog } from '../util'

import SnowText from '../component/snow-text'

const NavigationContext = React.createContext({});

export function useNavigationContext() {
    const value = React.useContext(NavigationContext);
    if (!value) {
        throw new Error('useNavigationContext must be wrapped in a <NavigationContextProvider />');
    }
    return value;
}

// A route has three components
// A `path`, the string that will be visisble in a brower as the URL
// A `routeParams`, the object that will be serialized as the query in a browser
// A `page`, the React function that will render an element when the route is active


/*
The idea is that an app will pass in the same
lookup object anything uses to reference other pages in the app.

This cannot be the same as the lookup that references the page components,
or it would create an import cycle
*/

/*
    Relevant props
    initialRoutePath - The path to load when first running the app
    resetRoutePath - The path to load when resetting the navigation context
    routePaths - A map of string IDs to relative paths
    routePages - A map of string IDs to page components
*/
export function NavigationContextProvider(props) {
    const DEBUG = props.DEBUG_NAVIGATION

    const { addBackListener, removeBackListener } = useInputContext()
    const { pushFocusLayer, popFocusLayer, focusedLayer, isFocusedLayer } = useFocusContext()
    const { modalRender } = useLayerContext()

    const modalRenderRef = React.useRef()

    const [isReady, setIsReady] = React.useState(false)

    const [pageLookup, setPageLookup] = React.useState({})
    const [initialPath, setInitialPath] = React.useState(null)

    const [navigationHistory, setNavigationHistory] = React.useState(null)
    const navigationHistoryRef = React.useRef(navigationHistory)

    React.useEffect(() => {
        navigationHistoryRef.current = navigationHistory
        if (navigationHistory?.at(-1)?.routePath) {
            const layerName = pageLookup[navigationHistory?.at(-1).routePath].pathKey
            if (!isFocusedLayer(layerName)) {
                pushFocusLayer(layerName)
                return () => {
                    popFocusLayer()
                }
            }
        }
    }, [navigationHistory])

    React.useEffect(() => {
        modalRenderRef.current = modalRender
    }, [modalRender])

    React.useEffect(() => {
        let lookup = {}
        if (!props.routePaths) {
            console.log(`routePaths is required for SnowNavigationContext`)
        }
        for (let pathKey of Object.keys(props.routePaths)) {
            lookup[props.routePaths[pathKey]] = {
                pathKey
            }
            if (props.routePaths[pathKey] === props.initialRoutePath) {
                lookup['/'] = { pathKey }
            }
        }

        if (!props.routePages) {
            console.log(`routePages is required for SnowNavigationContext`)
        }
        for (let pageKey of Object.keys(props.routePages)) {
            lookup[pageKey].page = props.routePages[pageKey]
            if (pageKey === props.initialRoutePath) {
                lookup['/'].page = props.routePages[pageKey]
            }
        }

        if (!props.initialRoutePath) {
            console.log(`initialRoutePath is required for SnowNavigationContext`)
        }

        let initialRoute = props.initialRoutePath
        let initialParams = {}
        // Handle refreshing the browser
        if (Platform.OS === 'web') {
            initialRoute = window.location.pathname;
            initialParams = util.queryToObject(window.location.search)
        }
        setNavigationHistory([{
            routePath: initialRoute,
            routeParams: initialParams
        }])
        setInitialPath(initialRoute)
        setPageLookup(lookup)
        setIsReady(true)
    }, [props.initialRoutePath, props.routePaths, props.routePages])

    const navPush = (routePath, routeParams, isFunc) => {
        let foundParams = {}
        let foundPath = routePath
        let foundFunc = isFunc
        if (typeof routePath === 'object') {
            foundParams = { ...routePath }
            foundPath = navigationHistoryRef.current.at(-1).routePath
        }
        if (routeParams === true) {
            foundFunc = true
            foundParams = {}
        }
        if (!routeParams) {
            foundParams = {}
        }
        if (typeof routeParams === 'object') {
            foundParams = { ...routeParams }
        }
        const func = () => {
            setNavigationHistory((prev) => {
                let result = [...prev]
                if (result.at(-1).routePath === foundPath) {
                    result.at(-1).routeParams = foundParams
                    if (Platform.OS === 'web') {
                        window.history.replaceState(foundParams, '', util.stateToUrl(foundPath, foundParams))
                    }
                } else {
                    result.push({ routePath: foundPath, routeParams: foundParams })
                    if (Platform.OS === 'web') {
                        window.history.pushState(foundParams, '', util.stateToUrl(foundPath, foundParams))
                    }
                }
                if (DEBUG) {
                    prettyLog({ context: 'navigation', action: 'navPush', routePath, routeParams, foundPath, foundParams, foundFunc, isFunc, prev, result })
                }
                return result
            })
        }
        if (foundFunc) {
            return func
        }
        return func()
    }

    const navPop = (isFunc) => {
        const func = () => {
            setNavigationHistory((prev) => {
                let result = [...prev]
                if (result.length > 1) {
                    result.pop()
                }
                if (DEBUG) {
                    prettyLog({ context: 'navigation', action: 'navPop', prev, result })
                }
                return result
            })
        }
        if (isFunc) {
            return func
        }
        return func()
    }

    const navReset = (isFunc) => {
        const resetPath = props.resetRoutePath ? props.resetRoutePath : props.initialRoutePath
        const func = () => {
            if (DEBUG) {
                prettyLog({ context: 'navigation', action: 'navReset', navigationHistory, resetPath, props })
            }
            setNavigationHistory([{
                routePath: resetPath,
                routeParams: {}
            }])
        }
        if (isFunc) {
            return func
        }
        return func()
    }

    // TODO If navigation blocked, Android back does nothing.
    React.useEffect(() => {
        addBackListener('navigation-context', () => {
            if (DEBUG) {
                prettyLog({ context: 'navigation', action: 'backListener', modal: modalRenderRef.current })
            }
            if (modalRenderRef.current) {
                // When a modal is shown, prevent default event handlers from exiting the app/page
                return true
            }
            if (navigationHistoryRef.current.length > 1) {
                navPop();
                return true;
            }
            return false;
        })
        return () => {
            removeBackListener('navigation-context')
        }
    }, [])

    React.useEffect(() => {
        if (!pageLookup[navigationHistory?.at(-1)?.routePath]?.page) {
            if (DEBUG) {
                prettyLog({ context: 'navigation', action: 'route 404', pageLookup, currentRoute: navigationHistory?.at(-1) })
            }
            navReset()
        }
    }, [pageLookup, navigationHistory])

    if (!isReady) {
        if (DEBUG) {
            prettyLog({ context: 'navigation', action: 'render short circuit', initialPath, pageLookup, navigationHistory, focusedLayer, props })
        }
        return <View style={util.blankStyle} />
    }

    const currentRoute = { ...navigationHistory.at(-1) }
    let CurrentPage = pageLookup[currentRoute?.routePath]?.page

    if (DEBUG === 'verbose') {
        prettyLog({ context: 'navigation', action: 'render', currentRoute, CurrentPage })
    }

    const context = {
        DEBUG_NAVIGATION: DEBUG,
        currentRoute,
        CurrentPage,
        navPush,
        navPop,
        navReset,
        navigationHistory
    }

    return (
        <NavigationContext.Provider
            style={{ flex: 1 }}
            value={context}>
            {props.children}
        </NavigationContext.Provider>
    );
}

export default NavigationContextProvider