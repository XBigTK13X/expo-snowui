import { View } from 'react-native'
import { useStyleContext } from '../../context/snow-style-context'
import { useNavigationContext } from '../../context/snow-navigation-context'
import { useFocusContext } from '../../context/snow-focus-context'
import SnowView from './snow-view'
import SnowText from '../snow-text'
import SnowTextButton from './snow-text-button'

export const SnowPager = (props) => {
    const { SnowStyle } = useStyleContext(props)
    const { navUpdate, currentRoute } = useNavigationContext(props)
    const { focusPath } = useFocusContext('pager', props)

    const pageKey = `${props.focusKey}-grid-page`
    const pageTrigger = `${props.focusKey}-page-trigger`
    const pageCountTestId = `${props.focusKey}-page-count`

    const gotoPage = (page) => {
        navUpdate({
            [pageKey]: page
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


    let buttonFocusStart = null
    if (currentRoute?.routeParams?.hasOwnProperty(pageTrigger)) {
        buttonFocusStart = currentRoute?.routeParams?.[pageTrigger]
    }

    return (
        <SnowView parentPath={focusPath} style={SnowStyle.component.grid.pager}>
            <SnowTextButton
                focusKey={'first-page-button'}
                xx={0}
                yy={0}
                title="<<<"
                short
                onPress={firstPage}
            />

            <SnowTextButton
                focusKey={'first-half-button'}
                xx={1}
                yy={0}
                title="<<"
                short
                onPress={previousHalf}
            />

            <SnowTextButton
                focusKey={'previous-page-button'}
                xx={2}
                yy={0}
                title="<"
                short
                onPress={previousPage}
            />

            <SnowText testID={pageCountTestId} noSelect>{props.page + 1} / {props.maxPage}</SnowText>

            <SnowTextButton
                focusKey={'next-page-button'}
                xx={3}
                yy={0}
                title=">"
                short
                onPress={nextPage}
            />

            <SnowTextButton
                focusKey={'next-half-button'}
                xx={4}
                yy={0}
                title=">>"
                short
                onPress={nextHalf}
            />

            <SnowTextButton
                focusKey={'final-page-button'}
                xx={5}
                yy={0}
                title=">>>"
                short
                onPress={finalPage}
            />
        </SnowView>
    )
}

export default SnowPager