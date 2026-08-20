const SNOWUI_VERSION = 'v1.0.0'

export default function SnowVersion(props) {
    const { SnowStyle } = useStyleContext(props)
    const styles = {
        footer: {
            width: '100%',
            textAlign: 'right',
            color: SnowStyle.color.active
        }
    }

    return (
        <>
            <C.SnowText style={styles.footer}>{`[built ${props.clientDate}]`}</C.SnowText>
            <C.SnowText style={styles.footer}>{`[snowstream v${props.clientVersion}]`}</C.SnowText>
            <C.SnowText style={styles.footer}>{`[snowui ${SNOWUI_VERSION}]`}</C.SnowText>
        </>
    )
}