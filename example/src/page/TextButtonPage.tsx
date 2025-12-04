import Snow from 'expo-snowui'

export default function TextButtonPage() {

  return (
    <>
      <Snow.Label>Component: TextButton</Snow.Label>
      <Snow.Grid focusKey="tab-entry" itemsPerRow={3}>
        <Snow.TextButton title="I am a button" />
        <Snow.TextButton title="I am a button with so much text. Like how is there so much text in here!" />
        <Snow.TextButton title="This button will maybe overflow. The amount of text is reaching absurd levels. Can it get dotted? This button will maybe overflow. The amount of text is reaching absurd levels. Can it get dotted? This button will maybe overflow. The amount of text is reaching absurd levels. Can it get dotted? This button will maybe overflow. The amount of text is reaching absurd levels. Can it get dotted?" />
        <Snow.TextButton short title="Shorty" />
      </Snow.Grid>
    </>
  )
}
