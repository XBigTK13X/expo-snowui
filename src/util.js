import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid'

export const getCircularReplacer = () => {
    const seen = new WeakMap();

    return function replacer(key, value) {
        if (key.indexOf('__') !== -1 || key === '_viewConfig') {
            return '[react node]';
        }

        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[circular reference]';
            }
            seen.set(value, true);
        }

        return value;
    };
};


export const stringifySafe = (input) => {
    return JSON.stringify({ ...input }, getCircularReplacer(), 4)
}

export const prettyLog = (payload) => {
    if (Platform.OS !== 'web') {
        console.log(stringifySafe(payload))
    } else {
        console.log({ ...payload })
    }
}

export function stateToUrl(route, state) {
    if (!state || !Object.keys(state).length) {
        return route
    }
    const params = new URLSearchParams(state).toString()
    return `${route}?${params}`
}

export function queryToObject(query) {
    if (!query) {
        return {}
    }
    const params = new URLSearchParams(query)
    return Object.fromEntries(params.entries())
}

export function toBase64(input) {
    if (typeof input === 'object') {
        return btoa(JSON.stringify(input))
    }
    return btoa(input)
}

export function fromBase64(input) {
    let result = atob(input)
    try {
        result = JSON.parse(result)
    } catch (swallow) { }
    return result
}

export const saveData = (key, value) => {
    return new Promise(resolve => {
        if (Platform.OS === 'web') {
            if (value === null) {
                localStorage.removeItem(key);
                return resolve(true)
            } else {
                localStorage.setItem(key, value);
                return resolve(true)
            }
        } else {
            if (value == null) {
                SecureStore.deleteItemAsync(key);
                return resolve(true)
            } else {
                if (value === false) {
                    value = 'false'
                }
                if (value === true) {
                    value = 'true'
                }
                SecureStore.setItem(key, value);
                return resolve(true)
            }
        }
    })
}

export const loadData = (key) => {
    let value = null
    if (Platform.OS === 'web') {
        value = localStorage.getItem(key)
    } else {
        value = SecureStore.getItem(key)
    }
    if (value === 'true') {
        return true
    }
    if (value === 'false') {
        return false
    }
    return value
}

export const getUuid = () => {
    return uuid.v4()
}

export default {
    getCircularReplacer,
    getUuid,
    prettyLog,
    stringifySafe,
    stateToUrl,
    queryToObject,
    toBase64,
    fromBase64,
    saveData,
    loadData
}