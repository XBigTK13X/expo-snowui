import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import SnowText from '../snow-text'
import SnowTextButton from './snow-text-button'

const SnowPagerW = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { navPush, currentRoute } = useNavigationContext(props)

    const pageKey = `${props.focusKey}-grid-page`
    const pageTrigger = `${props.focusKey}-page-trigger`

    const firstPageKey = `${props.focusKey}-first-page`
    const previousHalfKey = `${props.focusKey}-previous-half`
    const previousPageKey = `${props.focusKey}-previous-page`
    const nextPageKey = `${props.focusKey}-next-page`
    const nextHalfKey = `${props.focusKey}-next-half`
    const lastPageKey = `${props.focusKey}-last-page`
    const pageCountTestId = `${props.focusKey}-page-count`

    const gotoPage = (page, trigger) => {
        let params = {
            [pageKey]: page,
            [pageTrigger]: trigger
        }
        if (currentRoute?.routeParams) {
            params = {
                ...currentRoute.routeParams,
                [pageKey]: page,
                [pageTrigger]: trigger
            }
        }
        navPush({
            params: params,
            replace: true,
            func: false
        })
    }

    const firstPage = () => {
        gotoPage(0, firstPageKey)
    }

    const lastPage = () => {
        gotoPage(props.maxPage - 1, lastPageKey)
    }

    const previousPage = () => {
        if (props.page > 0) {
            return gotoPage(props.page - 1, previousPageKey)
        }
        return gotoPage(props.maxPage - 1, previousPageKey)
    }

    const nextPage = () => {
        if (props.page < props.maxPage - 1) {
            return gotoPage(props.page + 1, nextPageKey)
        }
        return gotoPage(0, nextPageKey)
    }

    const previousHalf = () => {
        gotoPage(Math.floor(props.page / 2), previousHalfKey)
    }

    const nextHalf = () => {
        gotoPage(Math.floor((props.page + props.maxPage) / 2), nextHalfKey)
    }

    let focusEscapeProps = {}
    if (props.focusDown) {
        focusEscapeProps.focusDown = props.focusDown
    }
    if (props.focusUp) {
        focusEscapeProps.focusUp = props.focusUp
    }

    const renderKey = `${props.focusKey ?? ''}-pager-${props.page}`

    let buttonFocusStart = null
    if (currentRoute?.routeParams?.hasOwnProperty(pageTrigger)) {
        buttonFocusStart = currentRoute?.routeParams?.[pageTrigger]
    }

    return (
        <View style={SnowStyle.component.grid.pager} key={renderKey}>
            <SnowTextButton
                {...focusEscapeProps}
                focusKey={firstPageKey}
                focusStart={buttonFocusStart === firstPageKey}
                focusLeft={lastPageKey}
                focusRight={previousHalfKey}
                title="<<<"
                short
                onPress={firstPage}
            />

            <SnowTextButton
                {...focusEscapeProps}
                focusKey={previousHalfKey}
                focusStart={buttonFocusStart === previousHalfKey}
                focusLeft={firstPageKey}
                focusRight={previousPageKey}
                title="<<"
                short
                onPress={previousHalf}
            />

            <SnowTextButton
                {...focusEscapeProps}
                focusKey={previousPageKey}
                focusStart={buttonFocusStart === previousPageKey}
                focusLeft={previousHalfKey}
                focusRight={nextPageKey}
                title="<"
                short
                onPress={previousPage}
            />

            <SnowText testID={pageCountTestId} noSelect>{props.page + 1} / {props.maxPage}</SnowText>

            <SnowTextButton
                {...focusEscapeProps}
                focusKey={nextPageKey}
                focusStart={buttonFocusStart === nextPageKey}
                focusLeft={previousPageKey}
                focusRight={nextHalfKey}
                title=">"
                short
                onPress={nextPage}
            />

            <SnowTextButton
                {...focusEscapeProps}
                focusKey={nextHalfKey}
                focusStart={buttonFocusStart === nextHalfKey}
                focusLeft={nextPageKey}
                focusRight={lastPageKey}
                title=">>"
                short
                onPress={nextHalf}
            />

            <SnowTextButton
                {...focusEscapeProps}
                focusKey={lastPageKey}
                focusStart={buttonFocusStart === lastPageKey}
                focusLeft={nextHalfKey}
                focusRight={firstPageKey}
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