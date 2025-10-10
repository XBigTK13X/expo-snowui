import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function TextButtonPage() {

  return (
    <View>
      <Snow.Label>Component: TextButton</Snow.Label>
      <Snow.Grid focusKey="tab-entry" itemsPerRow={3}>
        <Snow.TextButton title="I am a button" />
      </Snow.Grid>
    </View>
  )
}
