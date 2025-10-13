import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function ModalPage() {
  const { showModal, hideModal, enableOverlay, disableOverlay } = Snow.useLayerContext()

  const [showExample, setShowExample] = React.useState(false)
  const toggleModal = () => { setShowExample(!showExample) }
  const [showFullscreen, setShowFullscreen] = React.useState(false)
  const toggleFullscreen = () => { setShowFullscreen(!showFullscreen) }
  const [showInputs, setShowInputs] = React.useState(false)
  const toggleInputs = () => { setShowInputs(!showInputs) }
  const [textInput, setTextInput] = React.useState('')

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

  React.useEffect(() => {
    const hasModal = showExample || showFullscreen || showInputs
    if (showExample) {
      showModal({ render: RegularModal, props: { focusLayer: 'example-modal', scroll: true, onRequestClose: toggleModal } })
    }
    if (showFullscreen) {
      showModal({ render: FullscreenModal, props: { assignFocus: false, onRequestClose: toggleFullscreen } })
    }
    if (showInputs) {
      showModal({ render: InputsModal, props: { focusLayer: 'inputs-modal', onRequestClose: toggleInputs } })
    }
    return () => {
      if (hasModal) {
        hideModal()
      }
    }
  }, [showExample, showFullscreen, showInputs, textInput])

  return (
    <View>
      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton focusKey="tab-entry" focusDown="modal-two" title="Show Modal" onPress={toggleModal} />
      <Snow.TextButton focusKey="modal-two" focusDown="modal-three" title="Test Fullscreen" onPress={toggleFullscreen} />
      <Snow.TextButton focusKey="modal-three" title="Inputs" onPress={toggleInputs} />
    </View>
  )
}