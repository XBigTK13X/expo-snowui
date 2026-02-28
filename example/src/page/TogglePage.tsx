import React from 'react'
import Snow from 'expo-snowui'

export default function TogglePage(props: any) {

  const [toggleValue, setToggleValue] = React.useState(false)
  const togglePermitted = () => { setToggleValue(!toggleValue) }
  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Toggle</Snow.Label>
      <Snow.Toggle focusKey="tab-entry" title="Permitted" onValueChange={togglePermitted} value={toggleValue} />
    </Snow.View>
  )
}