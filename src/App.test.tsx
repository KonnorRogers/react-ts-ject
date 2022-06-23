import * as React from "react"
import {render, fireEvent, screen} from '@testing-library/react'
import { App } from "./App"

test('loads items eventually', async () => {
  render(<App />)

  // Click button
  fireEvent.click(screen.getByText('0'))

  // Wait for page to update with query text
  await screen.findByText(/1/)
})
