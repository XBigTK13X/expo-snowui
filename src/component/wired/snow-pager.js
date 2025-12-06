import React from 'react'
import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import SnowText from '../snow-text'
import SnowTextButton from './snow-text-button'

const SnowPagerW = (props) => {
    const { SnowStyle } = useStyleContext(props)

    const firstPage = () => {
        props.onPageChange(0)
    }

    const lastPage = () => {
        props.onPageChange(props.maxPage - 1)
    }

    const previousPage = () => {
        if (props.page > 0) {
            return props.onPageChange(props.page - 1)
        }
        return props.onPageChange(props.maxPage - 1)
    }

    const nextPage = () => {
        if (props.page < props.maxPage - 1) {
            return props.onPageChange(props.page + 1)
        }
        return props.onPageChange(0)
    }

    const previousHalf = () => {
        props.onPageChange(Math.floor(props.page / 2))
    }

    const nextHalf = () => {
        props.onPageChange(Math.floor((props.page + props.maxPage) / 2))
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

    return (
        <View style={SnowStyle.component.grid.pager} key={renderKey}>
            <SnowTextButton
                focusKey={`first-page`}
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
                focusStart={!!props.page}
                focusKey={nextPageKey}
                focusLeft={`previous-page`}
                focusRight={`next-half`}
                title=">"
                short
                onPress={nextPage}
            />

            <SnowTextButton
                focusKey={`next-half`}
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