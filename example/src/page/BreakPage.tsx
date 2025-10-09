import { View } from 'react-native'
import Snow from 'expo-snowui'

export default function BreakPage() {
    return (
        <View>
            <Snow.Label>Component: Break</Snow.Label>
            <Snow.Break />
            <Snow.Text>Here is more text after a break.</Snow.Text>
        </View>
    )
}