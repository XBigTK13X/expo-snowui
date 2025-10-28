import React from 'react'
import Snow from 'expo-snowui'

export default function InputPage() {
  const [inputValue, setInputValue] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState('')

  const updateQuery = (input: any) => {
    setInputValue(input)
    setQuery(input)
  }

  const executeQuery = (input: any) => {
    setResults(`[${input}]`)
  }

  return (
    <>
      <Snow.Label>Component: Input</Snow.Label>
      <Snow.Input
        focusKey="tab-entry"
        value={inputValue}
        onValueChange={updateQuery}
        onSubmit={executeQuery}
        onDebounce={executeQuery}
      />
      <Snow.Text>Query: {query}</Snow.Text>
      <Snow.Text>Result {results}</Snow.Text>
    </>
  )
}