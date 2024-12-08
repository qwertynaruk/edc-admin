import '@testing-library/jest-dom';

import { render } from '@testing-library/react';

test('renders a message', () => {
  const { getByText } = render(
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
  expect(getByText('Hello, world!')).toBeInTheDocument();
  // expect(asFragment()).toMatchInlineSnapshot(`
  //   <h1>Hello, World!</h1>
  // `);
});
