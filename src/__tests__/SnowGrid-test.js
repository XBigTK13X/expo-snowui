import { StyleSheet } from 'react-native';

import {
  act,
  render,
  runActions,
  focusedColor,
  getFocusEngine
} from './test-utils';

import SnowGrid from '../component/wired/snow-grid'
import SnowTextButton from '../component/wired/snow-text-button'

const OneByThreeGrid = (props) => {
  return (
    <SnowGrid
      focusStart={props.focusStart !== false}
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={1}>
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.1" />
      <SnowTextButton title="Single Cell 2.1" />
    </SnowGrid>
  )
}

const ThreeByOneGrid = (props) => {
  return (
    <SnowGrid
      focusStart={props.focusStart !== false}
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={3}>
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.1" />
      <SnowTextButton title="Single Cell 2.1" />
    </SnowGrid>
  )
}

const TwoByTwoGrid = (props) => {
  return (
    <SnowGrid
      focusStart={props.focusStart !== false}
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={2}>
      <SnowTextButton title="Single Cell 0.0" />
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.0" />
      <SnowTextButton title="Single Cell 1.1" />
    </SnowGrid>
  )
}

const ThreeByThreeGrid = (props) => {
  return (
    <SnowGrid
      focusStart={props.focusStart !== false}
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={3}>
      <SnowTextButton title="Single Cell 0.0" />
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 0.2" />
      <SnowTextButton title="Single Cell 1.0" />
      <SnowTextButton title="Single Cell 1.1" />
      <SnowTextButton title="Single Cell 1.2" />
      <SnowTextButton title="Single Cell 2.0" />
      <SnowTextButton title="Single Cell 2.1" />
      <SnowTextButton title="Single Cell 2.2" />
    </SnowGrid>
  )
}

const Surround = (props) => {
  return (
    <>
      <SnowTextButton
        focusStart={props.focusStart == 'left'}
        focusKey="left-button"
        focusRight="grid-cell"
        title="Left"
      />
      <SnowTextButton
        focusStart={props.focusStart == 'up'}
        focusKey="up-button"
        focusDown="grid-cell"
        title="Up"
      />
      {props.children}
      <SnowTextButton
        focusStart={props.focusStart == 'right'}
        focusKey="right-button"
        focusLeft="grid-cell-grid-end"
        title="Right"
      />
      <SnowTextButton
        focusStart={props.focusStart == 'down'}
        focusKey="down-button"
        focusUp="grid-cell-grid-end"
        title="Down"
      />
    </>
  )
}

const surrounded = (start) => {
  return (
    <Surround focusStart={start}>
      <TwoByTwoGrid focusStart={false} />
    </Surround>
  )
}

describe('SnowGrid', () => {

  describe('Internal Movement', () => {

    describe('Single Column', () => {

      test('1.1) Cell 0.0 [grid-cell] is focused on first render', async () => {
        const { getByTestId } = render(<OneByThreeGrid />, {});

        const targetKey = 'grid-cell'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })

      test('1.2) Cell 1.0 is focused after moving D', async () => {
        const { getByTestId } = render(<OneByThreeGrid />, {});

        await runActions(act, ['D'])

        const targetKey = 'grid-cell-row-1-column-0'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })
    })

    describe('2x2 Grid', () => {

      test('2.1) Cell 0.1 is focused after moving R', async () => {
        const { getByTestId } = render(<TwoByTwoGrid />, {});

        await runActions(act, ['R'])

        const targetKey = 'grid-cell-row-0-column-1'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('2.2) Cell 1.0 is focused after moving D', async () => {
        const { getByTestId } = render(<TwoByTwoGrid />, {});

        act(() => {
          getFocusEngine().moveFocusDown()
        })

        const targetKey = 'grid-cell-row-1-column-0'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      });
    })

    describe('3x3 Grid', () => {

      test('3.1) Cell 1.1 is focused after moving RD', async () => {
        const { getByTestId } = render(<ThreeByThreeGrid />, {});

        await runActions(act, ['R', 'D'])

        const targetKey = 'grid-cell-row-1-column-1'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('3.2) Cell 2.2 [grid-cell-grid-end] is focused after moving DDRR', async () => {
        const { getByTestId } = render(<ThreeByThreeGrid />, {});

        await runActions(act, ['D', 'D', 'R', 'R'])

        const targetKey = 'grid-cell-grid-end'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      });
    })
  })

  describe("External Movement", () => {

    describe('Entering grid', () => {

      test('4.1) left-button R into 2x2 focuses grid-cell', async () => {
        const { getByTestId } = render(surrounded('left'));

        await runActions(act, ['R'])

        const targetKey = 'grid-cell'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('4.2) right-button L into 2x2 focuses grid-cell-grid-end', async () => {
        const { getByTestId } = render(surrounded('right'));

        await runActions(act, ['L'])

        const targetKey = 'grid-cell-grid-end'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('4.3) up-button D into 2x2 focuses grid-cell', async () => {
        const { getByTestId } = render(surrounded('up'));

        await runActions(act, ['D'])

        const targetKey = 'grid-cell'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('4.4) down-button U into 2x2 focuses grid-cell-grid-end', async () => {
        const { getByTestId } = render(surrounded('down'));

        await runActions(act, ['U'])

        const targetKey = 'grid-cell-grid-end'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })
    })

    describe('Crossing grid', () => {

      test('5.1) left-button RRR into 2x2 focuses right-button', async () => {
        const { getByTestId } = render(surrounded('left'));

        await runActions(act, ['R', 'R', 'R'])

        const targetKey = 'right-button'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('5.2) up-button DDD into 2x2 focuses down-button', async () => {
        const { getByTestId } = render(surrounded('up'));

        await runActions(act, ['D', 'D', 'D'])

        const targetKey = 'down-button'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })
    })
  })
});


