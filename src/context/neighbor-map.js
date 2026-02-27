export const build = (tree) => {
    const neighborMap = new Map()

    for (const focusPath of tree.getFocusPaths()) {
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
        const siblings = []
        for (const [name, child] of currentSearchNode.parent.children) {
            if (name !== currentSearchNode.segmentName) {
                siblings.push(child)
            }
        }

        const bestSibling = getClosestInDirection(currentSearchNode, siblings, direction)

        if (bestSibling) {
            if (bestSibling.value && bestSibling.value.canFocus) {
                return bestSibling.path
            }

            const branchCandidates = []
            collectLeafCandidates(bestSibling, branchCandidates)

            if (branchCandidates.length > 0) {
                const entryLeaf = getEntryLeaf(branchCandidates, direction)
                return entryLeaf ? entryLeaf.path : null
            }
        }

        currentSearchNode = currentSearchNode.parent
    }

    return null
}

function getClosestInDirection(origin, candidates, direction) {
    let bestCandidate = null
    let minDistance = Infinity

    const ox = origin.value.xx
    const oy = origin.value.yy

    for (const candidate of candidates) {
        if (!candidate.value) continue

        const cx = candidate.value.xx
        const cy = candidate.value.yy

        let isInDirection = false
        let primaryDiff = 0
        let secondaryDiff = 0

        switch (direction) {
            case 'up':
                if (cy < oy) {
                    isInDirection = true
                    primaryDiff = oy - cy
                    secondaryDiff = Math.abs(ox - cx)
                }
                break
            case 'down':
                if (cy > oy) {
                    isInDirection = true
                    primaryDiff = cy - oy
                    secondaryDiff = Math.abs(ox - cx)
                }
                break
            case 'left':
                if (cx < ox) {
                    isInDirection = true
                    primaryDiff = ox - cx
                    secondaryDiff = Math.abs(oy - cy)
                }
                break
            case 'right':
                if (cx > ox) {
                    isInDirection = true
                    primaryDiff = cx - ox
                    secondaryDiff = Math.abs(oy - cy)
                }
                break
        }

        if (isInDirection) {
            const distance = primaryDiff + (secondaryDiff * 100)
            if (distance < minDistance) {
                minDistance = distance
                bestCandidate = candidate
            }
        }
    }

    return bestCandidate
}

function getEntryLeaf(candidates, direction) {
    let bestCandidate = null
    let minVal = Infinity
    let maxVal = -Infinity

    for (const candidate of candidates) {
        const xx = candidate.value.xx
        const yy = candidate.value.yy

        switch (direction) {
            case 'down':
                if (yy < minVal) {
                    minVal = yy
                    bestCandidate = candidate
                }
                break
            case 'up':
                if (yy > maxVal) {
                    maxVal = yy
                    bestCandidate = candidate
                }
                break
            case 'right':
                if (xx < minVal) {
                    minVal = xx
                    bestCandidate = candidate
                }
                break
            case 'left':
                if (xx > maxVal) {
                    maxVal = xx
                    bestCandidate = candidate
                }
                break
        }
    }
    return bestCandidate
}

function collectLeafCandidates(node, list) {
    if (node.value && node.value.canFocus === true) {
        list.push(node)
    }
    for (const child of node.children.values()) {
        collectLeafCandidates(child, list)
    }
}

export default { build }