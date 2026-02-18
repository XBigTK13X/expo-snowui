import { StyleSheet } from 'react-native';

import {
  act,
  render,
  debugFocus,
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

describe('SnowGrid', () => {

  describe('Internal Movement', () => {

    describe('Single Column', () => {

      test('Cell 0.0 [grid-cell] is focused on first render', async () => {
        const { getByTestId } = render(<OneByThreeGrid />, {});

        const targetKey = 'grid-cell'

        const firstStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(firstStyle.borderColor).toBe(focusedColor)
      })

      test('Cell 1.0 is focused after moving D', async () => {
        const { getByTestId } = render(<OneByThreeGrid />, {});

        act(() => {
          getFocusEngine().moveFocusDown()
        })

        const targetKey = 'grid-cell-row-1-column-0'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })
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
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('Cell 1.0 is focused after moving D', async () => {
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
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

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
        expect(targetStyle.borderColor).toBe(focusedColor)
      });
    })
  })

  describe("External Movement", () => {

    describe('Entering grid', () => {

      test('Left button R into 2x2 focuses grid-cell', () => {
        const { getByTestId } = render(<Surround focusStart="left"><TwoByTwoGrid focusStart={false} /></Surround>);

        act(() => {
          getFocusEngine().moveFocusRight()
        })

        const targetKey = 'grid-cell'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('Right button L into 2x2 focuses grid-cell-grid-end', () => {
        const { getByTestId } = render(<Surround focusStart="right"><TwoByTwoGrid focusStart={false} /></Surround>);

        act(() => {
          getFocusEngine().moveFocusLeft()
        })

        const targetKey = 'grid-cell-grid-end'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('Up button D into 2x2 focuses grid-cell-grid-end', () => {
        const { getByTestId } = render(<Surround focusStart="up"><TwoByTwoGrid focusStart={false} /></Surround>);

        act(() => {
          getFocusEngine().moveFocusDown()
        })

        const targetKey = 'grid-cell'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('Down button U into 2x2 focuses grid-cell-grid-end', () => {
        const { getByTestId } = render(<Surround focusStart="down"><TwoByTwoGrid focusStart={false} /></Surround>);

        act(() => {
          getFocusEngine().moveFocusUp()
        })

        const targetKey = 'grid-cell-grid-end'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })
    })

    describe('Crossing grid', () => {

      test('Left button RRR into 2x2 focuses right-button', () => {
        const { getByTestId } = render(<Surround focusStart="left"><TwoByTwoGrid focusStart={false} /></Surround>);

        act(() => {
          getFocusEngine().moveFocusRight()
        })
        act(() => {
          getFocusEngine().moveFocusRight()
        })
        act(() => {
          getFocusEngine().moveFocusRight()
        })

        debugFocus()

        const targetKey = 'right-button'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })

      test('Up button DDD into 2x2 focuses down-button', () => {
        const { getByTestId } = render(<Surround focusStart="up"><TwoByTwoGrid focusStart={false} /></Surround>);

        act(() => {
          getFocusEngine().moveFocusDown()
        })
        act(() => {
          getFocusEngine().moveFocusDown()
        })
        act(() => {
          getFocusEngine().moveFocusDown()
        })

        const targetKey = 'down-button'
        const targetStyle = StyleSheet.flatten(getByTestId(targetKey).props.style)

        expect(getFocusEngine().focusedKey).toBe(targetKey);
        expect(targetStyle.borderColor).toBe(focusedColor)
      })
    })
  })
});


