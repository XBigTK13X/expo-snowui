import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function ModalPage(props: any) {
  const {
    pushModal,
    popModal,
    clearModals,
    openOverlay,
    closeOverlay
  } = Snow.useLayerContext()

  const [showExample, setShowExample] = React.useState(false)
  const toggleModal = () => { setShowExample(!showExample) }

  const [showFullscreen, setShowFullscreen] = React.useState(false)
  const toggleFullscreen = () => { setShowFullscreen(!showFullscreen) }

  const [showInputs, setShowInputs] = React.useState(false)
  const toggleInputs = () => { setShowInputs(!showInputs) }
  const [textInput, setTextInput] = React.useState('')

  const [showNested, setShowNested] = React.useState(false)
  const toggleNested = () => { setShowNested(!showNested) }

  const RegularModal = (props: any) => {
    return (
      <Snow.View>
        <Snow.TextButton
          focusStart
          focusKey="modal-entry"
          title="Close"
          onPress={toggleModal} />
        <Snow.Text>Hi, I am a modal.</Snow.Text>
        <View style={{ height: 200 }}>
          <Snow.Text>There should be scrolling.</Snow.Text>
        </View>
        <Snow.Text>And a focusable blank target</Snow.Text>
        <Snow.Target focusKey="modal-target" />
        <Snow.Text>And then the end</Snow.Text>
        <Snow.TextButton
          focusKey="modal-bottom"
          title="Close"
          onPress={toggleModal} />
      </Snow.View>
    )
  }

  const FullscreenModal = () => {
    React.useEffect(() => {
      openOverlay({
        props: {
          focusStart: true,
          focusKey: "fullscreen-overlay",
          onPress: toggleFullscreen
        }
      })
      return closeOverlay
    }, [])

    return (
      <Snow.FillView style={{ backgroundColor: 'green' }}>
        <Snow.Text>This should be fullscreen with no border.</Snow.Text>
        <Snow.Target
          focusStart
          focusKey="fullscreen-modal" />
      </Snow.FillView>
    )
  }

  const InputsModal = () => {
    return (
      <>
        <Snow.TextButton
          focusStart
          focusKey="close-button"
          title="Close Modal"
          onPress={toggleInputs}
        />
        <Snow.Input
          focusStart
          focusKey="modal-input"
          value={textInput}
          onValueChange={setTextInput} />
      </>
    )
  }

  const NestedModal = () => {
    React.useEffect(() => {
      pushModal({
        render: () => {
          return (
            <>
              <Snow.Text>This is the second layer of modal. Should be on top.</Snow.Text>
              <Snow.TextButton
                focusStart
                focusKey="close-top-button"
                title="Close Top"
                onPress={() => {
                  setShowNested(false);
                  clearModals()
                }} />
            </>
          )
        },
        props: {
          focusLayer: 'nested-controls',
          focusStart: true,
          center: true,
          obscure: true,
          onRequestClose: () => {
            setShowNested(false)
          }
        }
      })
    }, [])
    return (
      <>
        <Snow.Text>This is the first layer of modal. Should be on bottom.</Snow.Text>
        <Snow.TextButton focusStart focusKey="close-bottom-button" title="Close Bottom" onPress={() => { setShowNested(false); clearModals(); }} />
      </>
    )
  }

  React.useEffect(() => {
    const hasModal = showExample || showFullscreen || showInputs || showNested
    if (showExample) {
      pushModal({
        render: RegularModal,
        props: {
          scroll: true,
          onRequestClose: toggleModal
        }
      })
    }
    if (showFullscreen) {
      pushModal({
        render: FullscreenModal,
        props: {
          assignFocus: false,
          onRequestClose: toggleFullscreen
        }
      })
    }
    if (showInputs) {
      pushModal({
        render: InputsModal,
        props: {
          onRequestClose: toggleInputs
        }
      })
    }
    if (showNested) {
      pushModal({
        render: NestedModal,
        props: {
          focusLayer: 'nested-modal',
          onRequestClose: () => {
            setShowNested(false)
          }
        }
      })
    }
    return () => {
      if (hasModal) {
        popModal()
      }
    }
  }, [showExample, showFullscreen, showInputs, showNested])

  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Modal</Snow.Label>
      <Snow.TextButton
        focusKey="tab-entry"
        title="Show Modal"
        onPress={toggleModal} />
      <Snow.TextButton
        focusKey="modal-two"
        title="Test Fullscreen"
        onPress={toggleFullscreen} />
      <Snow.TextButton
        focusKey="modal-three"
        title="Inputs"
        onPress={toggleInputs} />
      <Snow.TextButton
        focusKey="nested-modal"
        title="Nested"
        onPress={toggleNested} />
    </Snow.View>
  )
}