import { StyleSheet } from 'react-native';

import {
  act,
  render,
  AppStyle,
  getFocusEngine
} from './test-utils';

import SnowGrid from '../component/wired/snow-grid'
import SnowTextButton from '../component/wired/snow-text-button'

const focusedTextButtonColor = AppStyle.component.textButton.focused.borderColor

const OneByThreeGrid = (props: any) => {
  return (
    <SnowGrid
      focusStart
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={1}>
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.1" />
      <SnowTextButton title="Single Cell 2.1" />
    </SnowGrid>
  )
}

const ThreeByOneGrid = (props: any) => {
  return (
    <SnowGrid
      focusStart
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={3}>
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.1" />
      <SnowTextButton title="Single Cell 2.1" />
    </SnowGrid>
  )
}

const TwoByTwoGrid = (props: any) => {
  return (
    <SnowGrid
      focusStart
      focusKey={props.focusKey ?? 'grid-cell'}
      itemsPerRow={2}>
      <SnowTextButton title="Single Cell 0.0" />
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.0" />
      <SnowTextButton title="Single Cell 1.1" />
    </SnowGrid>
  )
}

const ThreeByThreeGrid = (props: any) => {
  return (
    <SnowGrid
      focusStart
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

describe('SnowGrid', () => {
  describe('Single Column', () => {
    test('Cell 0.0 [grid-cell] is focused on first render', async () => {
      const { getByTestId } = render(<OneByThreeGrid />, {});

      const focus = getFocusEngine()

      const firstStyle = StyleSheet.flatten(getByTestId('grid-cell').props.style)
      const secondStyle = StyleSheet.flatten(getByTestId('grid-cell-row-1-column-0').props.style)

      expect(focus.focusedKey).toBe('grid-cell');
      expect(firstStyle.borderColor).toBe(focusedTextButtonColor)
      expect(secondStyle.borderColor).not.toBe(focusedTextButtonColor)
    });

    test('Cell 1.0 is focused after moving D', async () => {
      const { getByTestId } = render(<OneByThreeGrid />, {});

      act(() => {
        getFocusEngine().moveFocusDown()
      })

      const firstStyle = StyleSheet.flatten(getByTestId('grid-cell').props.style)
      const secondStyle = StyleSheet.flatten(getByTestId('grid-cell-row-1-column-0').props.style)

      expect(getFocusEngine().focusedKey).toBe('grid-cell-row-1-column-0');
      expect(firstStyle.borderColor).not.toBe(focusedTextButtonColor)
      expect(secondStyle.borderColor).toBe(focusedTextButtonColor)
    });
  })

  describe('2x2 Grid', () => {
    test('Cell 0.1 is focused after moving R', async () => {
      const { getByTestId } = render(<TwoByTwoGrid />, {});

      act(() => {
        getFocusEngine().moveFocusRight()
      })

      const targetKey = 'grid-cell-row-0-column-1'
      const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

      expect(getFocusEngine().focusedKey).toBe(targetKey);
      expect(targetStyle.borderColor).toBe(focusedTextButtonColor)
    });
    test('Cell 1.0 is focused after moving D', async () => {
      const { getByTestId } = render(<TwoByTwoGrid />, {});

      act(() => {
        getFocusEngine().moveFocusDown()
      })

      const targetKey = 'grid-cell-row-1-column-0'
      const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

      expect(getFocusEngine().focusedKey).toBe(targetKey);
      expect(targetStyle.borderColor).toBe(focusedTextButtonColor)
    });
  })

  describe('3x3 Grid', () => {
    test('Cell 1.1 is focused after moving RD', async () => {
      const { getByTestId } = render(<ThreeByThreeGrid />, {});

      act(() => {
        getFocusEngine().moveFocusRight()
      })
      act(() => {
        getFocusEngine().moveFocusDown()
      })

      const targetKey = 'grid-cell-row-1-column-1'
      const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

      expect(getFocusEngine().focusedKey).toBe(targetKey);
      expect(targetStyle.borderColor).toBe(focusedTextButtonColor)
    });
    test('Cell 2.2 [grid-cell-grid-end] is focused after moving DDRR', async () => {
      const { getByTestId } = render(<ThreeByThreeGrid />, {});

      act(() => {
        getFocusEngine().moveFocusDown()
      })
      act(() => {
        getFocusEngine().moveFocusDown()
      })
      act(() => {
        getFocusEngine().moveFocusRight()
      })
      act(() => {
        getFocusEngine().moveFocusRight()
      })

      const targetKey = 'grid-cell-grid-end'
      const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

      expect(getFocusEngine().focusedKey).toBe(targetKey);
      expect(targetStyle.borderColor).toBe(focusedTextButtonColor)
    });
  })
});


