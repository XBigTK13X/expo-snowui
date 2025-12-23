import { render } from './test-utils';
import SnowGrid from '../component/wired/snow-grid'
import SnowTextButton from '../component/wired/snow-text-button'

describe('<SnowGrid />', () => {
  test('Renders a single cell', () => {
    const Component = () => {
      return (
        <SnowGrid itemsPerRow={1}>
          <SnowTextButton title="Single Cell" />
        </SnowGrid>
      )
    }

    const { getByText } = render(<Component />, {});

    getByText('Single Cell');
  });
});
