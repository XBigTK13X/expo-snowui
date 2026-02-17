import { StyleSheet } from 'react-native';

import {
  act,
  render,
  AppStyle,
  getFocusEngine
} from './test-utils';

import SnowGrid from '../component/wired/snow-grid'
import SnowTextButton from '../component/wired/snow-text-button'

const OneByThreeGrid = () => {
  return (
    <SnowGrid
      focusStart
      focusKey="grid-cell"
      itemsPerRow={1}>
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.1" />
      <SnowTextButton title="Single Cell 2.1" />
    </SnowGrid>
  )
}

const TwoByTwoGrid = () => {
  return (
    <SnowGrid
      focusStart
      focusKey="grid-cell"
      itemsPerRow={2}>
      <SnowTextButton title="Single Cell 0.0" />
      <SnowTextButton title="Single Cell 0.1" />
      <SnowTextButton title="Single Cell 1.0" />
      <SnowTextButton title="Single Cell 1.1" />
    </SnowGrid>
  )
}

describe('SnowGrid', () => {
  describe('Single Column', () => {
    test('Cell grid-cell is focused on first render', async () => {
      const { getByTestId } = render(<OneByThreeGrid />, {});

      const focus = getFocusEngine()

      const firstStyle = StyleSheet.flatten(getByTestId('grid-cell').props.style)
      const secondStyle = StyleSheet.flatten(getByTestId('grid-cell-row-1-column-0').props.style)

      expect(focus.focusedKey).toBe('grid-cell');
      expect(firstStyle.borderColor).toBe(AppStyle.component.textButton.focused.borderColor)
      expect(secondStyle.borderColor).not.toBe(AppStyle.component.textButton.focused.borderColor)
    });

    test('Cell 1.0 is focused after moving down', async () => {
      const { getByTestId } = render(<OneByThreeGrid />, {});

      act(() => {
        getFocusEngine().moveFocusDown()
      })

      const firstStyle = StyleSheet.flatten(getByTestId('grid-cell').props.style)
      const secondStyle = StyleSheet.flatten(getByTestId('grid-cell-row-1-column-0').props.style)

      expect(getFocusEngine().focusedKey).toBe('grid-cell-row-1-column-0');
      expect(firstStyle.borderColor).not.toBe(AppStyle.component.textButton.focused.borderColor)
      expect(secondStyle.borderColor).toBe(AppStyle.component.textButton.focused.borderColor)
    });
  })

  describe('2x2 Grid', () => {
    test('Cell 1.2 is focused after moving right', async () => {
      const { getByTestId } = render(<TwoByTwoGrid />, {});

      act(() => {
        getFocusEngine().moveFocusRight()
      })

      const targetKey = 'grid-cell-row-0-column-1'
      const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

      expect(getFocusEngine().focusedKey).toBe(targetKey);
      expect(targetStyle.borderColor).toBe(AppStyle.component.textButton.focused.borderColor)
    });
    test('Cell 2.1 is focused after moving down', async () => {
      const { getByTestId } = render(<TwoByTwoGrid />, {});

      act(() => {
        getFocusEngine().moveFocusDown()
      })

      const targetKey = 'grid-cell-row-1-column-0'
      const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

      expect(getFocusEngine().focusedKey).toBe(targetKey);
      expect(targetStyle.borderColor).toBe(AppStyle.component.textButton.focused.borderColor)
    });
  })
});


