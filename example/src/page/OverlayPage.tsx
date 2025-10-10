import React from 'react'
import Snow from 'expo-snowui'

export default function OverlayPage() {

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