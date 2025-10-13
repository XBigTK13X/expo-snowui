import React from 'react'
import Snow from 'expo-snowui'

export default function InputPage() {
  const [inputValue, setInputValue] = React.useState('')

  return (
    <>
      <Snow.Label>Component: Input</Snow.Label>
      <Snow.Input focusKey="tab-entry" value={inputValue} onValueChange={setInputValue} />
    </>
  )
}