import React from 'react'
import { View } from 'react-native';

import SnowDropdown from './snow-dropdown'
import SnowFillView from './snow-fill-view'
import { useStyleContext } from '../context/snow-style-context'

export function SnowTabs(props) {
    const { SnowStyle } = useStyleContext(props)
    if (!props.headers) {
        return null
    }
    if (!props.children) {
        return null
    }

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

    const tabs = React.Children.toArray(props.children).map(child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { snowStyle: tabStyle });
        }
        return child;
    }).filter(child => child !== null);

    return (
        <View>
            <View>
                <SnowDropdown
                    snowStyle={tabStyle}
                    short
                    fade
                    options={props.headers}
                    onValueChange={setTabIndex}
                    valueIndex={tabIndex}
                    itemsPerRow={props.headers.length} />
            </View>
            <SnowFillView style={SnowStyle.component.tabs.panel}>
                {tabs[tabIndex]}
            </SnowFillView>
        </View>
    )

}

export default SnowTabs