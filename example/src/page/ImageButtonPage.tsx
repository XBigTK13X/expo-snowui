import Snow from 'expo-snowui'

const tallImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/51/This_Gun_for_Hire_%281942%29_poster.jpg"
const wideImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Double-alaskan-rainbow.jpg"

export default function ImageButtonPage(props: any) {
  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Image Button</Snow.Label>
      <Snow.ImageButton tall imageUrl={tallImageUrl} title="Movie Poster" />
      <Snow.ImageButton wide imageUrl={wideImageUrl} title="Rainbow" />
      <Snow.ImageButton wide imageUrl={wideImageUrl} title="" />
      <Snow.ImageButton tall overlayTitle imageUrl={tallImageUrl} title="Super Tall Baby" />
      <Snow.ImageButton wide overlayTitle imageUrl={wideImageUrl} title="Super Wide Baby With Too Much Text" />
    </Snow.View>
  )
}
