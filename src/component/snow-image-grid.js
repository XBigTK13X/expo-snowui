import React from 'react'
import SnowFillView from './snow-fill-view'
import SnowGrid from './snow-grid'
import SnowImageButton from './snow-image-button'
import SnowLabel from './snow-label'

export function SnowImageGrid(props) {
    if (!props.items || !props.items.length) {
        return null
    }
    const [toggledItems, setToggledItems] = React.useState({})
    const itemsPerRow = props.itemsPerRow || 5
    const renderItem = (item, itemIndex) => {
        const imageUrl = props.getItemImage(item)
        const itemName = props.getItemName(item)

        let toggled = toggledItems.hasOwnProperty(item.id)

        let isDull = false
        if (!props.disableToggle) {
            if (props.getItemToggleStatus && props.getItemToggleStatus(item)) {
                isDull = true
            }
        }

        return <SnowImageButton
            wide={props.wideImage}
            dull={isDull}
            shouldFocus={props.shouldFocus && itemIndex === 0}
            imageUrl={imageUrl}
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
    return (
        <SnowFillView>
            {props.title ?
                <SnowLabel>
                    {props.title} ({props.items.length})
                </SnowLabel>
                : null}
            <SnowGrid
                mainGrid={props.isMainGrid}
                items={props.items}
                renderItem={renderItem}
                itemsPerRow={itemsPerRow}
            />
        </SnowFillView>
    )
}

export default SnowImageGrid