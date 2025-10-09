import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function TextPage() {
  Snow.useFocusLayer('tab-text')
  return (
    <View>
      <Snow.Label>Component: Text</Snow.Label>
      <Snow.Text>Hello there snowui. This is some text</Snow.Text>
    </View>
  )
}