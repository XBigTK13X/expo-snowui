import React from 'react'
import { useStyleContext } from '../../context/snow-style-context'
import { useFocusContext } from '../../context/snow-focus-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import { useLayerContext } from '../../context/snow-layer-context'

import SnowView from './snow-view'
import SnowDropdown from './snow-dropdown'
import SnowGrid from './snow-grid'
import SnowTextButton from './snow-text-button'

export const SnowTabs = (props) => {
    if (!props.headers) {
        return null
    }
    if (!props.children) {
        return null
    }
    const { SnowStyle } = useStyleContext(props)
    const { navUpdate, currentRoute } = useNavigationContext(props)
    const { focusPath } = useFocusContext('tabs', props)
    const { pushModal, popModal } = useLayerContext(props)

    const isPortrait = Boolean(SnowStyle?.isPortrait ?? (SnowStyle?.orientation === 'portrait'))

    const tabKey = `${props.focusKey}-tab`
    const tabTrigger = `${props.focusKey}-tab-trigger`

    let tabIndex = 0
    if (currentRoute?.routeParams?.hasOwnProperty(tabKey)) {
        tabIndex = parseInt(currentRoute?.routeParams?.[tabKey], 10) ?? 0
    }

    const tabStyle = isPortrait ? null : {
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
        navUpdate({
            [tabKey]: newIndex,
            [tabTrigger]: trigger
        })
    }

    const handleSelectTab = (newIndex) => {
        changeTab(newIndex, 'portrait-modal')
        popModal()
    }

    const openTabsModal = () => {
        pushModal({
            render: (modalProps) => (
                <SnowGrid
                    parentPath={`${focusPath}-modal`}
                >
                    {props.headers.map((headerTitle, headerIndex) => (
                        <SnowTextButton
                            key={headerIndex}
                            focusStart={headerIndex === tabIndex}
                            focusKey={`tab-option-${headerIndex}`}
                            xx={0}
                            yy={headerIndex}
                            title={headerTitle}
                            onPress={() => handleSelectTab(headerIndex)}
                        />
                    ))}
                </SnowGrid>
            ),
            props: {
                center: true,
                obscure: true,
                onRequestClose: popModal
            }
        })
    }

    const tabs = React.Children.toArray(props.children).map((child, childIndex) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                snowStyle: tabStyle,
                parentPath: focusPath,
                xx: childIndex,
                yy: 1
            })
        }
        return child
    }).filter(child => child !== null)

    let wrapperProps = { ...props }
    delete wrapperProps.focusStart

    const totalTabs = props.headers.length
    const currentHeader = props.headers[tabIndex] ?? ''
    const buttonTitle = `${currentHeader} (${tabIndex + 1}/${totalTabs})`

    return (
        <SnowView {...wrapperProps}>
            {isPortrait ? (
                <SnowTextButton
                    parentPath={focusPath}
                    focusStart={props.focusStart}
                    focusKey={tabKey}
                    xx={0}
                    yy={0}
                    title={buttonTitle}
                    onPress={openTabsModal}
                />
            ) : (
                <SnowDropdown
                    fade
                    parentPath={focusPath}
                    focusStart={props.focusStart}
                    focusKey={tabKey}
                    xx={0}
                    yy={0}
                    snowStyle={tabStyle}
                    options={props.headers}
                    onValueChange={changeTab}
                    valueIndex={tabIndex}
                    itemsPerRow={props.headers.length}
                />
            )}
            <SnowView style={isPortrait ? null : SnowStyle.component.tabs.panel}>
                {tabs[tabIndex]}
            </SnowView>
        </SnowView>
    )
}

export default SnowTabs