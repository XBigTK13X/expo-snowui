import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

const RegularModal = (props) => {
  return (
    <Snow.View>
      <Snow.TextButton
        focusStart
        focusKey="modal-entry"
        title="Close"
        onPress={props.closeModal} />
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
        onPress={props.closeModal} />
    </Snow.View>
  )
}

const HubModal = (props) => {
  const { sendHubData, useHubState } = Snow.useSnowContext()
  const trackIndex = useHubState((state) => state?.trackIndex ?? 0)
  const streamUrl = useHubState((state) => state?.streamUrl ?? 'None')

  const handleNextTrack = () => {
    sendHubData((previousState) => {
      const currentTrackIndex = previousState?.trackIndex ?? 0
      const nextIndex = currentTrackIndex + 1
      return {
        ...previousState,
        trackIndex: nextIndex,
        streamUrl: `https://stream.local/play?track=${nextIndex}`
      }
    }, 'trackChanged')
  }

  return (
    <Snow.View>
      <Snow.Label>Hub Modal (Live State)</Snow.Label>
      <Snow.Text>Current Track: {trackIndex}</Snow.Text>
      <Snow.Text>Active URL: {streamUrl}</Snow.Text>

      <Snow.TextButton
        focusStart
        focusKey="hub-mutate"
        title="Next Track (Mutate Upward)"
        onPress={handleNextTrack} />

      <Snow.TextButton
        focusKey="hub-close"
        title="Close"
        onPress={props.closeModal} />
    </Snow.View>
  )
}

const FullscreenModal = (props) => {
  React.useEffect(() => {
    props.openOverlay({
      props: {
        focusStart: true,
        focusKey: "fullscreen-overlay",
        onPress: props.closeModal
      }
    })
    return props.closeOverlay
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

const InputsModal = (props) => {
  const [textInput, setTextInput] = React.useState('')
  return (
    <>
      <Snow.TextButton
        focusStart
        focusKey="close-button"
        title="Close Modal"
        onPress={props.closeModal}
      />
      <Snow.Input
        focusStart
        focusKey="modal-input"
        value={textInput}
        onValueChange={setTextInput} />
    </>
  )
}

const NestedModal = (props) => {
  React.useEffect(() => {
    props.pushModal({
      render: () => {
        return (
          <>
            <Snow.Text>This is the second layer of modal. Should be on top.</Snow.Text>
            <Snow.TextButton
              focusStart
              focusKey="close-top-button"
              title="Close Top"
              onPress={() => {
                props.closeModal()
                props.clearModals()
              }} />
          </>
        )
      },
      props: {
        focusStart: true,
        center: true,
        obscure: true,
        onRequestClose: props.closeModal
      }
    })
  }, [])
  return (
    <>
      <Snow.Text>This is the first layer of modal. Should be on bottom.</Snow.Text>
      <Snow.TextButton focusStart focusKey="close-bottom-button" title="Close Bottom" onPress={() => { props.closeModal(); props.clearModals(); }} />
    </>
  )
}

export default function ModalPage(props) {
  const {
    pushModal,
    popModal,
    clearModals,
    openOverlay,
    closeOverlay
  } = Snow.useLayerContext()
  const {
    currentRoute,
    navUpdate,
    navRemove
  } = Snow.useNavigationContext()
  const {
    sendHubData,
    resetHub,
    useHubState
  } = Snow.useSnowContext()

  const streamUrl = useHubState((state) => state?.streamUrl)

  const setModal = (modalName) => {
    if (modalName) {
      navUpdate({
        activeModal: modalName,
        focusedHash: null
      })
    }
    else {
      navRemove('activeModal')
    }
  }

  const closeModal = () => {
    setModal(null)
  }

  const openHubModal = () => {
    sendHubData({
      trackIndex: 1,
      streamUrl: 'https://stream.local/play?track=1'
    }, 'trackChanged')
    setModal('hub')
  }

  React.useEffect(() => {
    const activeModal = currentRoute?.routeParams?.activeModal
    let Modal = null

    if (activeModal === 'regular') {
      Modal = RegularModal
    }
    if (activeModal === 'hub') {
      Modal = HubModal
    }
    if (activeModal === 'fullscreen') {
      Modal = FullscreenModal
    }
    if (activeModal === 'inputs') {
      Modal = InputsModal
    }
    if (activeModal === 'nested') {
      Modal = NestedModal
    }
    if (Modal) {
      pushModal({
        render: (modalProps) => { return <Modal {...modalProps} /> },
        props: {
          scroll: true,
          onRequestClose: closeModal,
          clearModals,
          openOverlay,
          closeOverlay,
          closeModal,
          pushModal
        }
      })
    }
    return () => {
      if (activeModal) {
        popModal()
        if (activeModal === 'hub') {
          resetHub()
        }
      }
    }
  }, [currentRoute?.routeParams?.activeModal])

  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Modal</Snow.Label>

      {streamUrl && (
        <Snow.Text>Hub URL in Screen: {streamUrl}</Snow.Text>
      )}

      <Snow.TextButton
        focusKey="tab-entry"
        focusStart
        title="Show Modal"
        onPress={() => { setModal('regular') }} />
      <Snow.TextButton
        focusKey="modal-hub"
        title="Hub Modal"
        onPress={openHubModal} />
      <Snow.TextButton
        focusKey="modal-two"
        title="Test Fullscreen"
        onPress={() => { setModal('fullscreen') }} />
      <Snow.TextButton
        focusKey="modal-three"
        title="Inputs"
        onPress={() => { setModal('inputs') }} />
      <Snow.TextButton
        focusKey="nested-modal"
        title="Nested"
        onPress={() => { setModal('nested') }} />
    </Snow.View>
  )
}