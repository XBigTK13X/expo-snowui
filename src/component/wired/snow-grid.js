import React from 'react'
import { View } from 'react-native'

import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useNavigationContext } from '../../context/snow-navigation-context'

import SnowView from './snow-view'
import SnowPager from './snow-pager'


export const SnowGrid = (props) => {
    if (!props.items && !props.children) {
        return null
    }
    let items = props.items
    if (!props.items) {
        items = React.Children.toArray(props.children)
    }
    items = items?.filter(child => child !== null)
    if (!items || !items.length) {
        return null
    }

    const { SnowStyle } = useStyleContext(props)
    const { currentRoute } = useNavigationContext(props)
    const { focusPath, focusWrap } = useFocusContext('grid', { ...props, canFocus: false })

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
    if (currentRoute?.routeParams?.hasOwnProperty(`${props.focusKey}-pager-grid-page`)) {
        page = parseInt(currentRoute?.routeParams?.[`${props.focusKey}-pager-grid-page`], 10) ?? 0
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

    let gridYOffset = 0
    let pageControls = null
    if (hasPageControls) {
        pageControls =
            <SnowPager
                focusKey={props.focusKey + '-pager'}
                maxPage={maxPage}
                page={page}
            />
        gridYOffset = 1
    }


    const renderCell = (item, itemIndex, renderRowIndex) => {
        let child = renderItem(item, itemIndex)

        let row = Math.floor((itemIndex) / itemsPerRow)
        let column = itemIndex % itemsPerRow

        // TODO pass in the focusStart xx and yy
        // To support rehydrating last select element in grid

        if (props?.assignFocus !== false) {
            child = React.cloneElement(child, {
                focusKey: 'cell',
                xx: column,
                yy: gridYOffset + renderRowIndex,
                focusStart: (props.focusStart && column == 0 && row == 0) || child.props?.focusStart
            })
        }

        return (
            <View key={`cell-${row}-${column}`}>
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
        <SnowView parentPath={focusPath} testID={props.testID} style={gridStyle} key={focusPath}>
            {pageControls}
            <SnowView xx={0} yy={gridYOffset}>
                {rows.map((row, rowIndex) => {
                    return (
                        <View key={`row-${focusPath}-${rowIndex}`} style={rowStyle}>
                            {row.map(cell => { return cell })}
                        </View>
                    )
                })}
            </SnowView>
        </SnowView >
    )
}

export default SnowGrid