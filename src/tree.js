import util from './util'

export class Tree {
    constructor() {
        this.root = {
            children: new Map(),
            parent: null,
            value: null,
            path: '|'
        };
        this.lookup = new Map();
        this.lookup.set('|', this.root);
        this.delimiter = '|';
    }

    insert(path, value = null) {
        const segments = path.split(this.delimiter).filter((ss) => ss.length > 0);
        let currentNode = this.root;
        let currentPath = '';

        for (const segment of segments) {
            currentPath += (currentPath === '' ? '' : this.delimiter) + segment;

            if (!currentNode.children.has(segment)) {
                const newNode = {
                    children: new Map(),
                    parent: currentNode,
                    value: null,
                    path: currentPath,
                    segmentName: segment
                };

                currentNode.children.set(segment, newNode);
                this.lookup.set(currentPath, newNode);
            }
            currentNode = currentNode.children.get(segment);
        }

        currentNode.value = value;
        return currentNode;
    }

    find(path) {
        return this.lookup.get(path) || null;
    }

    prune(path) {
        const targetNode = this.find(path);
        if (!targetNode || !targetNode.parent) return;

        const removeFromLookup = (node) => {
            for (const childNode of node.children.values()) {
                removeFromLookup(childNode);
            }
            this.lookup.delete(node.path);
        };

        removeFromLookup(targetNode);

        targetNode.parent.children.delete(targetNode.segmentName);
    }

    getSiblings(path) {
        const node = this.find(path);
        if (!node || !node.parent) return [];

        const siblings = [];
        for (const [name, child] of node.parent.children) {
            if (name !== node.segmentName) {
                siblings.push(child);
            }
        }
        return siblings;
    }

    debug(node = this.root, indent = 0) {
        const space = '\t'.repeat(indent);
        const valueInfo = node.value ? ` [Value: ${util.stringifySafe(node.value)}]` : '';

        if (node == this.root) {
            console.log("Showing debug info for tree")
        }

        console.log(`${space}└─ ${node.segmentName}${valueInfo}`);

        for (const childNode of node.children.values()) {
            this.debug(childNode, indent + 1);
        }
    }
}

export default Tree