import React from 'react'
import { render } from '@testing-library/react'
import App from '../App'

test('should render App with correct text', () => {
  const { getByTestId } = render(<App />)
  const header = getByTestId('appHeader')

  expect(header.textContent).toBe('App has arrived')
})
