import Snow from 'expo-snowui'
import { View } from 'react-native'

const tallImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/51/This_Gun_for_Hire_%281942%29_poster.jpg"
const wideImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Double-alaskan-rainbow.jpg"

export default function ImageButtonPage() {
  return (
    <View>
      <Snow.Label>Component: Image Button</Snow.Label>
      <Snow.ImageButton focusKey="tab-entry" focusDown="wide-button" imageUrl={tallImageUrl} title="Movie Poster" />
      <Snow.ImageButton focusKey="wide-button" focusUp="tab-entry" imageUrl={wideImageUrl} title="Rainbow" />
    </View>
  )
}
