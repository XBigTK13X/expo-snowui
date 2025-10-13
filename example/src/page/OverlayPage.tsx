import React from 'react'
import { View } from 'react-native'
import Snow from 'expo-snowui'

export default function OverlayPage() {
  const { showModal, hideModal, enableOverlay, disableOverlay } = Snow.useLayerContext()

  const [hasOverlay, setHasOverlay] = React.useState(false)
  const [showFullscreen, setShowFullscreen] = React.useState(false)

  React.useEffect(() => {
    if (hasOverlay) {
      enableOverlay({
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
      showModal({
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
      enableOverlay({
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
      disableOverlay()
      hideModal()
    }
  }, [showFullscreen, hasOverlay])

  if (!hasOverlay) {
    return (
      <View>
        <Snow.TextButton
          focusStart
          focusKey="tab-entry"
          title="Toggle Overlay"
          onPress={() => { setHasOverlay(true) }}
        />
      </View>
    )
  }
  return (
    <View>
      <Snow.Text>There is now an invisible overlay over the app.</Snow.Text>
      <Snow.Text>If you press ENTER or click the screen, a modal will display with a different overlay.</Snow.Text>
    </View>
  )

}