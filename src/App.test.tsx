import * as React from "react"
import {render, fireEvent, screen, ByRoleMatcher, ByRoleOptions, queryAllByRole} from '@testing-library/react'
import { App } from "./App"

type Maybe<T> = T | undefined | null
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

function queryByShadowRole<T extends HTMLElement = HTMLElement>(...args: RoleArgs): Maybe<T> {
  const elements = queryAllByShadowRole(...args)

  if (elements == null || elements.length <= 0) return null

  return elements[0] as T
}

function screenQueryByShadowRole<T extends HTMLElement = HTMLElement>(role: ByRoleMatcher, options?: ByRoleOptions | undefined): Maybe<T> {
  return queryByShadowRole(document.documentElement, role, options)
}

function queryAllByShadowRole<T extends HTMLElement = HTMLElement>(container: HTMLElement, role: ByRoleMatcher, options?: ByRoleOptions | undefined): T[] {
  const elements = deepQuerySelectorAll(container, "*")

  // @ts-ignore
  return elements.map((el) => queryAllByRole(el, role, options)).flat(Infinity) as T[]
}

function screenQueryAllByShadowRole<T extends HTMLElement = HTMLElement>(role: ByRoleMatcher, options?: ByRoleOptions | undefined): T[] {
  return queryAllByShadowRole(document.documentElement, role, options)
}

function getAllByShadowRole<T extends HTMLElement = HTMLElement>(...args: RoleArgs): T[] {
  const elements = queryAllByShadowRole(...args)

  if (elements.length <= 0) {
    throw new Error("Error")
  }

  return elements as T[]
}

function getByShadowRole<T extends HTMLElement = HTMLElement>(...args: RoleArgs): ReturnType<typeof queryByShadowRole> {
  const elements = queryAllByShadowRole<T>(...args)

  if (elements.length > 0) {
    return elements[0]
  }

  throw new Error("Error")
}

function screenGetAllByShadowRole<T extends HTMLElement = HTMLElement>(...args: ScreenRoleArgs): ReturnType<typeof queryAllByShadowRole>  {
  return getAllByShadowRole<T>(document.documentElement, ...args)
}

function screenGetByShadowRole<T extends HTMLElement = HTMLElement>(...args: ScreenRoleArgs): ReturnType<typeof queryByShadowRole> {
  return getByShadowRole<T>(document.documentElement, ...args)
}

const myScreen = {
  ...screen,
  queryAllByShadowRole: screenQueryAllByShadowRole,
  queryByShadowRole: screenQueryByShadowRole,
  getAllByShadowRole: screenGetAllByShadowRole,
  getByShadowRole: screenGetByShadowRole,
}

test('loads items eventually', async () => {
  render(<App />)

  fireEvent.click(myScreen.getByShadowRole('button') as HTMLElement)

  // Wait for page to update with query text
  const el = await screen.findByText(/1/)

  expect(el).toBeInTheDocument()
})
