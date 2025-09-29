import React from 'react'
import { View } from 'react-native'
import Snow from 'expo-snowui';

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

const styleOverrides = {
  color: {
    hover: 'rgba(44, 219, 175, 1)',
    core: 'rgba(91, 34, 184, 1)',
    coreDark: 'rgba(62, 32, 110, 1)',
  }
}

function BreakTab() {
  return (
    <View>
      <Snow.Label>Component: Break</Snow.Label>
      <Snow.Break />
      <Snow.Text>Here is more text after a break.</Snow.Text>
    </View>
  )
}

function DropdownTab(props: any) {
  return (
    <View>
      <Snow.Label>Component: Dropdown</Snow.Label>
      <Snow.Dropdown
        focusKey="tab-entry"
        options={['Yes', 'No']}
        valueIndex={props.dropdownIndex}
        onValueChange={props.setDropdownIndex} />
    </View>
  )
}

function GridTab() {
  return (
    <View>
      <Snow.Label>Component: Grid</Snow.Label>
      <Snow.Grid
        focusKey="tab-entry"
        items={['Allow', 'Block', 'Cancel']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
    </View>
  )
}

function HeaderTab() {
  return (
    <View>
      <Snow.Label>Component: Header</Snow.Label>
      <Snow.Header>This is some header text.</Snow.Header>
    </View>
  )
}

function ImageButtonTab() {
  return (
    <View>
      <Snow.Label>Component: Image Button</Snow.Label>
      <Snow.ImageButton focusKey="tab-entry" focusDown="wide-button" imageUrl={tallImageUrl} title="Movie Poster" />
      <Snow.ImageButton focusKey="wide-button" focusUp="tab-entry" imageUrl={wideImageUrl} title="Rainbow" />
    </View>
  )
}

function ImageGridTab() {
  return (
    <View>
      <Snow.Label>Component: Image Grid</Snow.Label>
      <Snow.ImageGrid
        focusKey="tab-entry"
        items={imageItems}
        getItemImageUrl={(item: any) => { return item.imageUrl }}
        getItemImageSource={(item: any) => { return item.imageSource }}
        getItemName={(item: any) => { return item.title }}
      />
    </View>
  )
}

function InputTab(props: any) {
  return (
    <View>
      <Snow.Label>Component: Input</Snow.Label>
      <Snow.Input focusKey="tab-entry" value={props.inputValue} onValueChange={props.setInputValue} />
    </View>
  )
}

function LabelTab() {
  return (
    <View>
      <Snow.Label>Component: Label</Snow.Label>
      <Snow.Label>This is some label text</Snow.Label>
    </View>
  )
}


function ModalTab() {
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
  if (showModal) {
    return (
      <Snow.Modal focusLayer={'example-modal'} scroll onRequestClose={toggleModal}>
        <Snow.TextButton focusKey="tab-entry" focusDown="modal-bottom" title="Close" onPress={toggleModal} />
        <Snow.Text>Hi, I am a modal.</Snow.Text>
        <View style={{ height: 1000 }}>
          <Snow.Text>There should be scrolling.</Snow.Text>
        </View>
        <Snow.Text>And then the end</Snow.Text>
        <Snow.TextButton focusKey="modal-bottom" title="Close" onPress={toggleModal} />
      </Snow.Modal>
    )
  }
  return (
    <View>
      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton focusKey="tab-entry" title="Show Modal" onPress={toggleModal} />
    </View>
  )
}

function RangeSliderTab(props: any) {
  return (
    <View>
      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.RangeSlider focusKey="tab-entry" onValueChange={props.setRangeSliderValue} percent={props.rangeSliderValue} />
    </View>
  )
}

function TabsTab() {
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

function TextButtonTab() {
  return (
    <View>
      <Snow.Label>Component: TextButton</Snow.Label>
      <Snow.Grid focusKey="tab-entry" itemsPerRow={3}>
        <Snow.TextButton title="I am a button" />
      </Snow.Grid>
    </View>
  )
}

function TextTab() {
  return (
    <View>
      <Snow.Label>Component: Text</Snow.Label>
      <Snow.Text>Hello there snowui. This is some text</Snow.Text>
    </View>
  )
}

function ToggleTab(props: any) {
  return (
    <View>
      <Snow.Label>Component: Toggle</Snow.Label>
      <Snow.Toggle focusKey="tab-entry" title="Permitted" onValueChange={props.togglePermitted} value={props.toggleValue} />
    </View>
  )
}

function AppPage() {
  const [tabIndex, setTabIndex] = React.useState(0)

  const [dropdownIndex, setDropdownIndex] = React.useState(0)
  const [inputValue, setInputValue] = React.useState('')
  const [rangeSliderValue, setRangeSliderValue] = React.useState(0.5)
  const [toggleValue, setToggleValue] = React.useState(false)
  const togglePermitted = () => { setToggleValue(!toggleValue) }

  let components = [
    ['Break', <BreakTab />],
    ['Dropdown', <DropdownTab dropdownIndex={dropdownIndex} setDropdownIndex={setDropdownIndex} />],
    ['Grid', <GridTab />],
    ['Header', <HeaderTab />],
    ['ImageButton', <ImageButtonTab />],
    ['ImageGrid', <ImageGridTab />],
    ['Input', <InputTab inputValue={inputValue} setInputValue={setInputValue} />],
    ['Label', <LabelTab />],
    ['Modal', <ModalTab />],
    ['Range Slider', <RangeSliderTab setRangeSliderValue={setRangeSliderValue} rangeSliderValue={rangeSliderValue} />],
    ['Tabs', <TabsTab />],
    ['TextButton', <TextButtonTab />],
    ['Text', <TextTab />],
    ['Toggle', <ToggleTab togglePermitted={togglePermitted} toggleValue={toggleValue} />]
  ]

  return (
    <View>
      <View>
        <Snow.Label>App Level entities</Snow.Label>
        <Snow.Text>App, FillView, SafeArea, useStyleContext, useFocusContext.</Snow.Text>
        <Snow.Label>Components</Snow.Label>
        <Snow.Grid focusStart focusKey={"component-picker"} focusDown={`tab-entry`} items={components} renderItem={(item: any, itemIndex: number) => {
          return <Snow.TextButton title={item[0]} onPress={() => { setTabIndex(itemIndex) }} />
        }} />
        <Snow.Break />
      </View>
      <View>
        {components[tabIndex]?.[1]}
      </View>
    </View>
  )
}

export default function App() {
  return (
    <Snow.App snowStyle={styleOverrides} DEBUG_FOCUS={false}>
      <AppPage />
    </Snow.App>
  );
}

