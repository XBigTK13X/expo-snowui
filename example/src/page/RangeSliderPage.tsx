import React from 'react'
import Snow from 'expo-snowui'

export default function RangeSliderPage(props: any) {
  const [rangeSliderValue, setRangeSliderValue] = React.useState(0.5)

  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.Target focusKey="placeholder" />
      <Snow.RangeSlider focusKey="range" onValueChange={setRangeSliderValue} percent={rangeSliderValue} />
    </Snow.View>
  )
}
