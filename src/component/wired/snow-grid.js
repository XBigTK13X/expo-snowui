import React from 'react'

import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useNavigationContext } from '../../context/snow-navigation-context'

import SnowView from './snow-view'
import SnowPager from './snow-pager'


export const SnowGrid = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { currentRoute } = useNavigationContext(props)
    const { focusPath } = useFocusContext('grid', { ...props, canFocus: false })

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

    let itemsPerRow = 5
    if (SnowStyle.isPortrait) {
        itemsPerRow = 2
    }
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
    let rowStyle = [SnowStyle.component.grid.row]
    if (props.leftAlignRows) {
        rowStyle.push({ justifyContent: 'flex-start' })
    }

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

    let gridYOffset = 0
    let topPager = null
    let bottomPager = null
    if (hasPageControls) {
        topPager = (
            <SnowPager
                focusKey={props.focusKey + '-pager'}
                maxPage={maxPage}
                page={page}
            />
        )
        bottomPager = (
            <SnowPager
                focusKey={props.focusKey + '-pager'}
                maxPage={maxPage}
                page={page}
            />
        )
        gridYOffset = 1
    }

    const renderCell = (item, itemIndex) => {
        let child = renderItem(item, itemIndex)
        let row = Math.floor(itemIndex / itemsPerRow)
        let column = itemIndex % itemsPerRow

        if (props?.assignFocus !== false) {
            child = React.cloneElement(child, {
                focusKey: child.props?.focusKey ?? 'cell',
                xx: column,
                yy: 0,
                focusStart: (props.focusStart && column == 0 && row == 0) || child.props?.focusStart
            })
        }

        return child
    }

    let rows = []
    let row = []
    for (let ii = 0; ii < items.length; ii++) {
        row.push(renderCell(items[ii], ii))
        if (row.length >= itemsPerRow) {
            rows.push(row)
            row = []
        }
    }
    if (row?.length) {
        rows.push(row)
    }

    return (
        <SnowView parentPath={focusPath} testID={props.testID} style={gridStyle} key={focusPath}>
            {topPager}
            <SnowView xx={0} yy={gridYOffset}>
                {rows.map((rowItems, rowIndex) => {
                    return (
                        <SnowView
                            key={`row-${focusPath}-${rowIndex}`}
                            focusKey={`row-${rowIndex}`}
                            xx={0}
                            yy={rowIndex}
                            focusWrap={true}
                            style={rowStyle}
                        >
                            {rowItems.map(cell => cell)}
                        </SnowView>
                    )
                })}
            </SnowView>
            {bottomPager}
        </SnowView>
    )
}

export default SnowGrid