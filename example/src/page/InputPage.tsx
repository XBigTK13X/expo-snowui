import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function InputPage() {
  const [inputValue, setInputValue] = React.useState('')

  return (
    <View>
      <Snow.Label>Component: Input</Snow.Label>
      <Snow.Input focusKey="tab-entry" value={inputValue} onValueChange={setInputValue} />
    </View>
  )
}