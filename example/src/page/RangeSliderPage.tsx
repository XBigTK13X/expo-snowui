import React from 'react'
import Snow from 'expo-snowui'

export default function RangeSliderPage() {
  const [rangeSliderValue, setRangeSliderValue] = React.useState(0.5)

  return (
    <>
      <Snow.Label>Component: Range Slider</Snow.Label>
      <Snow.Target focusKey="tab-entry" focusDown="range-slider" />
      <Snow.RangeSlider focusKey="range-slider" onValueChange={setRangeSliderValue} percent={rangeSliderValue} />
    </>
  )
}
