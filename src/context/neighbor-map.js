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

    let currentSearchNode = originNode

    while (currentSearchNode.parent) {
        const siblings = []
        for (const [name, child] of currentSearchNode.parent.children) {
            if (name !== currentSearchNode.segmentName && child.value) {
                siblings.push(child)
            }
        }

        const bestNeighbor = getClosestInDirection(originNode, siblings, direction)

        if (bestNeighbor) {
            return bestNeighbor.path
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
        const cx = candidate.value.xx
        const cy = candidate.value.yy

        let isInDirection = false
        let distance = 0

        switch (direction) {
            case 'up':
                if (cy < oy) {
                    isInDirection = true
                    distance = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2)
                }
                break
            case 'down':
                if (cy > oy) {
                    isInDirection = true
                    distance = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2)
                }
                break
            case 'left':
                if (cx < ox) {
                    isInDirection = true
                    distance = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2)
                }
                break
            case 'right':
                if (cx > ox) {
                    isInDirection = true
                    distance = Math.sqrt((cx - ox) ** 2 + (cy - oy) ** 2)
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

export default { build }