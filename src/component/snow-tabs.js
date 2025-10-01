import React from 'react'
import { View } from 'react-native';

import SnowDropdown from './snow-dropdown'
import { useStyleContext } from '../context/snow-style-context'
import { useFocusContext } from '../context/snow-focus-context'

const SnowTabsComponent = (props) => {
    const { SnowStyle } = useStyleContext(props)
    if (!props.headers) {
        return null
    }
    if (!props.children) {
        return null
    }
    const { readFocusProps } = useFocusContext()

    const [tabIndex, setTabIndex] = React.useState(0)
    const tabStyle = {
        color: {
            fade: SnowStyle.color.panel
        },
        component: {
            textButton: {
                fade: {
                    backgroundColor: SnowStyle.color.panel
                },
                fadeText: {
                    color: SnowStyle.color.text
                }
            },
            imageButton: {
                wrapper: {
                    borderColor: SnowStyle.color.panel
                }
            }
        }
    }

    const innerFocusKey = `${props.focusKey}-tab`

    const outerFocusProps = readFocusProps(props)
    outerFocusProps.focusDown = innerFocusKey

    const tabs = React.Children.toArray(props.children).map(child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                snowStyle: tabStyle,
                focusKey: innerFocusKey,
                focusDown: props.focusDown
            });
        }
        return child;
    }).filter(child => child !== null);

    return (
        <View>
            <SnowDropdown
                {...outerFocusProps}
                snowStyle={tabStyle}
                fade
                options={props.headers}
                onValueChange={setTabIndex}
                valueIndex={tabIndex}
                itemsPerRow={props.headers.length} />
            <View style={SnowStyle.component.tabs.panel}>
                {tabs[tabIndex]}
            </View>
        </View>
    )

}

SnowTabsComponent.isSnowFocusWired = true

export const SnowTabs = SnowTabsComponent

export default SnowTabs