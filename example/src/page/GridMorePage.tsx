import React from 'react'
import { View } from 'react-native'
import Snow from 'expo-snowui'

export default function GridMorePage() {
  Snow.useFocusLayer('tab-grid-more')
  const [showModal, setShowModal] = React.useState(false)

  if (showModal) {
    return (
      <View>
        <Snow.Modal focusLayer="grid-more" onRequestClose={() => { setShowModal(false) }}>
          <Snow.Label>Component: Grid</Snow.Label>
          <Snow.Grid
            focusKey="first-grid"
            focusDown="second-grid"
            items={['Allow', 'Block', 'Cancel']}
            renderItem={(item: any) => {
              return <Snow.TextButton title={item} />
            }} />
          <Snow.Break />
          <Snow.Grid
            focusStart
            focusKey="second-grid"
            items={['Important', 'Action', 'Taken']}
            renderItem={(item: any) => {
              return <Snow.TextButton title={item} />
            }} />
          <Snow.Break />
          <Snow.Grid
            focusKey="third-grid"
            focusUp="second-grid"
            items={['First', 'Second', 'Third']}
            renderItem={(item: any) => {
              return <Snow.TextButton title={item} />
            }} />
          <Snow.TextButton focusKey="tab-entry" title="Close Modal" onPress={() => { setShowModal(false) }} />
        </Snow.Modal>
      </View>
    )
  }
  return (
    <View>
      <Snow.TextButton focusKey="tab-entry" focusDown="mixed-grid" title="Show Complex Grid" onPress={() => { setShowModal(true) }} />
      <Snow.Grid
        focusKey="mixed-grid">
        <Snow.Text>No focus for me</Snow.Text>
        <Snow.TextButton title="But I will get some" />
        <Snow.Text>The third child is skipped</Snow.Text>
        <Snow.TextButton title="But the fourth gets focus" />
      </Snow.Grid>
    </View>
  )
}
