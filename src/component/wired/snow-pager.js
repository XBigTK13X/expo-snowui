import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import SnowText from '../snow-text'
import SnowTextButton from './snow-text-button'

export const SnowPager = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { navPush, currentRoute } = useNavigationContext(props)

    const pageKey = `${props.focusKey}-grid-page`
    const pageTrigger = `${props.focusKey}-page-trigger`

    const gotoPage = (page) => {
        let params = {
            [pageKey]: pageYOffset
        }
        if (currentRoute?.routeParams) {
            params = {
                ...currentRoute.routeParams,
                [pageKey]: page
            }
        }
        navPush({
            params: params,
            replace: true,
            func: false
        })
    }

    const firstPage = () => {
        gotoPage(0)
    }

    const finalPage = () => {
        gotoPage(props.maxPage - 1)
    }

    const previousPage = () => {
        if (props.page > 0) {
            return gotoPage(props.page - 1)
        }
        return gotoPage(props.maxPage - 1)
    }

    const nextPage = () => {
        if (props.page < props.maxPage - 1) {
            return gotoPage(props.page + 1)
        }
        return gotoPage(0)
    }

    const previousHalf = () => {
        gotoPage(Math.floor(props.page / 2))
    }

    const nextHalf = () => {
        gotoPage(Math.floor((props.page + props.maxPage) / 2))
    }

    let pagerFocusKey = `${props.focusKey ?? ''}-pager-${props.page}`
    if (props.snowFocus?.parent) {
        pagerFocusKey = `${props.snowFocus.parent}|${pagerFocusKey}`
    }

    let buttonFocusStart = null
    if (currentRoute?.routeParams?.hasOwnProperty(pageTrigger)) {
        buttonFocusStart = currentRoute?.routeParams?.[pageTrigger]
    }

    return (
        <View style={SnowStyle.component.grid.pager} key={pagerFocusKey}>
            <SnowTextButton
                snowFocus={{
                    focusKey: 'first-page-btn',
                    parent: pagerFocusKey,
                    xx: 0,
                    yy: 0
                }}
                title="<<<"
                short
                onPress={firstPage}
            />

            <SnowTextButton
                snowFocus={{
                    focusKey: 'first-half-btn',
                    parent: pagerFocusKey,
                    xx: 1,
                    yy: 0
                }}
                title="<<"
                short
                onPress={previousHalf}
            />

            <SnowTextButton
                snowFocus={{
                    focusKey: 'previous-page-btn',
                    parent: pagerFocusKey,
                    xx: 2,
                    yy: 0
                }}
                title="<"
                short
                onPress={previousPage}
            />

            <SnowText testID={pageCountTestId} noSelect>{props.page + 1} / {props.maxPage}</SnowText>

            <SnowTextButton
                snowFocus={{
                    focusKey: 'next-page-btn',
                    parent: pagerFocusKey,
                    xx: 3,
                    yy: 0
                }}
                title=">"
                short
                onPress={nextPage}
            />

            <SnowTextButton
                snowFocus={{
                    focusKey: 'next-half-btn',
                    parent: pagerFocusKey,
                    xx: 4,
                    yy: 0
                }}
                title=">>"
                short
                onPress={nextHalf}
            />

            <SnowTextButton
                snowFocus={{
                    focusKey: 'final-page-btn',
                    parent: pagerFocusKey,
                    xx: 5,
                    yy: 0
                }}
                title=">>>"
                short
                onPress={finalPage}
            />
        </View>
    )
}

export default SnowPager