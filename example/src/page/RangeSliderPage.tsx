import React from 'react'
import Snow from 'expo-snowui'
import { View } from 'react-native'

export default function RangeSliderPage() {
  const [rangeSliderValue, setRangeSliderValue] = React.useState(0.5)

  return (
    <View>
      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.Target focusKey="tab-entry" focusDown="range-slider" />
      <Snow.RangeSlider focusKey="range-slider" onValueChange={setRangeSliderValue} percent={rangeSliderValue} />
    </View>
  )
}
