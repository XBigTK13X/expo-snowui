import { View } from 'react-native'
import Snow from 'expo-snowui'

export default function GridPage() {
  Snow.useFocusLayer('tab-grid')
  return (
    <View>
      <Snow.Label>Component: Grid</Snow.Label>
      <Snow.Grid
        focusKey="tab-entry"
        items={['Allow', 'Block', 'Cancel']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
      <Snow.Grid
        focusKey="inferred-test"
        focusUp="tab-entry"
        focusDown="child-key-test"
        items={['Should', 'Be', 'Inferred']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
      <Snow.Grid>
        <Snow.TextButton focusKey='child-key-test' focusDown='paged-grid-test' title={"Button with key"} />
      </Snow.Grid>
      <Snow.TextButton title="This should never get focus" />
      <Snow.Grid
        itemsPerPage={15}
        focusKey="paged-grid-test"
        focusUp='child-key-test'
        focusDown='null-select-test'
        items={[...Array(100).keys()].slice(1)}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }}
      />
      <Snow.Grid focusKey="null-select-test">
        <Snow.TextButton title={"Nothing"} />
        <Snow.TextButton title={"Below"} />
        <Snow.TextButton title={"Here"} />
      </Snow.Grid>
    </View>
  )
}
