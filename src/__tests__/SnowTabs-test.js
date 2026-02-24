import { StyleSheet } from 'react-native';

import {
  act,
  render,
  focusedColor,
  getFocusEngine,
  runActions
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
      test('1.1) First tab is focused on first render', async () => {
        const { getByTestId } = render(<TwoGrids />, {});

        const targetKey = 'grid-tabs'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })

      test('1.2) Second tab is focused after moving R', async () => {
        const { getByTestId } = render(<TwoGrids />, {});

        await runActions(act, ['R'])

        const targetKey = 'grid-tabs-grid-end'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })
    })

    describe('Grid Pager', () => {
      test("2.1) First tab's pager gets focus after using second tab's pager", async () => {
        const { getByTestId } = render(<TwoGrids />, {});

        await runActions(act, ['R', 'P', 'D', 'P', 'P', 'U', 'L', 'P'])

        const targetKey = 'grid-tabs'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })

      test("2.2) Second tab changed to second page keeps first tab on first page", async () => {
        const { getByTestId } = render(<TwoGrids />, {});

        await runActions(act, ['R', 'P', 'D', 'P', 'P', 'U', 'L', 'P'])

        const targetKey = 'page-count-grid-tabs-tab-0'

        const pageCountText = parseInt(getByTestId(targetKey).children.join(''), 10)

        expect(pageCountText).toBe(1)
      })
    })
  })
})


