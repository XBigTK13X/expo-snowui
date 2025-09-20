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
    let tabs = React.Children.toArray(props.children)
    tabs = tabs.filter(child => child !== null)
    const [tabIndex, setTabIndex] = React.useState(0)
    return (
        <View>
            <View>
                <SnowDropdown
                    snowStyle={{
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
                            }
                        }
                    }}
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