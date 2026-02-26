import React from 'react'
import ReactNative from 'react-native'

import { useNavigationContext } from './snow-navigation-context'

const FocusContext = React.createContext(null)

export const useFocusContext = (componentName, props) => {
    const { FOCUS_ENABLED, register, unregister, focusedPath } = React.useContext(FocusContext)
    const focusRef = React.useRef(null)

    let {
        focusKey,
        xx,
        yy,
        parentPath
    } = props
    let focusPath = `${componentName}-${focusKey}`
    if (parentPath) {
        focusPath = `${parentPath}|${focusKey}`
    }

    let actionPress = props.onPress
    let actionLongPress = props.onLongPresss
    if (FOCUS_ENABLED) {
        actionPress = () => { }
        actionLongPress = () => { }
    }

    React.useEffect(() => {
        register({
            focusPath,
            focusRef,
            xx,
            yy,
            onPress,
            onLongPress
        })
        return () => {
            unregister(focusPath)
        }
    }, [])

    const isFocused = focusedPath == focusPath

    const focusWrap = (props) => {
        /*
        If these are omitted, then TV remote doesn't work on first launch
        This is a low level helper for wired components
        Most things outside snowui will not need it
        */
        let actions = {}
        let tvRemoteProps = {}
        if (ReactNative.Platform.OS.isTV && (onPress || onLongPress)) {
            tvRemoteProps = {
                focusable: isFocused,
                hasTVPreferredFocus: isFocused
            }
        }
        if (actionPress) {
            actions.onPress = actionPress
        }
        if (actionLongPress) {
            actions.onLongPress = actionLongPress
        }
        return React.cloneElement(child, {
            ...tvRemoteProps,
            ...actions,
            ref: focusRef,
            testID: focusPath
        })
    }

    return {
        focusRef,
        focusPath,
        focusWrap,
        isFocused,
    }
}

export const FocusContextProvider = (props) => {
    const FOCUS_ENABLED = props.FOCUS_ENABLED !== false

    const { currentRoute } = useNavigationContext()

    const focusedPath = currentRoute?.routeParams?.focusedPath

    const registry = React.useRef(new Map())

    const addFocus = (payload) => {
        registry.current.set(payload.focusPath, payload)
    }

    const removeFocus = (focusPath) => {
        registry.current.delete(focusPath)
    }

    const value = React.useMemo(() => ({
        addFocus,
        removeFocus,
        focusedPath,
        FOCUS_ENABLED
    }), [focusedPath, moveFocus, interact])

    return <FocusContext.Provider value={value}>{props.children}</FocusContext.Provider>
}

export const useFocusContextWrong = (id, options = {}) => {
    const { register, unregister, activeId } = React.useContext(FocusContext)
    const elementRef = React.useRef(null)

    const {
        parentId = null,
        parentScrollRef = null,
        locked = false,
        focusPosition,
        fp,
        onPress,
        onLongPress
    } = options

    const pos = React.useMemo(() => fp || focusPosition || { xx: 0, yy: 0 }, [fp, focusPosition])

    React.useEffect(() => {
        register(id, {
            id,
            ref: elementRef,
            pos,
            parentId,
            parentScrollRef,
            locked,
            onPress,
            onLongPress
        })

        return () => unregister(id)
    }, [id, parentId, pos.xx, pos.yy, locked, onPress, onLongPress])

    return {
        ref: elementRef,
        isFocused: activeId === id
    }
}

const getDistance = (source, target, direction) => {
    const dx = target.xx - source.xx
    const dy = target.yy - source.yy

    if (direction === 'up' && dy >= 0) return Infinity
    if (direction === 'down' && dy <= 0) return Infinity
    if (direction === 'left' && dx >= 0) return Infinity
    if (direction === 'right' && dx <= 0) return Infinity

    return Math.sqrt(dx * dx + dy * dy)
}

export const FocusContextProviderWrong = (props) => {
    const FOCUS_ENABLED = props.FOCUS_ENABLED !== false
    const registry = React.useRef(new Map())
    const adjacencyMap = React.useRef(new Map())

    const { currentRoute, navPush } = useNavigationContext()
    const activeId = currentRoute?.routeParams?.focusedId

    const rebuildAdjacencyTable = React.useCallback(() => {
        const nodes = Array.from(registry.current.values())
        const newMap = new Map()

        nodes.forEach((node) => {
            const neighbors = { up: null, down: null, left: null, right: null, in: null, out: null }
            const siblings = nodes.filter((nn) => nn.parentId === node.parentId && nn.id !== node.id)
            const childrenNodes = nodes.filter((nn) => nn.parentId === node.id)

            ['up', 'down', 'left', 'right'].forEach((dir) => {
                let bestId = null
                let minDistance = Infinity
                siblings.forEach((sib) => {
                    const dist = getDistance(node.pos, sib.pos, dir)
                    if (dist < minDistance) {
                        minDistance = dist
                        bestId = sib.id
                    }
                })
                neighbors[dir] = bestId
            })

            if (childrenNodes.length > 0) {
                const firstChild = childrenNodes.sort((aa, bb) =>
                    (aa.pos.yy - bb.pos.yy) || (aa.pos.xx - bb.pos.xx)
                )[0]
                neighbors.in = firstChild.id
            }
            neighbors.out = node.parentId
            newMap.set(node.id, neighbors)
        })

        adjacencyMap.current = newMap
    }, [])

    const scrollIntoView = React.useCallback((nodeId) => {
        const node = registry.current.get(nodeId)
        if (node?.ref.current && node.parentScrollRef?.current) {
            const nodeTag = ReactNative.findNodeHandle(node.ref.current)
            const scrollTag = ReactNative.findNodeHandle(node.parentScrollRef.current)
            ReactNative.UIManager.measureLayout(nodeTag, scrollTag, () => { }, (xx, yy) => {
                node.parentScrollRef.current.scrollTo({ y: yy, animated: true })
            })
        }
    }, [])

    const updateFocus = React.useCallback((nextId) => {
        if (nextId && registry.current.has(nextId)) {
            navPush({ ...currentRoute.routeParams, focusedId: nextId })
            scrollIntoView(nextId)
        }
    }, [currentRoute, navPush, scrollIntoView])

    const moveFocus = React.useCallback((direction) => {
        const current = registry.current.get(activeId)
        if (!current || current.locked) return

        const neighbors = adjacencyMap.current.get(activeId)
        if (!neighbors) return

        let nextId = neighbors[direction]

        if (!nextId) {
            if ((direction === 'down' || direction === 'right') && neighbors.in) {
                nextId = neighbors.in
            } else if (neighbors.out) {
                const parent = registry.current.get(neighbors.out)
                if (parent) {
                    updateFocus(parent.id)
                    moveFocus(direction)
                    return
                }
            }
        }

        updateFocus(nextId)
    }, [activeId, updateFocus])

    const interact = React.useCallback((action, id) => {
        return () => {
            if (!id) {
                id = activeId
            } else {
                navPush({ params: { ...currentRoute.routeParams, focusedId: id }, func: false })
            }
            const current = registry.current.get(activeId)
            if (current && current[action]) {
                return current[action]()
            }
            return null
        }
    }, [activeId, FOCUS_ENABLED, currentRoute, navPush])

    const value = React.useMemo(() => ({
        register: (id, data) => {
            registry.current.set(id, data)
            rebuildAdjacencyTable()
        },
        unregister: (id) => {
            registry.current.delete(id)
            rebuildAdjacencyTable()
        },
        activeId,
        moveFocus,
        interact
    }), [activeId, rebuildAdjacencyTable, moveFocus, interact])

    return <FocusContext.Provider value={value}>{props.children}</FocusContext.Provider>
}