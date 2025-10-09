export const getCircularReplacer = () => {
    const seen = new WeakSet()
    return (key, value) => {
        if (key.indexOf('__') !== -1 || key === '_viewConfig') {
            // React garbage, discard key
            return '[react node]';
        }
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                // Circular reference found, discard key
                return '[circular reference]';
            }
            seen.add(value);
        }
        return value;
    };
}

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

function stateToUrl(route, state) {
    if (!state || !Object.keys(state).length) {
        return route
    }
    const params = new URLSearchParams(state).toString()
    return `${route}?${params}`
}

function queryToObject(query) {
    if (!query) {
        return {}
    }
    const params = new URLSearchParams(query)
    return Object.fromEntries(params.entries())
}

function toBase64(input) {
    if (typeof input === 'object') {
        return btoa(JSON.stringify(input))
    }
    return btoa(input)
}

function fromBase64(input) {
    let result = atob(input)
    try {
        result = JSON.parse(result)
    } catch (swallow) { }
    return result
}

export default {
    getCircularReplacer,
    prettyLog,
    stringifySafe,
    stateToUrl,
    queryToObject,
    toBase64,
    fromBase64
}