import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function LabelPage() {

  return (
    <View>
      <Snow.Label>Component: Label</Snow.Label>
      <Snow.Label>This is some label text</Snow.Label>
    </View>
  )
}