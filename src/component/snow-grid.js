import React from 'react'
import {
    View,
    FlatList
} from 'react-native'

import { useStyleContext } from '../context/snow-style-context'

import SnowFillView from './snow-fill-view'

export function SnowGrid(props) {

    if (!props.items && !props.children) {
        return null
    }
    const { SnowStyle } = useStyleContext(props)

    let itemStyle = [SnowStyle.component.grid.item]
    let itemsPerRow = 5
    if (props.itemsPerRow) {
        itemsPerRow = props.itemsPerRow
        itemStyle.push({ flexBasis: `${100 / props.itemsPerRow}%` })
    }
    let gridStyle = [SnowStyle.component.grid.grid]
    if (props.gridStyle) {
        gridStyle.push(props.gridStyle)
    }
    if (props.mainGrid) {
        gridStyle.push(SnowStyle.component.grid.main)
    }

    if (props.short) {
        gridStyle.push(SnowStyle.component.grid.short)
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
    let renderItem = (item, itemIndex) => {
        return item
    }
    if (props.renderItem) {
        renderItem = props.renderItem
    }
    const GridView = props.shrink ? View : SnowFillView
    return (
        <GridView style={gridStyle}>
            <FlatList
                scrollEnabled={props.scroll === true}
                numColumns={itemsPerRow}
                contentContainerStyle={SnowStyle.component.grid.list}
                columnWrapperStyle={itemsPerRow === 1 ? null : SnowStyle.component.grid.listColumn}
                data={items}
                renderItem={({ item, index, separators }) => {
                    return (
                        <View key={index} style={itemStyle}>
                            {renderItem(item, index)}
                        </View>
                    )
                }}
            />
        </GridView>
    )
}

export default SnowGrid