import React, { createContext, useContext, useMemo, useCallback, useRef } from 'react';
import { UIManager, findNodeHandle, Platform } from 'react-native';

const SnowFocusContext = createContext(null);

/**
Hierarchical spatial focus management\

Uses a single App-level provider to manage a global registry of components
Focus is represented as a pipe-delimited string of segments such as 'root|container:0,0|item:2,5'
Implements a "bubble-up" movement strategy: local coordinate search occurs first;
    If a boundary is hit, the event repeats one level up at the parent
Focus state is stored in the URL to support persistence, rehydration, and back navigation
Supports focus trapping for modals by restricting bubbling to a designated id
*/

export function SnowFocusProvider(props) {
    const registry = useRef(new Map());
    const scrollRef = useRef(null);

    const focusPath = props.valueFromUrl || 'root';
    const pathParts = useMemo(() => focusPath.split('|'), [focusPath]);
    const activeLeafId = useMemo(() => {
        const lastPart = pathParts[pathParts.length - 1];
        return lastPart.split(':')[0];
    }, [pathParts]);

    const [focusRootId, setFocusRootId] = React.useState('root');

    const scrollToElement = useCallback((elementRef) => {
        if (!scrollRef.current || !elementRef.current) return;

        const nodeHandle = findNodeHandle(elementRef.current);
        const scrollHandle = findNodeHandle(scrollRef.current);

        if (nodeHandle && scrollHandle) {
            UIManager.measureLayout(
                nodeHandle,
                scrollHandle,
                () => { },
                (xx, yy, width, height) => {
                    const offset = props.scrollOffset || 100;
                    scrollRef.current.scrollTo({
                        y: Math.max(0, yy - offset),
                        animated: true
                    });
                }
            );
        }
    }, [props.scrollOffset]);

    const register = useCallback((id, parentId, coord, settings) => {
        if (!registry.current.has(parentId)) {
            registry.current.set(parentId, { coords: new Map(), isContainer: true });
        }

        const parentEntry = registry.current.get(parentId);
        if (coord) {
            parentEntry.coords.set(coord, id);
        }

        registry.current.set(id, {
            parentId,
            coords: new Map(),
            isContainer: settings.isContainer,
            onPress: settings.onPress,
            onLongPress: settings.onLongPress,
            ref: settings.ref
        });

        if (id === activeLeafId && settings.ref) {
            scrollToElement(settings.ref);
        }

        return () => {
            const currentParent = registry.current.get(parentId);
            if (currentParent) currentParent.coords.delete(coord);
            registry.current.delete(id);
        };
    }, [activeLeafId, scrollToElement]);

    const dispatchAction = useCallback((actionType) => {
        const entry = registry.current.get(activeLeafId);
        if (entry && entry[actionType]) {
            entry[actionType]();
            return true;
        }
        return false;
    }, [activeLeafId]);

    const move = useCallback((direction) => {
        const rootIndex = pathParts.indexOf(focusRootId);
        const stopAt = rootIndex !== -1 ? rootIndex : 0;

        for (let ii = pathParts.length - 1; ii >= stopAt; ii--) {
            const segment = pathParts[ii];
            const [id, currentCoord] = segment.split(':');
            const entry = registry.current.get(id);

            if (entry && currentCoord) {
                let [xx, yy] = currentCoord.split(',').map(Number);
                if (direction === 'up') yy--;
                if (direction === 'down') yy++;
                if (direction === 'left') xx--;
                if (direction === 'right') xx++;

                const nextCoordKey = `${xx},${yy}`;
                const neighborId = entry.coords.get(nextCoordKey);

                if (neighborId) {
                    const neighborEntry = registry.current.get(neighborId);
                    let newSegment = neighborEntry?.isContainer
                        ? `${neighborId}:0,0`
                        : `${id}:${nextCoordKey}`;

                    const newPath = [...pathParts.slice(0, ii), newSegment].join('|');
                    props.onUrlChange(newPath);

                    if (neighborEntry && !neighborEntry.isContainer && neighborEntry.ref) {
                        scrollToElement(neighborEntry.ref);
                    }
                    return true;
                }
            }
        }
        return false;
    }, [pathParts, focusRootId, props.onUrlChange, scrollToElement]);

    const moveUp = useCallback(() => { move('up') })
    const moveLeft = useCallback(() => { move('left') })
    const moveRight = useCallback(() => { move('right') })
    const moveDown = useCallback(() => { move('down') })

    const contextValue = {
        focusPath,
        activeLeafId,
        register,
        move,
        dispatchAction,
        setFocusRoot: setFocusRootId,
        setScrollRef: (ref) => { scrollRef.current = ref; }
    };

    return (
        <SnowFocusContext.Provider value={contextValue}>
            {props.children}
        </SnowFocusContext.Provider>
    );
}

export function useFocus(id, parentId, focusSettings) {
    const context = useContext(SnowFocusContext);
    if (!context) {
        throw new Error("useFocus must be used within SnowFocusProvider");
    }

    const coordKey = `${focusSettings.xx},${focusSettings.yy}`;

    const isActive = useMemo(() => {
        return context.pathParts.some(part => part.startsWith(`${id}:`) || part === id);
    }, [context.pathParts, id]);

    React.useEffect(() => {
        const unregisterFunc = context.register(
            id,
            parentId,
            coordKey,
            focusSettings.isContainer
        );

        return () => {
            unregisterFunc();
        };
    }, [id, parentId, coordKey, focusSettings.isContainer]);

    return {
        isActive,
        move: context.move
    };
}