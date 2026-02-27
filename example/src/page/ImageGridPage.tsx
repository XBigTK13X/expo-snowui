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
    title: 'This rainbow is very long. Like the title has way too much text. So much. Can it all fit? Will it overflow? Will it show some ellipsis?'
  },
  {
    imageSource: { uri: tallImageUrl },
    title: 'Another Poster'
  }
]


export default function ImageGridPage(props: any) {
  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Image Grid</Snow.Label>
      <Snow.ImageGrid
        focusKey="tall"
        items={[...imageItems, ...imageItems, ...imageItems, ...imageItems, ...imageItems]}
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
      <Snow.Break />
      <Snow.ImageGrid
        focusKey="wide"
        items={imageItems}
        wideImage
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
      <Snow.Break />
      <Snow.ImageGrid
        focusKey="square"
        items={imageItems}
        squareImage
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
    </Snow.View>
  )
}
