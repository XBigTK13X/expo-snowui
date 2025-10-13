import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function ModalPage() {
  const { pushModal, popModal, enableOverlay, disableOverlay } = Snow.useLayerContext()

  const [showExample, setShowExample] = React.useState(false)
  const toggleModal = () => { setShowExample(!showExample) }

  const [showFullscreen, setShowFullscreen] = React.useState(false)
  const toggleFullscreen = () => { setShowFullscreen(!showFullscreen) }

  const [showInputs, setShowInputs] = React.useState(false)
  const toggleInputs = () => { setShowInputs(!showInputs) }
  const [textInput, setTextInput] = React.useState('')

  const [showNested, setShowNested] = React.useState(false)
  const toggleNested = () => { setShowNested(!showNested) }

  const RegularModal = () => {
    return (
      <Snow.View>
        <Snow.TextButton focusStart focusKey="tab-entry" focusDown="modal-target" title="Close" onPress={toggleModal} />
        <Snow.Text>Hi, I am a modal.</Snow.Text>
        <View style={{ height: 1000 }}>
          <Snow.Text>There should be scrolling.</Snow.Text>
        </View>
        <Snow.Text>And a focusable blank target</Snow.Text>
        <Snow.Target focusKey="modal-target" focusDown="modal-bottom" />
        <Snow.Text>And then the end</Snow.Text>
        <Snow.TextButton focusKey="modal-bottom" title="Close" onPress={toggleModal} />
      </Snow.View>
    )
  }

  const FullscreenModal = () => {
    React.useEffect(() => {
      enableOverlay({
        props: {
          focusStart: true,
          focusKey: "fullscreen-overlay",
          focusLayer: "fullscreen-modal",
          onPress: toggleFullscreen
        }
      })
      return disableOverlay
    }, [])

    return (
      <Snow.FillView style={{ backgroundColor: 'green' }}>
        <Snow.Text>This should be fullscreen with no border.</Snow.Text>
      </Snow.FillView>
    )
  }

  const InputsModal = () => {
    return (
      <Snow.View>
        <Snow.TextButton
          focusStart
          focusKey="close-button"
          focusDown="modal-input"
          title="Close Modal"
          onPress={toggleInputs}
        />
        <Snow.Input focusKey="modal-input" value={textInput} onValueChange={setTextInput} />
      </Snow.View>
    )
  }

  const NestedModal = () => {
    console.log("NEsted")
    React.useEffect(() => {
      pushModal({
        render: () => {
          return (
            <Snow.View>
              <Snow.Text>This is the second layer of modal. Should be on top.</Snow.Text>
              <Snow.TextButton focusStart focusKey="close-nested-button" title="Close Nested" onPress={() => { setShowNested(false) }} />
            </Snow.View>
          )
        },
        props: {
          focusLayer: 'nested-controls',
          focusStart: true
        }
      })
      return () => {
        popModal()
      }
    }, [])
    return (
      <Snow.View>
        <Snow.Text>This is the first layer of modal. Should be on the bottom.</Snow.Text>
      </Snow.View>
    )
  }

  React.useEffect(() => {
    const hasModal = showExample || showFullscreen || showInputs || showNested
    if (showExample) {
      pushModal({ render: RegularModal, props: { focusLayer: 'example-modal', scroll: true, onRequestClose: toggleModal } })
    }
    if (showFullscreen) {
      pushModal({ render: FullscreenModal, props: { assignFocus: false, onRequestClose: toggleFullscreen } })
    }
    if (showInputs) {
      pushModal({ render: InputsModal, props: { focusLayer: 'inputs-modal', onRequestClose: toggleInputs } })
    }
    if (showNested) {
      pushModal({ render: NestedModal, props: { focusLayer: 'nested-modal', onRequestClose: () => { setShowNested(false) } } })
    }
    return () => {
      if (hasModal) {
        popModal()
      }
    }
  }, [showExample, showFullscreen, showInputs, showNested, textInput])

  return (
    <View>
      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton focusKey="tab-entry" focusDown="modal-two" title="Show Modal" onPress={toggleModal} />
      <Snow.TextButton focusKey="modal-two" focusDown="modal-three" title="Test Fullscreen" onPress={toggleFullscreen} />
      <Snow.TextButton focusKey="modal-three" title="Inputs" onPress={toggleInputs} />
      <Snow.TextButton focusKey="nested-modal" title="Nested Modal" onPress={toggleNested} />
    </View>
  )
}