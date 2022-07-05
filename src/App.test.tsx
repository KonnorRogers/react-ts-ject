import * as React from "react"
import {render, fireEvent, screen, ByRoleMatcher, ByRoleOptions, queryAllByRole, findByRole, FindByRole, GetByRole, findAllByRole, FindAllByRole} from '@testing-library/react'
import { App } from "./App"
import {buildQueries} from '@testing-library/react'

type Container = HTMLElement | Document | ShadowRoot
type RoleArgs = [container: HTMLElement, role: ByRoleMatcher, options?: ByRoleOptions | undefined]
type ScreenRoleArgs = [role: ByRoleMatcher, options?: ByRoleOptions | undefined]

function deepQuerySelector (container: Container, selectors: string, elements: (Element | ShadowRoot)[] = []) {
  const els = deepQuerySelectorAll(container, selectors, elements)

  if (Array.isArray(els) && els.length > 0) {
    return els[0]
  }

  return null
}

function deepQuerySelectorAll (container: Container, selectors: string, elements: (Element | ShadowRoot)[] = []) {
  container.querySelectorAll(selectors).forEach((el: Element | ShadowRoot) => {
    // @ts-ignore
    if (el.shadowRoot == null || el.shadowRoot.mode === "closed") {
      elements.push(el)
      return
    }

    // uncomment this to also add shadowRoots
    // @ts-ignore
    elements.push(el.shadowRoot)
    // @ts-ignore
    deepQuerySelectorAll(el.shadowRoot, selectors, elements)
  })

  return elements
}

function queryAllByShadowRole<T extends HTMLElement = HTMLElement>(container: HTMLElement, role: ByRoleMatcher, options?: ByRoleOptions | undefined): T[] {
  const elements = deepQuerySelectorAll(container, "*")

  // @ts-ignore
  return elements.map((el) => queryAllByRole(el, role, options)).flat(Infinity) as T[]
}

const getMultipleError = (_c: Element | null, role: string) =>
  `Found multiple elements with the role of: ${role}`
const getMissingError = (_c: Element | null, role: string) =>
  `Unable to find an element with the role of: ${role}`

const [
  queryByShadowRole,
  getAllByShadowRole,
  getByShadowRole,
  findAllByShadowRole,
  findByShadowRole,
] = buildQueries(queryAllByShadowRole, getMultipleError, getMissingError)

function toScreenRole<T extends Function> (callback: T) {
  return function (...args: ScreenRoleArgs) {
    return callback(document.documentElement, ...args)
  }
}

const myScreen = {
  ...screen,
  queryAllByShadowRole: toScreenRole(queryAllByShadowRole),
  queryByShadowRole: toScreenRole(queryByShadowRole),
  getAllByShadowRole: toScreenRole(getAllByShadowRole),
  getByShadowRole: toScreenRole(getByShadowRole),
  findAllByShadowRole: toScreenRole(findAllByShadowRole),
  findByShadowRole: toScreenRole(findByShadowRole),
}

test('loads items eventually', async () => {
  render(<App />)

  fireEvent.click(myScreen.getByShadowRole('button') as HTMLElement)

  // Wait for page to update with query text
  const el = await screen.findByText(/1/)

  expect(el).toBeInTheDocument()
})
