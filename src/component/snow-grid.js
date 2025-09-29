import React from 'react'
import {
    View,
    FlatList
} from 'react-native'

import { useStyleContext } from '../context/snow-style-context'

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

    const [didFocus, setDidFocus] = React.useState(false)

    React.useEffect(() => {
        if (!didFocus && props.shouldFocus) {
            setDidFocus(true)
        }
    })

    let itemsPerRow = 5
    if (props.itemsPerRow) {
        itemsPerRow = props.itemsPerRow
    }

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

    const maxColumn = itemsPerRow
    const maxRow = Math.floor(items.length / itemsPerRow)

    return (
        < View style={gridStyle} >
            <FlatList
                focusable={false}
                scrollEnabled={props.scroll === true}
                numColumns={itemsPerRow}
                contentContainerStyle={SnowStyle.component.grid.list}
                columnWrapperStyle={columnStyle}
                data={items}
                renderItem={({ item, index, separators }) => {
                    let child = renderItem(item, index)
                    let row = Math.floor(index / itemsPerRow)
                    let column = index % itemsPerRow
                    let focus = {}
                    if (index === 0) {
                        focus.focusKey = props.focusKey
                        if (props.focusStart) {
                            focus.focusStart = true
                        }
                    } else {
                        focus.focusKey = `${props.focusKey}-row-${row}-column-${column}`
                    }

                    if (row === 0) {
                        if (props.focusUp) {
                            focus.focusUp = props.focusUp
                        }
                    } else {
                        if (row - 1 === 0 && column === 0) {
                            focus.focusUp = props.focusKey
                        } else {
                            focus.focusUp = `${props.focusKey}-row-${row - 1}-column-${column}`
                        }
                    }

                    if (row === maxRow) {
                        if (props.focusDown) {
                            focus.focusDown = props.focusDown
                        }
                    } else {
                        focus.focusDown = `${props.focusKey}-row-${row + 1}-column-${column}`
                    }

                    if (column === 0) {
                        if (props.focusLeft) {
                            focus.focusLeft = props.focusLeft
                        }
                    } else {
                        if (column - 1 === 0 && row === 0) {
                            focus.focusLeft = `${props.focusKey}`
                        } else {
                            focus.focusLeft = `${props.focusKey}-row-${row}-column-${column - 1}`
                        }

                    }

                    if (column === maxColumn) {
                        if (props.focusRight) {
                            focus.focusRight = props.focusRight
                        }
                    } else {
                        focus.focusRight = `${props.focusKey}-row-${row}-column-${column + 1}`
                    }

                    child = React.cloneElement(child, { ...focus })
                    return (
                        <View style={itemStyle}>
                            {child}
                        </View>
                    )
                }}
            />
        </View >
    )
}

export default SnowGrid
