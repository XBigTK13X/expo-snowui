import React, { createContext, useContext, useCallback, useRef, useMemo, useEffect } from 'react'
import { findNodeHandle, UIManager } from 'react-native'

import { useNavigationContext } from './snow-navigation-context'

const FocusContext = createContext(null)

export const useFocusContext = (id, options = {}) => {
    const { register, unregister, activeId } = useContext(FocusContext)
    const elementRef = useRef(null)

    const {
        parentId = null,
        parentScrollRef = null,
        locked = false,
        focusPosition,
        fp,
        onPress,
        onLongPress
    } = options

    const pos = useMemo(() => fp || focusPosition || { xx: 0, yy: 0 }, [fp, focusPosition])

    useEffect(() => {
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

export const FocusContextProvider = (props) => {
    const FOCUS_ENABLED = props.FOCUS_ENABLED !== false
    const registry = useRef(new Map())
    const adjacencyMap = useRef(new Map())

    const { currentRoute, navPush } = useNavigationContext()
    const activeId = currentRoute?.routeParams?.focusedId

    const rebuildAdjacencyTable = useCallback(() => {
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

    const scrollIntoView = useCallback((nodeId) => {
        const node = registry.current.get(nodeId)
        if (node?.ref.current && node.parentScrollRef?.current) {
            const nodeTag = findNodeHandle(node.ref.current)
            const scrollTag = findNodeHandle(node.parentScrollRef.current)
            UIManager.measureLayout(nodeTag, scrollTag, () => { }, (xx, yy) => {
                node.parentScrollRef.current.scrollTo({ y: yy, animated: true })
            })
        }
    }, [])

    const updateFocus = useCallback((nextId) => {
        if (nextId && registry.current.has(nextId)) {
            navPush({ ...currentRoute.routeParams, focusedId: nextId })
            scrollIntoView(nextId)
        }
    }, [currentRoute, navPush, scrollIntoView])

    const moveFocus = useCallback((direction) => {
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

    const interact = useCallback((action, id) => {
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

    const value = useMemo(() => ({
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