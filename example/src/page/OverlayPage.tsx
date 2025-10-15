import React from 'react'
import Snow from 'expo-snowui'

export default function OverlayPage() {
  const { pushModal, popModal, openOverlay, closeOverlay } = Snow.useLayerContext()

  const [hasOverlay, setHasOverlay] = React.useState(false)
  const [showFullscreen, setShowFullscreen] = React.useState(false)

  React.useEffect(() => {
    if (hasOverlay) {
      openOverlay({
        props: {
          focusStart: true,
          focusKey: "overlay",
          focusLayer: "overlay",
          onPress: () => {
            setShowFullscreen(true)
          }
        }
      })
    }
  }, [hasOverlay])

  React.useEffect(() => {
    if (showFullscreen) {
      pushModal({
        props: {
          assignFocus: false,
          onRequestClose: () => { setShowFullscreen(false) }
        },
        render: () => {
          return (
            <Snow.View>
              <Snow.Text>This modal is covered by an invisible overlay.</Snow.Text>
              <Snow.Text>If you press ENTER for click the screen, this modal will dismiss.</Snow.Text>
            </Snow.View>
          )
        }
      })
      openOverlay({
        props: {
          focusLayer: "hidden-overlay",
          focusStart: true,
          focusKey: "toggle-modal",
          onPress: () => {
            setHasOverlay(false)
            setShowFullscreen(false)
          }
        }
      })
    }
  }, [showFullscreen])

  React.useEffect(() => {
    if (!showFullscreen && !hasOverlay) {
      closeOverlay()
      popModal()
    }
  }, [showFullscreen, hasOverlay])

  if (!hasOverlay) {
    return (
      <>
        <Snow.TextButton
          focusStart
          focusKey="tab-entry"
          title="Toggle Overlay"
          onPress={() => { setHasOverlay(true) }}
        />
      </>
    )
  }
  return (
    <>
      <Snow.Text>There is now an invisible overlay over the app.</Snow.Text>
      <Snow.Text>If you press ENTER or click the screen, a modal will display with a different overlay.</Snow.Text>
    </>
  )

}