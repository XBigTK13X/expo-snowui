import React from 'react'
import { View } from 'react-native'
import Snow from 'expo-snowui'

export default function OverlayPage() {

  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => { setShowModal(!showModal) }
  const [showOverlay, setShowOverlay] = React.useState(false)
  const toggleOverlay = () => { setShowOverlay(!showOverlay) }

  let modal = null
  if (showModal) {
    modal = (
      <Snow.Modal assignFocus={false}>
        <Snow.Text>There is a hidden overlay covering the screen.</Snow.Text>
        <Snow.Overlay
          focusLayer="hidden-overlay"
          focusStart
          focusKey="toggle-modal"
          onPress={() => {
            toggleModal()
            toggleOverlay()
          }} />
      </Snow.Modal>
    )
  }

  let overlay = null
  if (showOverlay) {
    overlay = (
      <View>
        <Snow.Text>There is now an invisible overlay on screen that should be focused.</Snow.Text>
        <Snow.Overlay
          focusStart
          focusKey="overlay"
          focusLayer="overlay"
          onPress={toggleModal}
        />
      </View>
    )
  }
  return (
    <View>
      <Snow.TextButton
        focusStart
        focusKey="tab-entry"
        title="Toggle Overlay"
        onPress={toggleOverlay}
      />
      {modal}
      {overlay}
    </View>
  )
}