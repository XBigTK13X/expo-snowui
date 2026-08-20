import { useStyleContext } from '../context/snow-style-context'
import { SnowText } from './snow-text'

const SNOWUI_VERSION = "1.8.4"

export function SnowVersion(props) {
    const { SnowStyle } = useStyleContext(props)
    const styles = {
        footer: {
            width: '100%',
            textAlign: 'right',
            color: SnowStyle.color.active,
            marginBottom: 0,
            marginTop: 0,
            paddingBottom: 0,
            paddingTop: 5
        }
    }

    return (
        <>
            <SnowText style={styles.footer}>{`built ${props.buildDate ?? 'January 01, 2000'}`}</SnowText>
            <SnowText style={styles.footer}>{`${props.appName ?? 'snowui-app'} v${props.appVersion ?? 'X.Y.Z'}`}</SnowText>
            <SnowText style={styles.footer}>{`snowui v${SNOWUI_VERSION}`}</SnowText>
        </>
    )
}

export default SnowVersion