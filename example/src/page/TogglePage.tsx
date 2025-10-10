import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function TogglePage() {

  const [toggleValue, setToggleValue] = React.useState(false)
  const togglePermitted = () => { setToggleValue(!toggleValue) }
  return (
    <View>
      <Snow.Label>Component: Toggle</Snow.Label>
      <Snow.Toggle focusKey="tab-entry" title="Permitted" onValueChange={togglePermitted} value={toggleValue} />
    </View>
  )
}