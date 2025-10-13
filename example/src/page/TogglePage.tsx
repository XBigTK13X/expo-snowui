import React from 'react'
import Snow from 'expo-snowui'

export default function TogglePage() {

  const [toggleValue, setToggleValue] = React.useState(false)
  const togglePermitted = () => { setToggleValue(!toggleValue) }
  return (
    <>
      <Snow.Label>Component: Toggle</Snow.Label>
      <Snow.Toggle focusKey="tab-entry" title="Permitted" onValueChange={togglePermitted} value={toggleValue} />
    </>
  )
}