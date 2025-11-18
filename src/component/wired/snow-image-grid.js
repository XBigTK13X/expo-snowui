import React from 'react'
import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowLabel from '../snow-label'
import SnowGrid from './snow-grid'
import SnowImageButton from './snow-image-button'

const SnowImageGridW = (props) => {
    if (!props.items || !props.items.length) {
        return null
    }
    const { readFocusProps } = useFocusContext()
    const [toggledItems, setToggledItems] = React.useState({})
    const itemsPerRow = props.itemsPerRow || 5
    const renderItem = (item, itemIndex) => {
        let sourceProps = {}
        if (props.getItemImageUrl) {
            const imageUrl = props.getItemImageUrl(item)
            if (imageUrl) {
                sourceProps.imageUrl = imageUrl
            }
        }
        if (props.getItemImageSource) {
            if (!sourceProps?.imageUrl) {
                const imageSource = props.getItemImageSource(item)
                if (imageSource) {
                    sourceProps.imageSource = imageSource
                }
            }
        }
        if (props.getItemImageFallback) {
            if (!sourceProps?.imageUrl && !sourceProps?.imageSource) {
                sourceProps.imageSource = props.getItemImageFallback(item)
            }
        }
        const itemName = props.getItemName(item)

        let toggled = toggledItems.hasOwnProperty(item.id)

        let isDull = false
        if (!props.disableToggle) {
            if (props.getItemToggleStatus && props.getItemToggleStatus(item)) {
                isDull = true
            }
        }

        return <SnowImageButton
            {...sourceProps}
            snowStyle={props.snowStyle}
            wide={props.wideImage}
            square={props.squareImage}
            dull={isDull}
            onPress={() => { if (props.onPress) { props.onPress(item) } }}
            onLongPress={() => {
                if (props.onLongPress) {
                    props.onLongPress(item)
                }
                if (props.longPressToggle) {
                    setToggledItems((prev) => {
                        let result = { ...prev }
                        if (toggled) {
                            delete result[item.id]
                        }
                        else {
                            result[item.id] = true
                        }

                        return result
                    })
                }
            }}
            title={itemName}
        />
    }
    let gridProps = {}
    if (props.itemsPerRow) {
        gridProps.itemsPerRow = props.itemsPerRow
    }
    if (props.itemsPerPage) {
        gridProps.itemsPerPage = props.itemsPerPage
    }
    return (
        <>
            {props.title ?
                <SnowLabel>
                    {props.title} ({props.items.length})
                </SnowLabel>
                : null}
            <SnowGrid
                {...readFocusProps(props)}
                {...gridProps}
                items={props.items}
                renderItem={renderItem}
                itemsPerRow={itemsPerRow}
            />
        </>
    )
}

SnowImageGridW.isSnowFocusWired = true

export const SnowImageGrid = SnowImageGridW

export default SnowImageGrid