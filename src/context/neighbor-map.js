export const build = (tree) => {
    const neighborMap = new Map()

    for (const focusPath of tree.getPaths()) {
        const directions = new Map([
            ['up', null],
            ['down', null],
            ['left', null],
            ['right', null]
        ])

        for (const direction of directions.keys()) {
            directions.set(direction, findSpatialNeighbor(tree, focusPath, direction))
        }

        neighborMap.set(focusPath, directions)
    }

    return neighborMap
}

function findSpatialNeighbor(tree, startPath, direction) {
    const originNode = tree.find(startPath)
    if (!originNode || !originNode.value) return null

    let currentSearchNode = originNode

    while (currentSearchNode.parent) {
        const siblings = Array.from(currentSearchNode.parent.children.values())
            .filter(node => node !== currentSearchNode)

        const candidates = getSortedCandidates(currentSearchNode, siblings, direction)

        for (const sibling of candidates) {
            if (sibling.value?.canFocus) {
                return sibling.path
            }
            const entryLeaf = findEntryNodeInBranch(sibling, direction)
            if (entryLeaf) {
                return entryLeaf.path
            }
        }

        currentSearchNode = currentSearchNode.parent
    }

    return null
}

function getSortedCandidates(origin, siblings, direction) {
    const ox = origin.value.xx
    const oy = origin.value.yy

    return siblings
        .filter(node => {
            if (!node.value) return false
            const cx = node.value.xx
            const cy = node.value.yy

            switch (direction) {
                case 'up': return cy < oy
                case 'down': return cy > oy
                case 'left': return cx < ox
                case 'right': return cx > ox
                default: return false
            }
        })
        .sort((aa, bb) => {
            const distA = Math.abs(aa.value.xx - ox) + Math.abs(aa.value.yy - oy)
            const distB = Math.abs(bb.value.xx - ox) + Math.abs(bb.value.yy - oy)
            return distA - distB
        })
}

function findEntryNodeInBranch(parentNode, direction) {
    if (!parentNode.children || parentNode.children.size === 0) return null

    const candidates = Array.from(parentNode.children.values())
    let edgeNodes = []
    let minMax = (direction === 'down' || direction === 'right') ? Infinity : -Infinity

    for (const node of candidates) {
        if (!node.value) continue

        const val = (direction === 'up' || direction === 'down')
            ? node.value.yy
            : node.value.xx

        if ((direction === 'down' || direction === 'right') && val < minMax) {
            minMax = val
            edgeNodes = [node]
        } else if ((direction === 'up' || direction === 'left') && val > minMax) {
            minMax = val
            edgeNodes = [node]
        } else if (val === minMax) {
            edgeNodes.push(node)
        }
    }

    edgeNodes.sort((aa, bb) => {
        const valA = (direction === 'up' || direction === 'down') ? aa.value.xx : aa.value.yy
        const valB = (direction === 'up' || direction === 'down') ? bb.value.xx : bb.value.yy
        return valA - valB
    })

    for (const node of edgeNodes) {
        if (node.value?.canFocus) return node
        const deeper = findEntryNodeInBranch(node, direction)
        if (deeper) return deeper
    }

    return null
}

export default { build }