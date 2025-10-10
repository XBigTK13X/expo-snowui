import React from 'react'
import { View } from 'react-native'
import Snow from 'expo-snowui'

export default function DropdownPage() {
  const [dropdownIndex, setDropdownIndex] = React.useState(0)

  const [form, setForm] = React.useState({
    playerChoice: 0,
    alwaysTranscode: 0,
    audioCompression: 0,
    hardwareDecoder: 0,
    fastMpv: 0
  })
  const changeForm = (key: string) => {
    return (val: any) => {
      setForm((prev: any) => {
        let result = { ...prev }
        result[key] = val
        return result
      })
    }
  }
  return (
    <View>
      <Snow.Label>Component: Dropdown</Snow.Label>
      <Snow.Dropdown
        focusKey="tab-entry"
        focusDown="player-choice"
        options={['Yes', 'No']}
        valueIndex={dropdownIndex}
        onValueChange={setDropdownIndex} />
      <Snow.Break />
      <Snow.Dropdown
        focusKey="player-choice"
        focusDown="always-transcode"
        title="Always Use Player"
        options={['MPV', 'EXO']}
        onValueChange={changeForm('playerChoice')}
        valueIndex={form.playerChoice} />
      <Snow.Grid assignFocus={false} itemsPerRow={2}>
        <Snow.Dropdown
          focusKey="always-transcode"
          focusDown="hardware-decoder"
          focusRight="audio-compression"
          title="Always Transcode"
          options={['No', 'Yes']}
          onValueChange={changeForm('alwaysTranscode')}
          valueIndex={form.alwaysTranscode} />
        <Snow.Dropdown
          focusKey="audio-compression"
          focusDown="fast-mpv"
          title="Audio Compression (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('audioCompression')}
          valueIndex={form.audioCompression} />
        <Snow.Dropdown
          focusKey="hardware-decoder"
          focusRight="fast-mpv"
          title="Hardware Decoder (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('hardwareDecoder')}
          valueIndex={form.hardwareDecoder} />
        <Snow.Dropdown
          focusKey="fast-mpv"
          title="Fast Config (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('fastMpv')}
          valueIndex={form.fastMpv} />
      </Snow.Grid>
    </View>
  )
}
