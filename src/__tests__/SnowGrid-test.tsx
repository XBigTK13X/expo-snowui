import { StyleSheet } from 'react-native';

import { render } from './test-utils';
import { fireEvent } from '@testing-library/react-native';

import SnowStyle from '../snow-style'
import SnowGrid from '../component/wired/snow-grid'
import SnowTextButton from '../component/wired/snow-text-button'

const AppStyle = SnowStyle.createStyle()

const OneColumnGrid = () => {
  return (
    <SnowGrid testID="grid-container" focusStart focusKey="test-1" itemsPerRow={1}>
      <SnowTextButton testID="button-1" title="Single Cell 1" />
      <SnowTextButton testID="button-2" title="Single Cell 2" />
      <SnowTextButton testID="button-3" title="Single Cell 3" />
    </SnowGrid>
  )
}

describe('<SnowGrid />', () => {
  test('Single column grid highlights the first cell and not the second', () => {
    const { getByTestId, } = render(<OneColumnGrid />, {});

    const firstStyle = StyleSheet.flatten(getByTestId('button-1').props.style)

    const secondStyle = StyleSheet.flatten(getByTestId('button-2').props.style)

    expect(firstStyle.borderColor).toBe(AppStyle.component.textButton.focused)
    expect(secondStyle.borderColor).not.toBe(AppStyle.component.textButton.focused)
  });

  test('Single column grid highlights the second cell after hitting down arrow', () => {
    const { getByTestId, } = render(<OneColumnGrid />, {});

    fireEvent(getByTestId('grid-container'), 'keyDown', {
      key: 'ArrowDown',
      keyCode: 40,
      which: 40,
    });

    const firstStyle = StyleSheet.flatten(getByTestId('button-1').props.style)
    const secondStyle = StyleSheet.flatten(getByTestId('button-2').props.style)

    expect(secondStyle.borderColor).toBe(AppStyle.component.textButton.focused)
    expect(firstStyle.borderColor).not.toBe(AppStyle.component.textButton.focused)
  });
});


