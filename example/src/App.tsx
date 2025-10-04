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
    hoverDark: 'rgba(23, 116, 92, 1)',
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
  Snow.useFocusLayer('tab-dropdown')
  const [form, setForm] = React.useState<any>({
    playerChoice: 0,
    alwaysTranscode: 0,
    audioCompression: 0,
    hardwareDecoder: 0,
    fastMpv: 0
  })
  const changeForm = (key: string) => {
    return (val: any) => {
      setForm((prev: any) => {
        let result = { ...prev }
        result[key] = val
        return result
      })
    }
  }
  return (
    <View>
      <Snow.Label>Component: Dropdown</Snow.Label>
      <Snow.Dropdown
        focusKey="tab-entry"
        focusDown="player-choice"
        options={['Yes', 'No']}
        valueIndex={props.dropdownIndex}
        onValueChange={props.setDropdownIndex} />
      <Snow.Break />
      <Snow.Dropdown
        focusKey="player-choice"
        focusDown="always-transcode"
        title="Always Use Player"
        options={['MPV', 'EXO']}
        onValueChange={changeForm('playerChoice')}
        valueIndex={form.playerChoice} />
      <Snow.Grid assignFocus={false} itemsPerRow={2}>
        <Snow.Dropdown
          focusKey="always-transcode"
          focusDown="hardware-decoder"
          focusRight="audio-compression"
          title="Always Transcode"
          options={['No', 'Yes']}
          onValueChange={changeForm('alwaysTranscode')}
          valueIndex={form.alwaysTranscode} />
        <Snow.Dropdown
          focusKey="audio-compression"
          focusDown="fast-mpv"
          title="Audio Compression (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('audioCompression')}
          valueIndex={form.audioCompression} />
        <Snow.Dropdown
          focusKey="hardware-decoder"
          focusRight="fast-mpv"
          title="Hardware Decoder (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('hardwareDecoder')}
          valueIndex={form.hardwareDecoder} />
        <Snow.Dropdown
          focusKey="fast-mpv"
          title="Fast Config (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('fastMpv')}
          valueIndex={form.fastMpv} />
      </Snow.Grid>
    </View>
  )
}

function GridTab() {
  Snow.useFocusLayer('tab-grid')
  return (
    <View>
      <Snow.Label>Component: Grid</Snow.Label>
      <Snow.Grid
        focusKey="tab-entry"
        items={['Allow', 'Block', 'Cancel']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
      <Snow.Grid
        focusKey="inferred-test"
        focusUp="tab-entry"
        focusDown="child-key-test"
        items={['Should', 'Be', 'Inferred']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
      <Snow.Grid>
        <Snow.TextButton focusKey='child-key-test' focusDown='paged-grid-test' title={"Button with key"} />
      </Snow.Grid>
      <Snow.TextButton title="This should never get focus" />
      <Snow.Grid
        itemsPerPage={15}
        focusKey="paged-grid-test"
        focusUp='child-key-test'
        focusDown='null-select-test'
        items={[...Array(100).keys()].slice(1)}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }}
      />
      <Snow.Grid focusKey="null-select-test">
        <Snow.TextButton title={"Nothing"} />
        <Snow.TextButton title={"Below"} />
        <Snow.TextButton title={"Here"} />
      </Snow.Grid>
    </View>
  )
}

function GridMoreTab() {
  Snow.useFocusLayer('tab-grid-more')
  const [showModal, setShowModal] = React.useState(false)

  if (showModal) {
    return (
      <View>
        <Snow.Modal focusLayer="grid-more" onRequestClose={() => { setShowModal(false) }}>
          <Snow.Label>Component: Grid</Snow.Label>
          <Snow.Grid
            focusKey="first-grid"
            focusDown="second-grid"
            items={['Allow', 'Block', 'Cancel']}
            renderItem={(item: any) => {
              return <Snow.TextButton title={item} />
            }} />
          <Snow.Break />
          <Snow.Grid
            focusStart
            focusKey="second-grid"
            items={['Important', 'Action', 'Taken']}
            renderItem={(item: any) => {
              return <Snow.TextButton title={item} />
            }} />
          <Snow.Break />
          <Snow.Grid
            focusKey="third-grid"
            focusUp="second-grid"
            items={['First', 'Second', 'Third']}
            renderItem={(item: any) => {
              return <Snow.TextButton title={item} />
            }} />
          <Snow.TextButton focusKey="tab-entry" title="Close Modal" onPress={() => { setShowModal(false) }} />
        </Snow.Modal>
      </View>
    )
  }
  return (
    <View>
      <Snow.TextButton focusKey="tab-entry" focusDown="mixed-grid" title="Show Complex Grid" onPress={() => { setShowModal(true) }} />
      <Snow.Grid
        focusKey="mixed-grid">
        <Snow.Text>No focus for me</Snow.Text>
        <Snow.TextButton title="But I will get some" />
        <Snow.Text>The third child is skipped</Snow.Text>
        <Snow.TextButton title="But the fourth gets focus" />
      </Snow.Grid>
    </View>
  )
}

function HeaderTab() {
  Snow.useFocusLayer('tab-header')
  return (
    <View>
      <Snow.Label>Component: Header</Snow.Label>
      <Snow.Header>This is some header text.</Snow.Header>
    </View>
  )
}

function ImageButtonTab() {
  Snow.useFocusLayer('tab-image-button')
  return (
    <View>
      <Snow.Label>Component: Image Button</Snow.Label>
      <Snow.ImageButton focusKey="tab-entry" focusDown="wide-button" imageUrl={tallImageUrl} title="Movie Poster" />
      <Snow.ImageButton focusKey="wide-button" focusUp="tab-entry" imageUrl={wideImageUrl} title="Rainbow" />
    </View>
  )
}

function ImageGridTab() {
  Snow.useFocusLayer('tab-image-grid')
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
  Snow.useFocusLayer('tab-input')
  return (
    <View>
      <Snow.Label>Component: Input</Snow.Label>
      <Snow.Input focusKey="tab-entry" value={props.inputValue} onValueChange={props.setInputValue} />
    </View>
  )
}

function LabelTab() {
  Snow.useFocusLayer('tab-label')
  return (
    <View>
      <Snow.Label>Component: Label</Snow.Label>
      <Snow.Label>This is some label text</Snow.Label>
    </View>
  )
}


function ModalTab() {
  Snow.useFocusLayer('tab-modal')
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
  const [showFullscreen, setShowFullscreen] = React.useState(false)
  const toggleFullscreen = () => { setShowFullscreen(!showFullscreen) }
  if (showModal) {
    return (
      <Snow.Modal focusLayer={'example-modal'} scroll onRequestClose={toggleModal}>
        <Snow.TextButton focusStart focusKey="tab-entry" focusDown="modal-bottom" title="Close" onPress={toggleModal} />
        <Snow.Text>Hi, I am a modal.</Snow.Text>
        <View style={{ height: 1000 }}>
          <Snow.Text>There should be scrolling.</Snow.Text>
        </View>
        <Snow.Text>And then the end</Snow.Text>
        <Snow.TextButton focusKey="modal-bottom" title="Close" onPress={toggleModal} />
      </Snow.Modal>
    )
  }
  if (showFullscreen) {
    return (
      <Snow.Modal assignFocus={false}>
        <Snow.FillView style={{ backgroundColor: 'green' }}>
          <Snow.Text>This should be fullscreen with no border.</Snow.Text>
        </Snow.FillView>
        <Snow.Overlay focusKey="fullscreen-overlay" focusLayer="fullscreen-modal" onPress={toggleFullscreen}>
        </Snow.Overlay>
      </Snow.Modal>
    )
  }
  return (
    <View>
      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton focusKey="tab-entry" focusDown="modal-two" title="Show Modal" onPress={toggleModal} />
      <Snow.TextButton focusKey="modal-two" title="Test Fullscreen" onPress={toggleFullscreen} />
    </View>
  )
}

function OverlayTab() {
  Snow.useFocusLayer('tab-overlay')
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
  const [showOverlay, setShowOverlay] = React.useState(false)
  const toggleOverlay = () => { setShowOverlay(!showOverlay) }

  if (showModal) {
    return (
      <Snow.Modal assignFocus={false}>
        <Snow.Text>There is a hidden overlay covering the screen.</Snow.Text>
        <Snow.Overlay focusLayer="hidden-overlay" focusStart focusKey="toggle-modal" title="Close Layers" onPress={() => {
          toggleModal()
          toggleOverlay()
        }} />
      </Snow.Modal>
    )
  }

  if (showOverlay) {
    return (
      <Snow.Overlay
        focusStart
        focusKey="overlay"
        focusLayer="overlay"
        onPress={toggleModal}
      />
    )
  }
  return (
    <Snow.TextButton focusStart focusKey="tab-entry" title="Toggle Overlay" onPress={toggleOverlay} />
  )
}

function RangeSliderTab(props: any) {
  Snow.useFocusLayer('tab-range-slider')
  return (
    <View>
      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.RangeSlider focusKey="tab-entry" onValueChange={props.setRangeSliderValue} percent={props.rangeSliderValue} />
    </View>
  )
}

function TabsTab() {
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

function TabsMoreTab() {
  Snow.useFocusLayer('tab-tabs-more')
  return (
    <View>
      <Snow.Label>Component: Tabs</Snow.Label>
      <Snow.Tabs focusKey="tab-entry" headers={["First", "Second", "Third"]}>
        <Snow.ImageGrid
          items={imageItems}
          getItemImageUrl={(item: any) => { return item.imageUrl }}
          getItemImageSource={(item: any) => { return item.imageSource }}
          getItemName={(item: any) => { return item.title }}
        />
        <Snow.ImageGrid
          items={imageItems}
          getItemImageUrl={(item: any) => { return item.imageUrl }}
          getItemImageSource={(item: any) => { return item.imageSource }}
          getItemName={(item: any) => { return item.title }}
        />
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
  Snow.useFocusLayer('tab-text-button')
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
  Snow.useFocusLayer('tab-text')
  return (
    <View>
      <Snow.Label>Component: Text</Snow.Label>
      <Snow.Text>Hello there snowui. This is some text</Snow.Text>
    </View>
  )
}

function ToggleTab(props: any) {
  Snow.useFocusLayer('tab-toggle')
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
    ['Grid More', <GridMoreTab />],
    ['Header', <HeaderTab />],
    ['ImageButton', <ImageButtonTab />],
    ['ImageGrid', <ImageGridTab />],
    ['Input', <InputTab inputValue={inputValue} setInputValue={setInputValue} />],
    ['Label', <LabelTab />],
    ['Modal', <ModalTab />],
    ['Overlay', <OverlayTab />],
    ['Range Slider', <RangeSliderTab setRangeSliderValue={setRangeSliderValue} rangeSliderValue={rangeSliderValue} />],
    ['Tabs', <TabsTab />],
    ['TabsMore', <TabsMoreTab />],
    ['TextButton', <TextButtonTab />],
    ['Text', <TextTab />],
    ['Toggle', <ToggleTab togglePermitted={togglePermitted} toggleValue={toggleValue} />]
  ]

  return (
    <Snow.View>
      <Snow.View>
        <Snow.TextButton focusKey="test-higher-focus" focusDown="component-picker" title="Focus Test Button" />
        <Snow.Label>App Level entities</Snow.Label>
        <Snow.Text>App, FillView, SafeArea, useStyleContext, useFocusContext.</Snow.Text>
        <Snow.Label>Components</Snow.Label>
        <Snow.Grid
          focusStart
          focusKey={"component-picker"}
          focusDown={`tab-entry`}
          items={components}
          renderItem={(item: any, itemIndex: number) => {
            return <Snow.TextButton title={item[0]} onPress={() => { setTabIndex(itemIndex) }} />
          }} />
        <Snow.Break />
      </Snow.View>
      <Snow.View>
        {components[tabIndex]?.[1]}
      </Snow.View>
    </Snow.View>
  )
}

export default function App() {
  return (
    <Snow.App snowStyle={styleOverrides} DEBUG_FOCUS={false}>
      <AppPage />
    </Snow.App>
  );
}

