import Snow from 'expo-snowui'
import { View } from 'react-native'

const tallImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/51/This_Gun_for_Hire_%281942%29_poster.jpg"
const wideImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Double-alaskan-rainbow.jpg"

const imageItems = [
  {
    imageUrl: tallImageUrl,
    title: 'Movie Poster'
  },
  {
    imageUrl: wideImageUrl,
    title: 'Rainbow'
  },
  {
    imageSource: { uri: tallImageUrl },
    title: 'Another Poster'
  }
]
export default function TabsPage() {
  Snow.useFocusLayer('tab-tabs')
  return (
    <View>
      <Snow.Label>Component: Tabs</Snow.Label>
      <Snow.Tabs focusKey="tab-entry" headers={["First", "Second", "Third"]}>
        <Snow.Text>This is the first tab.</Snow.Text>
        <Snow.Text>You have reached the second tab.</Snow.Text>
        <Snow.ImageGrid
          items={imageItems}
          getItemImageUrl={(item: any) => { return item.imageUrl }}
          getItemImageSource={(item: any) => { return item.imageSource }}
          getItemName={(item: any) => { return item.title }}
        />
      </Snow.Tabs>
    </View>
  )
}
