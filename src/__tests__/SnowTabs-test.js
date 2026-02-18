import { StyleSheet } from 'react-native';

import {
  act,
  render,
  focusedColor,
  getFocusEngine
} from './test-utils';

import SnowTabs from '../component/wired/snow-tabs'
import SnowGrid from '../component/wired/snow-grid'
import SnowTextButton from '../component/wired/snow-text-button'


const TwoGrids = (props) => {
  return (
    <SnowTabs focusStart focusKey="grid-tabs" headers={["First Grid", "Second Grid"]} >
      <SnowGrid
        itemsPerRow={1}
        itemsPerPage={1}
      >
        <SnowTextButton title="One Cell 0.1" />
        <SnowTextButton title="One Cell 1.1" />
        <SnowTextButton title="One Cell 2.1" />
      </SnowGrid>
      <SnowGrid
        itemsPerRow={1}
        itemsPerPage={1}
      >
        <SnowTextButton title="Two Cell 0.1" />
        <SnowTextButton title="Two Cell 1.1" />
        <SnowTextButton title="Two Cell 2.1" />
      </SnowGrid>
    </SnowTabs >
  )
}

describe('SnowTabs', () => {
  describe('Internal Movement', () => {
    describe('Tabs', () => {
      test('First tab is focused on first render', async () => {
        const { getByTestId } = render(<TwoGrids />, {});

        const targetKey = 'grid-tabs'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })

      test('Second tab is focused after moving R', async () => {
        const { getByTestId } = render(<TwoGrids />, {});

        act(() => {
          getFocusEngine().moveFocusRight()
        })

        const targetKey = 'grid-tabs-grid-end'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })
    })
  })
})


