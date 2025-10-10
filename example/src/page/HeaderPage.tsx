import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function HeaderPage() {
  return (
    <View>
      <Snow.Label>Component: Header</Snow.Label>
      <Snow.Header>This is some header text.</Snow.Header>
    </View>
  )
}