import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function ModalPage() {

  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
  const [showFullscreen, setShowFullscreen] = React.useState(false)
  const toggleFullscreen = () => { setShowFullscreen(!showFullscreen) }

  let modal = null
  if (showModal) {
    modal = (
      <Snow.Modal focusLayer={'example-modal'} scroll onRequestClose={toggleModal}>
        <Snow.TextButton focusStart focusKey="tab-entry" focusDown="modal-target" title="Close" onPress={toggleModal} />
        <Snow.Text>Hi, I am a modal.</Snow.Text>
        <View style={{ height: 1000 }}>
          <Snow.Text>There should be scrolling.</Snow.Text>
        </View>
        <Snow.Text>And a focusable blank target</Snow.Text>
        <Snow.Target focusKey="modal-target" focusDown="modal-bottom" />
        <Snow.Text>And then the end</Snow.Text>
        <Snow.TextButton focusKey="modal-bottom" title="Close" onPress={toggleModal} />
      </Snow.Modal>
    )
  }

  if (showFullscreen) {
    modal = (
      <Snow.Modal assignFocus={false} onRequestClose={toggleFullscreen}>
        <Snow.FillView style={{ backgroundColor: 'green' }}>
          <Snow.Text>This should be fullscreen with no border.</Snow.Text>
        </Snow.FillView>
        <Snow.Overlay
          focusStart
          focusKey="fullscreen-overlay"
          focusLayer="fullscreen-modal"
          onPress={toggleFullscreen} />
      </Snow.Modal>
    )
  }

  return (
    <View>
      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton focusKey="tab-entry" focusDown="modal-two" title="Show Modal" onPress={toggleModal} />
      <Snow.TextButton focusKey="modal-two" title="Test Fullscreen" onPress={toggleFullscreen} />
      {modal}
    </View>
  )
}