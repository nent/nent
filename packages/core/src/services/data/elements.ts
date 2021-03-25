/* istanbul ignore file */

import { evaluatePredicate } from './expressions'
import { hasToken, resolveTokens } from './tokens'

export async function resolveChildElementXAttributes(
  element: HTMLElement,
) {
  resolveChildXHideWhenAttributes(element)
  resolveChildXShowWhenAttributes(element)
  resolveChildXClassWhenAttributes(element)
  resolveChildXValueFromAttributes(element)
}

export function resolveChildXHideWhenAttributes(element: Element) {
  element.querySelectorAll('[x-hide-when]').forEach(async el => {
    await resolveXHideWhenAttribute(el)
  })
}

export async function resolveXHideWhenAttribute(element: Element) {
  const expression = element.getAttribute('x-hide-when')
  if (!expression) return
  const hide = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', hide)
}

export function resolveChildXShowWhenAttributes(element: Element) {
  element.querySelectorAll('[x-show-when]').forEach(async el => {
    await resolveXShowWhenAttribute(el)
  })
}

export async function resolveXShowWhenAttribute(element: Element) {
  const expression = element.getAttribute('x-show-when')
  if (!expression) return
  const show = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', !show)
}

export function resolveChildXClassWhenAttributes(element: Element) {
  element.querySelectorAll('[x-class-when]').forEach(async el => {
    await resolveXClassWhenAttribute(el)
  })
}

export async function resolveXClassWhenAttribute(element: Element) {
  const expression = element.getAttribute('x-class-when')
  const className = element.getAttribute('x-class')
  if (!expression || !className) return
  const when = await evaluatePredicate(expression)
  element.classList.toggle(className, when)
}

export function resolveChildXValueFromAttributes(element: Element) {
  element.querySelectorAll('[x-value-from]').forEach(async el => {
    await resolveXValueFromAttribute(el)
  })
}

export async function resolveXValueFromAttribute(element: Element) {
  const expression = element.getAttribute('x-value-from')
  if (expression && hasToken(expression)) {
    const value = await resolveTokens(expression)
    if (value) {
      element.setAttribute('value', value)
    }
  }
}
