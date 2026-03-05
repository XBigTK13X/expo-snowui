export const DELIM = '_'

export const getPathHash = (focusPath) => {
    const offset_basis = 2166136261
    const prime = 16777619

    let hash_value = offset_basis

    for (let ii = 0; ii < focusPath.length; ii++) {
        hash_value ^= focusPath.charCodeAt(ii)
        hash_value = Math.imul(hash_value, prime)
    }

    return (hash_value >>> 0).toString(16)
}

export class Tree {
    constructor() {
        this.root = {
            children: new Map(),
            parent: null,
            value: null,
            segmentName: 'root',
            path: DELIM
        }
        this.pathLookup = new Map()
        this.pathLookup.set(DELIM, this.root)
        this.hashLookup = new Map()
        this.hashLookup.set(getPathHash(DELIM), DELIM)
        this.delimiter = DELIM
    }

    getPaths() {
        return this.pathLookup.keys()
    }

    getHashes() {
        return this.hashLookup.keys()
    }

    insert(path, value = null) {
        return new Promise((resolve) => {
            const segments = path.split(this.delimiter).filter((ss) => ss.length > 0)
            let currentNode = this.root
            let currentPath = ''
            for (const segment of segments) {
                currentPath += (currentPath === '' ? '' : this.delimiter) + segment

                if (!currentNode.children.has(segment)) {
                    const focusHash = getPathHash(currentPath)
                    const newNode = {
                        children: new Map(),
                        parent: currentNode,
                        value: null,
                        path: currentPath,
                        hash: focusHash,
                        segmentName: segment
                    }

                    currentNode.children.set(segment, newNode)
                    this.pathLookup.set(currentPath, newNode)
                    this.hashLookup.set(focusHash, currentPath)
                }
                currentNode = currentNode.children.get(segment)
            }

            currentNode.value = value
            return resolve(currentNode)
        })
    }

    prune(path) {
        return new Promise((resolve) => {
            const targetNode = this.find(path)
            if (!targetNode || !targetNode.parent) return
            const removeFromLookup = (node) => {
                for (const childNode of node.children.values()) {
                    removeFromLookup(childNode)
                }
                this.pathLookup.delete(node.path)
            }
            removeFromLookup(targetNode)
            targetNode.parent.children.delete(targetNode.segmentName)
            return resolve(true)
        })
    }

    pruneHash(pathHash) {
        return prune(this.hashLookup.get(pathHash))
    }

    find(path) {
        return this.pathLookup.get(path) || null
    }

    findHash(pathHash) {
        return this.find(this.hashLookup.get(pathHash))
    }

    findTopLeft() {
        return new Promise((resolve) => {
            const nodeQueue = [this.root]
            while (nodeQueue.length > 0) {
                const currentNode = nodeQueue.shift()
                if (currentNode?.value?.canFocus) {
                    return resolve(currentNode?.value?.focusPath)
                }
                for (const childNode of currentNode.children.values()) {
                    nodeQueue.push(childNode)
                }
            }
            return resolve(null)
        })
    }

    debug(node = this.root, indent = 0) {
        const space = String(indent).padStart(2, '0') + ' ' + '__'.repeat(indent)
        if (node == this.root) {
            console.log("Showing debug info for tree")
        }
        let entry = `${space} ${node.segmentName}`
        if (node?.value?.canFocus) {
            entry += ' [f]'
        }
        entry += ' - ' + node.hash
        console.log(entry)
        for (const childNode of node.children.values()) {
            this.debug(childNode, indent + 1)
        }
    }
}

export default {
    Tree,
    DELIM,
    getPathHash
}