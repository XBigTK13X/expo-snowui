import React from 'react'
import {
    View,
    FlatList
} from 'react-native'

import { useStyleContext } from '../context/snow-style-context'
import SnowTextButton from './snow-text-button'
import SnowText from './snow-text'

export function SnowGrid(props) {
    if (!props.items && !props.children) {
        return null
    }
    let items = props.items
    if (!props.items) {
        // Without this, if a ternary `{x?x:null}` nullable component will leave a gap in the grid
        items = React.Children.toArray(props.children)
    }
    items = items.filter(child => child !== null)
    if (!items || !items.length) {
        return null
    }

    const { SnowStyle } = useStyleContext(props)
    const [page, setPage] = React.useState(0)

    let itemsPerRow = 5
    if (props.itemsPerRow) {
        itemsPerRow = props.itemsPerRow
    }

    let itemsPerPage = 25
    if (props.itemsPerPage) {
        itemsPerPage = props.itemsPerPage
    }

    const maxPage = Math.ceil(items.length / itemsPerPage)

    let itemStyle = [
        { flexBasis: `${100 / itemsPerRow}%` }
    ]
    let gridStyle = []
    if (props.gridStyle) {
        gridStyle.push(props.gridStyle)
    }

    if (props.short) {
        gridStyle.push(SnowStyle.component.grid.short)
    }

    let renderItem = (item, itemIndex) => {
        return item
    }
    if (props.renderItem) {
        renderItem = props.renderItem
    }
    let columnStyle = null
    if (itemsPerRow > 1) {
        // If you try to style the column when 1 item per row, flat list throws an error
        columnStyle = SnowStyle.component.grid.list
    }

    const hasPageControls = items.length > itemsPerPage
    const maxColumn = Math.min(items.length, itemsPerRow)
    let maxRow = Math.max(1, Math.ceil((hasPageControls ? itemsPerPage : items.length) / itemsPerRow))
    let lastElementColumn = (hasPageControls ? itemsPerPage : items.length) % itemsPerRow
    if (lastElementColumn === 0) {
        lastElementColumn = itemsPerRow
    }
    let pageControls = () => { return null }
    let firstCellKey = `${props.focusKey}-row-0-column-0`
    let lastCellKey = `${props.focusKey}-row-${maxRow - 1}-column-${lastElementColumn - 1}`
    if (hasPageControls) {
        const firstPage = () => {
            setPage(0)
        }
        const lastPage = () => {
            setPage(maxPage - 1)
        }
        const previousPage = () => {
            setPage((prev) => {
                if (prev > 0) {
                    return prev - 1
                }
                return maxPage - 1
            })
        }
        const nextPage = () => {
            setPage((prev) => {
                if (prev < maxPage - 1) {
                    return prev + 1
                }
                return 0
            })
        }
        const previousHalf = () => {
            setPage((prev) => {
                return Math.floor(prev / 2)
            })
        }
        const nextHalf = () => {
            setPage((prev) => {
                return Math.floor((prev + maxPage) / 2)
            })
        }
        pageControls = (loc) => {
            let nextPageKey = props.focusKey
            let nextPageFocus = {}
            nextPageFocus.focusDown = firstCellKey
            if (loc === 'bottom') {
                nextPageKey = 'next-page-bottom'
                if (props.focusDown) {
                    nextPageFocus.focusDown = props.focusDown
                } else {
                    nextPageFocus.focusDown = 'previous-page-bottom'
                }
                nextPageFocus.focusUp = lastCellKey
            } else {
                if (props.focusUp) {
                    nextPageFocus.focusUp = props.focusUp
                }
            }
            return (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <SnowTextButton
                        focusKey={`first-page-${loc}`}
                        focusLeft={`last-page-${loc}`}
                        focusRight={`previous-half-${loc}`}
                        focusUp={nextPageKey}
                        focusDown={nextPageKey}
                        title="<<<"
                        onPress={firstPage}
                    />

                    <SnowTextButton
                        focusKey={`previous-half-${loc}`}
                        focusLeft={`first-page-${loc}`}
                        focusRight={`previous-page-${loc}`}
                        focusUp={nextPageKey}
                        focusDown={nextPageKey}
                        title="<<"
                        onPress={previousHalf}
                    />

                    <SnowTextButton
                        focusKey={`previous-page-${loc}`}
                        focusLeft={`previous-half-${loc}`}
                        focusRight={nextPageKey}
                        focusUp={nextPageKey}
                        focusDown={nextPageKey}
                        title="<"
                        onPress={previousPage}
                    />

                    <SnowText noSelect>{page + 1} / {maxPage}</SnowText>

                    <SnowTextButton
                        {...nextPageFocus}
                        focusKey={nextPageKey}
                        focusLeft={`previous-page-${loc}`}
                        focusRight={`next-half-${loc}`}
                        title=">"
                        onPress={nextPage}
                    />

                    <SnowTextButton
                        focusKey={`next-half-${loc}`}
                        focusLeft={nextPageKey}
                        focusRight={`last-page-${loc}`}
                        focusUp={nextPageKey}
                        focusDown={nextPageKey}
                        title=">>"
                        onPress={nextHalf}
                    />

                    <SnowTextButton
                        focusKey={`last-page-${loc}`}
                        focusLeft={`next-half-${loc}`}
                        focusRight={`first-page-${loc}`}
                        focusUp={nextPageKey}
                        focusDown={nextPageKey}
                        title=">>>"
                        onPress={lastPage}
                    />
                </View>
            )
        }
        items = items.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage)
    }

    return (
        < View style={gridStyle} >
            {pageControls('top')}
            <FlatList
                scrollEnabled={props.scroll === true}
                disableVirtualization={true}
                initialNumToRender={itemsPerPage}
                numColumns={itemsPerRow}
                contentContainerStyle={SnowStyle.component.grid.list}
                columnWrapperStyle={columnStyle}
                data={items}
                renderItem={({ item, index, separators }) => {
                    let child = renderItem(item, index)
                    let row = Math.floor(index / itemsPerRow)
                    let column = index % itemsPerRow
                    let focus = {}

                    if (child.props.focusKey) {
                        focus.focusKey = child.props.focusKey
                    }
                    else {
                        if (index === 0 && !hasPageControls) {
                            focus.focusKey = props.focusKey
                        }
                        else {
                            focus.focusKey = `${props.focusKey}-row-${row}-column-${column}`
                        }
                    }
                    if (child.props.focusStart) {
                        focus.focusStart = child.props.focusStart
                    } else {
                        if (index === 0 && props.focusStart) {
                            focus.focusStart = true
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
                        if (hasPageControls) {
                            focus.focusDown = 'next-page-bottom'
                        } else {
                            if (props.focusDown) {
                                focus.focusDown = props.focusDown
                            }
                        }

                    } else {
                        if (row === maxRow - 2 && column >= lastElementColumn) {
                            focus.focusDown = `${props.focusKey}-row-${row + 1}-column-${lastElementColumn - 1}`
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
                    }

                    child = React.cloneElement(child, { ...focus, maxRow, maxColumn, lastElementColumn })
                    return (
                        <View style={itemStyle}>
                            {child}
                        </View>
                    )
                }}
            />
            {pageControls('bottom')}
        </View >
    )
}

export default SnowGrid
