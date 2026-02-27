import React from 'react'
import Snow from 'expo-snowui'

export default function GridPage(props: any) {
  const [clickedNumber, setClickedNumber] = React.useState(0)
  return (
    <Snow.View {...props}>
      <Snow.Label>Component: Grid</Snow.Label>
      <Snow.Grid
        focusKey="tab-entry"
        items={['Allow', 'Block', 'Cancel']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
      <Snow.Break />
      <Snow.Grid
        focusKey="inferred"
        items={['Should', 'Be', 'Inferred']}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} />
        }} />
      <Snow.Break />
      <Snow.Grid focusKey="single">
        <Snow.TextButton title={"Button with key"} />
      </Snow.Grid>
      <Snow.Break />
      <Snow.TextButton canFocus={false} title="This should never get focus" />
      <Snow.Break />
      <Snow.Text>Clicked {clickedNumber}</Snow.Text>
      <Snow.Grid
        focusKey="paged"
        itemsPerPage={15}
        itemsPerRow={4}
        items={[...Array(100).keys()].slice(1)}
        renderItem={(item: any) => {
          return <Snow.TextButton title={item} onPress={() => { setClickedNumber(item) }} />
        }}
      />
      <Snow.Break />
      <Snow.Grid focusKey="bottom">
        <Snow.TextButton title={"Nothing"} />
        <Snow.TextButton title={"Below"} />
        <Snow.TextButton title={"Here"} />
      </Snow.Grid>
    </Snow.View>
  )
}
