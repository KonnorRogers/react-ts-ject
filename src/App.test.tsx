import * as React from "react"
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { App } from "./App"
import userEvent from "@testing-library/user-event"

test('Should fire a search event on harmony searchbox', async () => {
  const user = userEvent.setup()
  render(<App />)

  const searchbox = await screen.findByTestId("searchbox")

  const inputField = searchbox.shadowRoot?.querySelector('input') as HTMLInputElement;
  expect(inputField).toBeInTheDocument()
})

test('Should fire a search event', async () => {
  const user = userEvent.setup()
  render(<App />)

  // This is an <input type="range">
  const inputField = await screen.findByTestId("search")

  const mockTracking = jest.fn();

  inputField.addEventListener("input", mockTracking)

  const searchTerm = 'test';

  await user.type(inputField, `${searchTerm}{enter}`);
  await waitFor(() => expect(mockTracking).toHaveBeenCalledTimes(4));
})
