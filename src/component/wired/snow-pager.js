import React from 'react'
import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import SnowText from '../snow-text'
import SnowTextButton from './snow-text-button'

const SnowPagerW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { navPush, currentRoute } = useNavigationContext(props)

    const gotoPage = (page, trigger) => {
        let params = {
            gridPage: page,
            pageTrigger: trigger
        }
        if (currentRoute?.routeParams) {
            params = {
                ...currentRoute.routeParams,
                gridPage: page,
                pageTrigger: trigger
            }
        }
        navPush({
            params: params,
            func: false
        })
    }

    const firstPage = () => {
        gotoPage(0, 'first-page')
    }

    const lastPage = () => {
        gotoPage(props.maxPage - 1, 'last-page')
    }

    const previousPage = () => {
        if (props.page > 0) {
            return gotoPage(props.page - 1, 'previous-page')
        }
        return gotoPage(props.maxPage - 1, 'previous-page')
    }

    const nextPage = () => {
        if (props.page < props.maxPage - 1) {
            return gotoPage(props.page + 1, 'next-page')
        }
        return gotoPage(0, 'next-page')
    }

    const previousHalf = () => {
        gotoPage(Math.floor(props.page / 2), 'previous-half')
    }

    const nextHalf = () => {
        gotoPage(Math.floor((props.page + props.maxPage) / 2), 'next-half')
    }

    let nextPageKey = props.focusKey

    let focusEscapeProps = {}
    if (props.focusDown) {
        focusEscapeProps.focusDown = props.focusDown
    }
    if (props.focusUp) {
        focusEscapeProps.focusUp = props.focusUp
    }

    const renderKey = `${props.focusKey ?? ''}-pager-${props.page}`

    let buttonFocusStart = null
    if (currentRoute?.routeParams?.pageTrigger !== undefined) {
        buttonFocusStart = currentRoute?.routeParams?.pageTrigger
    }

    return (
        <View style={SnowStyle.component.grid.pager} key={renderKey}>
            <SnowTextButton
                focusKey={`first-page`}
                focusStart={buttonFocusStart === 'first-page'}
                focusLeft={`last-page`}
                focusRight={`previous-half`}
                focusUp={nextPageKey}
                focusDown={nextPageKey}
                title="<<<"
                short
                onPress={firstPage}
            />

            <SnowTextButton
                focusKey={`previous-half`}
                focusStart={buttonFocusStart === 'previous-half'}
                focusLeft={`first-page`}
                focusRight={`previous-page`}
                focusUp={nextPageKey}
                focusDown={nextPageKey}
                title="<<"
                short
                onPress={previousHalf}
            />

            <SnowTextButton
                focusKey={`previous-page`}
                focusStart={buttonFocusStart === 'previous-page'}
                focusLeft={`previous-half`}
                focusRight={nextPageKey}
                focusUp={nextPageKey}
                focusDown={nextPageKey}
                title="<"
                short
                onPress={previousPage}
            />

            <SnowText noSelect>{props.page + 1} / {props.maxPage}</SnowText>

            <SnowTextButton
                {...focusEscapeProps}
                focusKey={nextPageKey}
                focusStart={buttonFocusStart === 'next-page'}
                focusLeft={`previous-page`}
                focusRight={`next-half`}
                title=">"
                short
                onPress={nextPage}
            />

            <SnowTextButton
                focusKey={`next-half`}
                focusStart={buttonFocusStart === 'next-half'}
                focusLeft={nextPageKey}
                focusRight={`last-page`}
                focusUp={nextPageKey}
                focusDown={nextPageKey}
                title=">>"
                short
                onPress={nextHalf}
            />

            <SnowTextButton
                focusKey={`last-page`}
                focusStart={buttonFocusStart === 'last-page'}
                focusLeft={`next-half`}
                focusRight={`first-page`}
                focusUp={nextPageKey}
                focusDown={nextPageKey}
                title=">>>"
                short
                onPress={lastPage}
            />
        </View>
    )
}

SnowPagerW.isSnowFocusWired = true

export const SnowPager = SnowPagerW

export default SnowPager