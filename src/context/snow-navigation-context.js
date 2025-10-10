import React from 'react'
import { BackHandler, Platform } from 'react-native'

import { useFocusContext } from './snow-focus-context'

import util, { prettyLog } from '../util'

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

    const [pageLookup, setPageLookup] = React.useState({})
    const [initialPath, setInitialPath] = React.useState(null)

    const [navigationHistory, setNavigationHistory] = React.useState(null)
    const navigationHistoryRef = React.useRef(navigationHistory)
    const [navigationAllowed, setNavigationAllowed] = React.useState(true)
    const navigationAllowedRef = React.useRef(navigationAllowed)

    const { pushFocusLayer, popFocusLayer } = useFocusContext()

    React.useEffect(() => {
        navigationHistoryRef.current = navigationHistory
        if (navigationHistory?.at(-1)?.routePath) {
            pushFocusLayer(pageLookup[navigationHistory?.at(-1).routePath].pathKey)
            return () => {
                popFocusLayer()
            }
        }
    }, [navigationHistory])

    React.useEffect(() => {
        navigationAllowedRef.current = navigationAllowed
    }, [navigationAllowed])

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
                    result.at(-1).params = foundParams
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
                    prettyLog({ action: 'navPush', routePath, routeParams, foundPath, foundParams, foundFunc, isFunc, prev, result })
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
                    prettyLog({ action: 'navPop', prev, result })
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
                prettyLog({ action: 'navReset', prev, result, resetPath, props })
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

    // When a modal is shown, prevent default event handlers from exiting the app
    React.useEffect(() => {
        const onBackPress = () => {
            if (DEBUG) {
                prettyLog({ action: 'navHardwareBackHandler', navigationAllowedRef })
            }
            if (!navigationAllowedRef.current) {
                return true
            }
            if (navigationHistoryRef.current.length > 1) {
                navPop();
                return true;
            }
            return false;
        };

        const backListener = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => {
            backListener.remove()
        }
    }, []);

    if (Platform.isTV) {
        useTVEventHandler(remoteEvent => {
            if (DEBUG) {
                prettyLog({ action: 'navTvRemoteHandler', remoteEvent, navigationAllowedRef })
            }
            if (remoteEvent.eventType === 'menu' || remoteEvent.eventType === 'back') {
                if (!navigationAllowedRef.current) {
                    BackHandler.exitApp = () => {

                    }
                }
            }
        })
    }

    if (Platform.OS === 'web') {
        React.useEffect(() => {
            const onPopState = (evt) => {
                if (DEBUG) {
                    prettyLog({ action: 'navBrowserBackHandler', evt, navigationAllowedRef })
                }
                if (!navigationAllowedRef.current) {
                    return
                }
                if (navigationHistoryRef.current.length > 1) {
                    navPop()
                } else {
                    // This prevents back from leaving the app
                    window.history.pushState(null, '', window.location.pathname + window.location.search)
                }
            }

            window.addEventListener('popstate', onPopState)
            window.history.pushState(null, '', window.location.pathname + window.location.search)

            return () => window.removeEventListener('popstate', onPopState)
        }, [])
    }

    if (!initialPath || !pageLookup || !navigationHistory || !navigationHistory.at(-1).routePath) {
        if (DEBUG) {
            prettyLog({ action: 'NavigationContext->short circuit', initialPath, pageLookup, navigationHistory })
        }
        return <View style={{ flex: 1, backgroundColor: 'black' }} />
    }

    const currentRoute = navigationHistory.at(-1)
    const CurrentPage = pageLookup[currentRoute.routePath].page

    const context = {
        currentRoute,
        CurrentPage,
        navPush,
        navPop,
        navReset,
        navigationHistory,
        setNavigationAllowed
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