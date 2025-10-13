import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowLabel from '../snow-label'
import SnowGrid from './snow-grid'
import SnowTextButton from './snow-text-button'

const SnowDropdownW = (props) => {
    const { readFocusProps } = useFocusContext()
    if (!props.options) {
        return null
    }
    if (props.valueIndex === undefined || props.valueIndex === null) {
        return null
    }

    const choose = (chosenIndex) => {
        if (props.onValueChange) {
            props.onValueChange(chosenIndex)
        }
    }

    const renderItem = (item, itemIndex) => {
        let selected = false
        if (!props.skipDefaultFocus) {
            if (itemIndex === props.valueIndex) {
                selected = true
            }
        }
        return <SnowTextButton
            snowStyle={props.snowStyle}
            fade={selected && props.fade}
            selected={selected}
            title={item.name ? item.name : item}
            onPress={() => { choose(item.index ? item.index : itemIndex) }} />
    }

    if (props.title) {
        return <>
            <SnowLabel center>{props.title}</SnowLabel>
            <SnowGrid
                {...readFocusProps(props)}
                itemsPerRow={props.itemsPerRow}
                items={props.options}
                renderItem={renderItem}
            />
        </>
    }
    return (
        <SnowGrid
            {...readFocusProps(props)}
            itemsPerRow={props.itemsPerRow}
            items={props.options}
            renderItem={renderItem}
        />
    )
}

SnowDropdownW.isSnowFocusWired = true

export const SnowDropdown = SnowDropdownW

export default SnowDropdown