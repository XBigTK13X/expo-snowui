import React from 'react'
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
    <>
      <Snow.Label>Component: Dropdown</Snow.Label>
      <Snow.Dropdown
        yy={0}
        options={['Yes', 'No']}
        valueIndex={dropdownIndex}
        onValueChange={setDropdownIndex} />
      <Snow.Break />
      <Snow.Dropdown
        yy={1}
        title="Always Use Player"
        options={['MPV', 'EXO']}
        onValueChange={changeForm('playerChoice')}
        valueIndex={form.playerChoice} />
      <Snow.Grid yy={2} itemsPerRow={2}>
        <Snow.Dropdown
          title="Always Transcode"
          options={['No', 'Yes']}
          onValueChange={changeForm('alwaysTranscode')}
          valueIndex={form.alwaysTranscode} />
        <Snow.Dropdown
          title="Audio Compression (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('audioCompression')}
          valueIndex={form.audioCompression} />
        <Snow.Dropdown
          title="Hardware Decoder (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('hardwareDecoder')}
          valueIndex={form.hardwareDecoder} />
        <Snow.Dropdown
          title="Fast Config (mpv)"
          options={['No', 'Yes']}
          onValueChange={changeForm('fastMpv')}
          valueIndex={form.fastMpv} />
      </Snow.Grid>
    </>
  )
}
