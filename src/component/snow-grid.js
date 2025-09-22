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

    let shouldFocus = true
    if (props.shouldFocus === false) {
        shouldFocus = false
    }


    const { SnowStyle } = useStyleContext(props)
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
    return (
        <View style={gridStyle}>
            <FlatList
                scrollEnabled={props.scroll === true}
                numColumns={itemsPerRow}
                contentContainerStyle={SnowStyle.component.grid.list}
                columnWrapperStyle={columnStyle}
                data={items}
                renderItem={({ item, index, separators }) => {
                    let child = renderItem(item, index)
                    if (index === 0 && React.isValidElement(child)) {
                        child = React.cloneElement(child, { shouldFocus })
                    }
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