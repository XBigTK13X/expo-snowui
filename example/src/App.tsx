import React from 'react'
import Snow from 'react-native-snowui';

const tallImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/51/This_Gun_for_Hire_%281942%29_poster.jpg"
const wideImageUrl = "https://upload.wikimedia.org/wikipedia/commons/5/5c/Double-alaskan-rainbow.jpg"

const imageItems = [
  {
    image: tallImageUrl,
    title: 'Movie Poster'
  },
  {
    image: wideImageUrl,
    title: 'Rainbow'
  }
]

export default function App() {
  const [dropdownIndex, setDropdownIndex] = React.useState(0)
  const [inputValue, setInputValue] = React.useState('')
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
  const [rangeSliderValue, setRangeSliderValue] = React.useState(0.5)
  const [toggleValue, setToggleValue] = React.useState(false)
  const togglePermitted = () => { setToggleValue(!toggleValue) }

  if (showModal) {
    return (
      <Snow.Modal>
        <Snow.Text>Hi, I am a modal.</Snow.Text>
        <Snow.TextButton title="Close" onPress={toggleModal} />
      </Snow.Modal>
    )
  }

  return (
    <Snow.App>
      <Snow.Label>App Level entities</Snow.Label>
      <Snow.Text>App, FillView, SafeArea, useStyleContext, useFocusContext.</Snow.Text>

      <Snow.Label>Component: Break</Snow.Label>
      <Snow.Break />
      <Snow.Text>Here is more text after a break.</Snow.Text>

      <Snow.Label>Component: Dropdown</Snow.Label>
      <Snow.Dropdown options={['Yes', 'No']} valueIndex={dropdownIndex} onValueChange={setDropdownIndex} />

      <Snow.Label>Component: Grid</Snow.Label>
      <Snow.Grid
        items={['Allow', 'Block', 'Cancel']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />

      <Snow.Label>Component: Header</Snow.Label>
      <Snow.Header>This is some header text.</Snow.Header>

      <Snow.Label>Component: Image Button</Snow.Label>
      <Snow.ImageButton imageUrl={tallImageUrl} title="Movie Poster" />
      <Snow.ImageButton imageUrl={wideImageUrl} title="Rainbow" />

      <Snow.Label>Component: Image Grid</Snow.Label>
      <Snow.ImageGrid
        items={imageItems}
        getItemImage={(item: any) => { return item.image }}
        getItemName={(item: any) => { return item.name }}
      />

      <Snow.Label>Component: Input</Snow.Label>
      <Snow.Input value={inputValue} onValueChange={setInputValue} />

      <Snow.Label>Component: Label</Snow.Label>
      <Snow.Label>This is some label text</Snow.Label>

      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton title="Show Modal" onPress={toggleModal} />

      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.RangeSlider onValueChange={setRangeSliderValue} percent={rangeSliderValue} />

      <Snow.Label>Tabs</Snow.Label>
      <Snow.Tabs headers={["First", "Second", "Third"]}>
        <Snow.Text>This is the first tab.</Snow.Text>
        <Snow.Text>You have reached the second tab.</Snow.Text>
        <Snow.Text>Finally, the third tab.</Snow.Text>
      </Snow.Tabs>

      <Snow.Label>TextButton</Snow.Label>
      <Snow.TextButton title="I am a button" />

      <Snow.Label>Component: Text</Snow.Label>
      <Snow.Text>Hello there snowui. This is some text</Snow.Text>

      <Snow.Label>Component: Toggle</Snow.Label>
      <Snow.Toggle title="Permitted" onValueChange={togglePermitted} value={toggleValue} />
    </Snow.App>
  );
}
