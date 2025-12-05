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


export default function ImageGridPage() {
  return (
    <>
      <Snow.Label>Component: Image Grid</Snow.Label>
      <Snow.ImageGrid
        focusKey="tab-entry"
        focusDown="wide-image"
        items={[...imageItems, ...imageItems, ...imageItems, ...imageItems, ...imageItems]}
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
      <Snow.ImageGrid
        focusKey="wide-image"
        focusDown="square-image"
        items={imageItems}
        wideImage
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
      <Snow.ImageGrid
        focusKey="square-image"
        items={imageItems}
        squareImage
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
    </>
  )
}
