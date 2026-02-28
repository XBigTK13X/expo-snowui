import util from '../util'

export const DELIM = '__'

export class Tree {
    constructor() {
        this.root = {
            children: new Map(),
            parent: null,
            value: null,
            segmentName: 'root',
            path: DELIM
        }
        this.lookup = new Map()
        this.lookup.set(DELIM, this.root)
        this.delimiter = DELIM
    }

    getFocusPaths() {
        return this.lookup.keys()
    }

    insert(path, value = null) {
        return new Promise((resolve) => {
            const segments = path.split(this.delimiter).filter((ss) => ss.length > 0)
            let currentNode = this.root
            let currentPath = ''

            for (const segment of segments) {
                currentPath += (currentPath === '' ? '' : this.delimiter) + segment

                if (!currentNode.children.has(segment)) {
                    const newNode = {
                        children: new Map(),
                        parent: currentNode,
                        value: null,
                        path: currentPath,
                        segmentName: segment
                    }

                    currentNode.children.set(segment, newNode)
                    this.lookup.set(currentPath, newNode)
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
                this.lookup.delete(node.path)
            }

            removeFromLookup(targetNode)

            targetNode.parent.children.delete(targetNode.segmentName)

            return resolve(true)
        })
    }

    find(path) {
        return this.lookup.get(path) || null
    }

    getSiblings(path) {
        const node = this.find(path)
        if (!node || !node.parent) return []

        const siblings = []
        for (const [name, child] of node.parent.children) {
            if (name !== node.segmentName) {
                siblings.push(child)
            }
        }
        return siblings
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
        console.log(entry)

        for (const childNode of node.children.values()) {
            this.debug(childNode, indent + 1)
        }
    }
}

export default {
    Tree,
    DELIM
}