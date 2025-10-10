import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function RangeSliderPage() {
  const [rangeSliderValue, setRangeSliderValue] = React.useState(0.5)

  return (
    <View>
      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.RangeSlider focusKey="tab-entry" onValueChange={setRangeSliderValue} percent={rangeSliderValue} />
    </View>
  )
}
