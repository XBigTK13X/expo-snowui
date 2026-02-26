import React from 'react'
import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import SnowDropdown from './snow-dropdown'

export const SnowTabs = (props) => {
    if (!props.headers) {
        return null
    }
    if (!props.children) {
        return null
    }
    const { SnowStyle } = useStyleContext(props)
    const { navPush, currentRoute } = useNavigationContext(props)
    const { focusPath } = useFocusContext('tabs', props)

    const tabKey = `${props.focusKey}-tab`
    const tabTrigger = `${props.focusKey}-tab-trigger`

    let tabIndex = 0
    if (currentRoute?.routeParams?.hasOwnProperty(tabKey)) {
        tabIndex = parseInt(currentRoute?.routeParams?.[tabKey], 10) ?? 0
    }
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

    const changeTab = (newIndex, trigger) => {
        let params = {
            [tabKey]: newIndex,
            [tabTrigger]: trigger
        }
        if (currentRoute?.routeParams) {
            params = {
                ...currentRoute.routeParams,
                [tabKey]: newIndex,
                [tabTrigger]: trigger
            }
        }
        navPush({
            params: params,
            replace: true,
            func: false
        })
    }

    const tabs = React.Children.toArray(props.children).map((child, childIndex) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                snowStyle: tabStyle,
                parentPath: focusPath,
                xx: childIndex
            })
        }
        return child
    }).filter(child => child !== null)

    return (
        <>
            <SnowDropdown
                snowStyle={tabStyle}
                parentPath={focusPath}
                fade
                options={props.headers}
                onValueChange={changeTab}
                valueIndex={tabIndex}
                itemsPerRow={props.headers.length} />
            <View style={SnowStyle.component.tabs.panel}>
                {tabs[tabIndex]}
            </View>
        </>
    )

}

export default SnowTabs