import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowText from '../snow-text'
import SnowTextButton from './snow-text-button'

export const SnowPager = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { navPush, currentRoute } = useNavigationContext(props)
    const { focusPath } = useFocusContext('pager', props)

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
                focusKey={'first-page-btn'}
                xx={0}
                title="<<<"
                short
                onPress={firstPage}
            />

            <SnowTextButton
                focusKey={'first-half-btn'}
                xx={1}
                title="<<"
                short
                onPress={previousHalf}
            />

            <SnowTextButton
                focusKey={'previous-page-btn'}
                xx={2}
                title="<"
                short
                onPress={previousPage}
            />

            <SnowText testID={pageCountTestId} noSelect>{props.page + 1} / {props.maxPage}</SnowText>

            <SnowTextButton
                focusKey={'next-page-btn'}
                xx={3}
                title=">"
                short
                onPress={nextPage}
            />

            <SnowTextButton
                focusKey={'next-half-btn'}
                xx={4}
                title=">>"
                short
                onPress={nextHalf}
            />

            <SnowTextButton
                focusKey={'final-page-btn'}
                xx={5}
                title=">>>"
                short
                onPress={finalPage}
            />
        </View>
    )
}

export default SnowPager