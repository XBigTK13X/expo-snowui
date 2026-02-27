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
    if (!originNode) return null

    let allCandidates = []
    let currentSearchNode = originNode

    while (currentSearchNode.parent) {
        for (const [name, child] of currentSearchNode.parent.children) {
            if (name !== currentSearchNode.segmentName) {
                collectLeafCandidates(child, allCandidates)
            }
        }
        currentSearchNode = currentSearchNode.parent
    }

    const bestNeighbor = getClosestInDirection(originNode, allCandidates, direction)
    return bestNeighbor ? bestNeighbor.path : null
}

function getClosestInDirection(origin, candidates, direction) {
    if (!origin.value) return null

    let bestCandidate = null
    let minDistance = Infinity

    const ox = origin.value.xx
    const oy = origin.value.yy

    for (const candidate of candidates) {
        if (!candidate.value) continue

        const cx = candidate.value.xx
        const cy = candidate.value.yy

        let isInDirection = false
        let distance = 0

        const offAxisMultiplier = 10

        switch (direction) {
            case 'up':
                if (cy < oy) {
                    isInDirection = true
                    distance = (oy - cy) + (Math.abs(ox - cx) * offAxisMultiplier)
                }
                break
            case 'down':
                if (cy > oy) {
                    isInDirection = true
                    distance = (cy - oy) + (Math.abs(cx - ox) * offAxisMultiplier)
                }
                break
            case 'left':
                if (cx < ox) {
                    isInDirection = true
                    distance = (ox - cx) + (Math.abs(oy - cy) * offAxisMultiplier)
                }
                break
            case 'right':
                if (cx > ox) {
                    isInDirection = true
                    distance = (cx - ox) + (Math.abs(cy - oy) * offAxisMultiplier)
                }
                break
        }

        if (isInDirection && distance < minDistance) {
            minDistance = distance
            bestCandidate = candidate
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