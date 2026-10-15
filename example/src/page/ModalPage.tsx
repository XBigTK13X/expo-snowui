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

const EnvelopeModal = (props) => {
  const { envelope, updateEnvelope } = Snow.useSnowContext()

  const handleNextTrack = () => {
    updateEnvelope((previousEnvelope) => {
      const currentTrackIndex = previousEnvelope?.trackIndex ?? 0
      const nextIndex = currentTrackIndex + 1
      return {
        ...previousEnvelope,
        trackIndex: nextIndex,
        streamUrl: `https://stream.local/play?track=${nextIndex}`
      }
    })
  }

  return (
    <Snow.View>
      <Snow.Label>Envelope Modal (Live State)</Snow.Label>
      <Snow.Text>Current Track: {envelope?.trackIndex ?? 0}</Snow.Text>
      <Snow.Text>Active URL: {envelope?.streamUrl ?? 'None'}</Snow.Text>

      <Snow.TextButton
        focusStart
        focusKey="envelope-mutate"
        title="Next Track (Mutate Upward)"
        onPress={handleNextTrack} />

      <Snow.TextButton
        focusKey="envelope-close"
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
    envelope,
    updateEnvelope,
    resetEnvelope
  } = Snow.useSnowContext()

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

  const openEnvelopeModal = () => {
    updateEnvelope({
      trackIndex: 1,
      streamUrl: 'https://stream.local/play?track=1'
    })
    setModal('envelope')
  }

  React.useEffect(() => {
    const activeModal = currentRoute?.routeParams?.activeModal
    let Modal = null

    if (activeModal === 'regular') {
      Modal = RegularModal
    }
    if (activeModal === 'envelope') {
      Modal = EnvelopeModal
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
        if (activeModal === 'envelope') {
          resetEnvelope()
        }
      }
    }
  }, [currentRoute?.routeParams?.activeModal])

  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Modal</Snow.Label>

      {envelope?.streamUrl && (
        <Snow.Text>Envelope URL in Screen: {envelope.streamUrl}</Snow.Text>
      )}

      <Snow.TextButton
        focusKey="tab-entry"
        focusStart
        title="Show Modal"
        onPress={() => { setModal('regular') }} />
      <Snow.TextButton
        focusKey="modal-envelope"
        title="Envelope Modal"
        onPress={openEnvelopeModal} />
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