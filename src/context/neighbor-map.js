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
            const entryLeaf = findEntryNodeInBranch(sibling, direction, originNode.value.xx, originNode.value.yy)
            if (entryLeaf) {
                return entryLeaf.path
            }
        }

        currentSearchNode = currentSearchNode.parent
    }

    if (direction === 'left' || direction === 'right') {
        return findRowLoopNeighbor(originNode, direction)
    }

    return null
}

function findRowLoopNeighbor(originNode, direction) {
    if (!originNode.parent) return null

    const originY = originNode.value.yy

    const rowSiblings = Array.from(originNode.parent.children.values())
        .filter(node => node.value && node.value.yy === originY)

    if (rowSiblings.length <= 1) return null

    const sortedRow = rowSiblings.slice().sort((aa, bb) => aa.value.xx - bb.value.xx)
    const targetNode = direction === 'right' ? sortedRow[0] : sortedRow[sortedRow.length - 1]

    if (targetNode === originNode) return null

    if (targetNode.value?.canFocus) {
        return targetNode.path
    }

    const entryLeaf = findEntryNodeInBranch(targetNode, direction, originNode.value.xx, originNode.value.yy)
    return entryLeaf ? entryLeaf.path : null
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
            const ax = aa.value.xx
            const ay = aa.value.yy
            const bx = bb.value.xx
            const by = bb.value.yy

            if (direction === 'up' || direction === 'down') {
                const rowDistA = Math.abs(ay - oy)
                const rowDistB = Math.abs(by - oy)
                if (rowDistA !== rowDistB) {
                    return rowDistA - rowDistB
                }
                return Math.abs(ax - ox) - Math.abs(bx - ox)
            } else {
                const colDistA = Math.abs(ax - ox)
                const colDistB = Math.abs(bx - ox)
                if (colDistA !== colDistB) {
                    return colDistA - colDistB
                }
                return Math.abs(ay - oy) - Math.abs(by - oy)
            }
        })
}

function findEntryNodeInBranch(parentNode, direction, targetX, targetY) {
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
        if (direction === 'up' || direction === 'down') {
            const preferredX = targetX ?? 0
            return Math.abs(aa.value.xx - preferredX) - Math.abs(bb.value.xx - preferredX)
        } else {
            const preferredY = targetY ?? 0
            return Math.abs(aa.value.yy - preferredY) - Math.abs(bb.value.yy - preferredY)
        }
    })

    for (const node of edgeNodes) {
        if (node.value?.canFocus) return node
        const deeper = findEntryNodeInBranch(node, direction, targetX, targetY)
        if (deeper) return deeper
    }

    return null
}

export default { build }