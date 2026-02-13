import React from 'react'
import {
    View
} from 'react-native'

import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import SnowPager from './snow-pager'

// The grid may contain items that aren't wired for focus
// This tracks only wired items, so that focus hints between them
// Can be more easily management
const emptyWiredGrid = () => {
    return {
        row: 0,
        column: 0,
        index: 0,
        lastGridRow: 0
    }
}

const SnowGridW = (props) => {
    if (!props.items && !props.children) {
        return null
    }
    let items = props.items
    if (!props.items) {
        // Without this, if a ternary `{x?x:null}` nullable component will leave a gap in the grid
        items = React.Children.toArray(props.children)
    }
    items = items?.filter(child => child !== null)
    if (!items || !items.length) {
        return null
    }

    const { SnowStyle } = useStyleContext(props)
    const { currentRoute } = useNavigationContext(props)
    const { DEBUG_FOCUS } = useFocusContext(props)

    const wiredGridRef = React.useRef(emptyWiredGrid())

    let itemsPerRow = 5
    if (props.itemsPerRow) {
        itemsPerRow = props.itemsPerRow
    }

    let itemsPerPage = 25
    if (props.itemsPerPage) {
        itemsPerPage = props.itemsPerPage
    }

    const maxPage = Math.ceil(items.length / itemsPerPage)

    let gridStyle = [SnowStyle.component.grid.grid]
    if (props.gridStyle) {
        gridStyle.push(props.gridStyle)
    }

    if (props.short) {
        gridStyle.push(SnowStyle.component.grid.short)
    }
    let rowStyle = SnowStyle.component.grid.row

    let renderItem = (item) => {
        return item
    }
    if (props.renderItem) {
        renderItem = props.renderItem
    }

    let page = 0
    if (currentRoute?.routeParams?.gridPage !== undefined) {
        page = parseInt(currentRoute?.routeParams?.gridPage, 10)
    }
    const hasPageControls = items.length > itemsPerPage
    if (hasPageControls) {
        items = items.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
    }
    const maxColumn = Math.min(items.length, itemsPerRow)
    let maxRow = Math.max(1, Math.ceil(items.length / itemsPerRow))
    let lastElementColumn = items.length % itemsPerRow
    if (lastElementColumn === 0) {
        lastElementColumn = itemsPerRow
    }

    let gridFocusKey = `${props.focusKey}-row-0-column-0`
    let lastCellKey = `${props.focusKey}-grid-end`
    let lastCellFullKey = `${props.focusKey}-row-${maxRow - 1}-column-${lastElementColumn - 1}`

    let pageControls = null
    if (hasPageControls) {
        pageControls = (
            <SnowPager
                maxPage={maxPage}
                page={page}
                focusDown={gridFocusKey}
                focusKey={props.focusKey}
            />
        )
    }

    wiredGridRef.current = emptyWiredGrid()

    const renderKey = `${props.focusKey ?? ''}-grid-${itemsPerRow}-cols-page-${page}`

    const renderCell = (item, itemIndex, renderRowIndex) => {
        let child = renderItem(item, itemIndex)

        if (child?.type?.isSnowFocusWired && props?.assignFocus !== false) {
            let wired = wiredGridRef.current
            let row = wired.row
            let column = wired.column
            let focus = {}
            if (child.props.focusKey) {
                focus.focusKey = child.props.focusKey
            }
            else {
                if (wired.index === 0 && !hasPageControls) {
                    focus.focusKey = props.focusKey
                }
                else {
                    focus.focusKey = `${props.focusKey}-row-${row}-column-${column}`
                    if (focus.focusKey === lastCellFullKey) {
                        focus.focusKey = lastCellKey
                    }
                }
            }
            // Only allow auto focusing before the pager is used
            if (currentRoute.routeParams.page === undefined) {
                if (child.props.focusStart) {
                    focus.focusStart = child.props.focusStart
                } else {
                    if (wired.index === 0 && props.focusStart) {
                        focus.focusStart = true
                    }
                }
            }

            if (row === 0) {
                if (hasPageControls) {
                    focus.focusUp = props.focusKey
                }
                else {
                    if (props.focusUp) {
                        focus.focusUp = props.focusUp
                    }
                }
            } else {
                if (row - 1 === 0 && column === 0 && !hasPageControls) {
                    focus.focusUp = props.focusKey
                } else {
                    focus.focusUp = `${props.focusKey}-row-${row - 1}-column-${column}`
                }
            }

            if (row === maxRow - 1) {
                if (props.focusDown) {
                    focus.focusDown = props.focusDown
                }

            } else {
                if (row === maxRow - 2 && column >= lastElementColumn - 1) {
                    focus.focusDown = lastCellKey
                } else {
                    focus.focusDown = `${props.focusKey}-row-${row + 1}-column-${column}`
                }
            }

            if (column === 0) {
                if (props.focusLeft) {
                    focus.focusLeft = props.focusLeft
                }
            } else {
                if (column - 1 === 0 && row === 0) {
                    focus.focusLeft = props.focusKey
                } else {
                    focus.focusLeft = `${props.focusKey}-row-${row}-column-${column - 1}`
                }
            }

            if (column === maxColumn - 1) {
                if (props.focusRight) {
                    focus.focusRight = props.focusRight
                }
            } else {
                focus.focusRight = `${props.focusKey}-row-${row}-column-${column + 1}`
                if (row >= maxRow - 1 && column + 1 >= lastElementColumn - 1) {
                    focus.focusRight = lastCellKey
                }
            }
            let debugFocus = {}
            if (DEBUG_FOCUS) {
                debugFocus = {
                    maxRow,
                    maxColumn,
                    lastElementColumn,
                    row,
                    column,
                    lastCellKey,
                    lastCellFullKey
                }
            }
            row = Math.floor((itemIndex + 1) / itemsPerRow)
            if (row > wired.lastGridRow) {
                wired.row += 1
                wired.column = 0
                wired.lastGridRow = row
            }
            else {
                wired.column += 1
            }
            wired.index += 1
            wiredGridRef.current = wired
            child = React.cloneElement(child, { ...focus, ...debugFocus })
        }

        return (
            <View key={`cell-${itemIndex}-${renderRowIndex}`}>
                {child}
            </View>
        )
    }

    let rows = null
    let row = null
    if (items.length) {
        rows = []
        row = []
        for (let ii = 0; ii < items.length; ii++) {
            row.push(renderCell(items[ii], ii, rows.length))
            if (row.length >= itemsPerRow) {
                rows.push(row)
                row = []
            }
        }
        if (row?.length) {
            rows.push(row)
        }
    }


    return (
        <View style={gridStyle} key={renderKey}>
            {pageControls}
            {rows.map((row, rowIndex) => {
                return (
                    <View key={`row-${renderKey}-${rowIndex}`} style={rowStyle}>
                        {row.map(cell => { return cell })}
                    </View>
                )
            })}
        </View >
    )
}

SnowGridW.isSnowFocusWired = true

export const SnowGrid = SnowGridW

export default SnowGrid
