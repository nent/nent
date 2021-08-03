/* istanbul ignore file */

import { evaluatePredicate } from './expressions'
import { hasToken, resolveTokens } from './tokens'

export function resolveChildElementXAttributes(element: HTMLElement) {
  resolveChildXHideWhenAttributes(element)
  resolveChildXShowWhenAttributes(element)
  resolveChildXClassWhenAttributes(element)
  resolveChildXValueFromAttributes(element)
}

export function resolveChildXHideWhenAttributes(element: Element) {
  element.querySelectorAll('[n-hide-when]').forEach(async el => {
    await resolveXHideWhenAttribute(el)
  })
}

export async function resolveXHideWhenAttribute(element: Element) {
  const expression = element.getAttribute('n-hide-when')
  if (!expression) return
  const hide = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', hide)
}

export function resolveChildXShowWhenAttributes(element: Element) {
  element.querySelectorAll('[n-show-when]').forEach(async el => {
    await resolveXShowWhenAttribute(el)
  })
}

export async function resolveXShowWhenAttribute(element: Element) {
  const expression = element.getAttribute('n-show-when')
  if (!expression) return
  const show = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', !show)
}

export function resolveChildXClassWhenAttributes(element: Element) {
  element.querySelectorAll('[n-class-when]').forEach(async el => {
    await resolveXClassWhenAttribute(el)
  })
}

export async function resolveXClassWhenAttribute(element: Element) {
  const expression = element.getAttribute('n-class-when')
  const className = element.getAttribute('n-class')
  if (!expression || !className) return
  const when = await evaluatePredicate(expression)
  element.classList.toggle(className, when)
}

export function resolveChildXValueFromAttributes(element: Element) {
  element.querySelectorAll('[n-value-from]').forEach(async el => {
    await resolveXValueFromAttribute(el)
  })
}

export async function resolveXValueFromAttribute(element: Element) {
  const expression = element.getAttribute('n-value-from')
  if (expression && hasToken(expression)) {
    const value = await resolveTokens(expression)
    if (value) {
      element.setAttribute('value', value)
    }
  }
}
