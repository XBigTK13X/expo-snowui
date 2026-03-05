import { View } from 'react-native'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowLabel from '../snow-label'
import SnowGrid from './snow-grid'
import SnowTextButton from './snow-text-button'

export const SnowDropdown = (props) => {
    if (!props.options) {
        return null
    }
    if (props.valueIndex === undefined || props.valueIndex === null) {
        return null
    }
    const { focusPath } = useFocusContext('dropdown', props)
    const choose = (chosenIndex, entryFocusKey) => {
        if (props.onValueChange) {
            props.onValueChange(chosenIndex, entryFocusKey)
        }
    }

    const renderItem = (item, itemIndex) => {
        let selected = false
        if (!props.skipDefaultFocus) {
            if (itemIndex === props.valueIndex) {
                selected = true
            }
        }
        const entryFocusKey = props.focusKey + '-' + itemIndex
        return <SnowTextButton
            snowStyle={props.snowStyle}
            focusKey={entryFocusKey}
            fade={selected && props.fade}
            selected={selected}
            title={item.name ? item.name : item}
            onPress={() => { choose(item.index ? item.index : itemIndex, entryFocusKey) }} />
    }

    if (props.title) {
        return <>
            <SnowLabel center>{props.title}</SnowLabel>
            <SnowGrid
                parentPath={focusPath}
                itemsPerRow={props.itemsPerRow}
                items={props.options}
                renderItem={renderItem}
            />
        </>
    }
    return (
        <SnowGrid
            parentPath={focusPath}
            itemsPerRow={props.itemsPerRow}
            items={props.options}
            renderItem={renderItem}
        />
    )
}

export default SnowDropdown