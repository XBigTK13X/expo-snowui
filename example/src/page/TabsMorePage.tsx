import Snow from 'expo-snowui'

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



export default function TabsMorePage(props: any) {
  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Tabs (More)</Snow.Label>
      <Snow.Tabs focusKey="tabs" headers={["First", "Second", "Third"]}>
        <Snow.ImageGrid
          items={imageItems}
          itemsPerPage={2}
          getItemImageUrl={(item: any) => { return item.imageUrl }}
          getItemImageSource={(item: any) => { return item.imageSource }}
          getItemName={(item: any) => { return item.title }}
        />
        <Snow.ImageGrid
          items={imageItems}
          itemsPerPage={2}
          wideImage
          getItemImageUrl={(item: any) => { return item.imageUrl }}
          getItemImageSource={(item: any) => { return item.imageSource }}
          getItemName={(item: any) => { return item.title }}
        />
        <Snow.ImageGrid
          items={imageItems}
          itemsPerPage={2}
          squareImage
          getItemImageUrl={(item: any) => { return item.imageUrl }}
          getItemImageSource={(item: any) => { return item.imageSource }}
          getItemName={(item: any) => { return item.title }}
        />
      </Snow.Tabs>
    </Snow.View>
  )
}
