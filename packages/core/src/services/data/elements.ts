/* istanbul ignore file */

import { evaluatePredicate } from './expressions'
import { hasToken, resolveTokens } from './tokens'

/**
 * It resolves all the child elements of the given element that have an x-* attribute
 * @param {HTMLElement} element - The element to resolve the attributes for.
 */
export function resolveChildElementXAttributes(element: HTMLElement) {
  resolveChildXHideWhenAttributes(element)
  resolveChildXShowWhenAttributes(element)
  resolveChildXClassWhenAttributes(element)
  resolveChildXValueFromAttributes(element)
}

/**
 * It finds all the elements with the `n-hide-when` attribute and resolves them
 * @param {Element} element - The element to resolve the attribute on.
 */
export function resolveChildXHideWhenAttributes(element: Element) {
  element.querySelectorAll('[n-hide-when]').forEach(async el => {
    await resolveXHideWhenAttribute(el)
  })
}

/**
 * It evaluates the expression in the `n-hide-when` attribute and sets the `hidden` attribute on the
 * element if the expression evaluates to `true`
 * @param {Element} element - The element to resolve the attribute on.
 * @returns A function that takes an element as an argument.
 */
export async function resolveXHideWhenAttribute(element: Element) {
  const expression = element.getAttribute('n-hide-when')
  if (!expression) return
  const hide = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', hide)
}

/**
 * It resolves the `n-show-when` attribute of all child elements of the given element
 * @param {Element} element - The element to resolve the n-show-when attribute on.
 */
export function resolveChildXShowWhenAttributes(element: Element) {
  element.querySelectorAll('[n-show-when]').forEach(async el => {
    await resolveXShowWhenAttribute(el)
  })
}

/**
 * It evaluates the expression in the `n-show-when` attribute and sets the `hidden` attribute on the
 * element if the expression evaluates to `false`
 * @param {Element} element - The element that has the n-show-when attribute.
 * @returns A function that takes an element as an argument.
 */
export async function resolveXShowWhenAttribute(element: Element) {
  const expression = element.getAttribute('n-show-when')
  if (!expression) return
  const show = await evaluatePredicate(expression)
  element.toggleAttribute('hidden', !show)
}

/**
 * It resolves the `n-class-when` attribute on all child elements of the given element
 * @param {Element} element - The element to resolve the attribute on.
 */
export function resolveChildXClassWhenAttributes(element: Element) {
  element.querySelectorAll('[n-class-when]').forEach(async el => {
    await resolveXClassWhenAttribute(el)
  })
}

/**
 * It evaluates the expression in the `n-class-when` attribute, and if the result is truthy, it adds
 * the class name in the `n-class` attribute to the element
 * @param {Element} element - The element that the attribute is on.
 * @returns A function that takes an element as an argument.
 */
export async function resolveXClassWhenAttribute(element: Element) {
  const expression = element.getAttribute('n-class-when')
  const className = element.getAttribute('n-class')
  if (!expression || !className) return
  const when = await evaluatePredicate(expression)
  element.classList.toggle(className, when)
}

/**
 * It finds all elements with the `n-value-from` attribute and calls the `resolveXValueFromAttribute`
 * function on each of them.
 * @param {Element} element - The element to resolve the attribute on.
 */
export function resolveChildXValueFromAttributes(element: Element) {
  element.querySelectorAll('[n-value-from]').forEach(async el => {
    await resolveXValueFromAttribute(el)
  })
}

/**
 * It takes an element, checks if it has an attribute called `n-value-from`, and if it does, it
 * resolves the tokens in the attribute's value and sets the element's `value` attribute to the
 * resolved value
 * @param {Element} element - The element that we're resolving the value for.
 */
export async function resolveXValueFromAttribute(element: Element) {
  const expression = element.getAttribute('n-value-from')
  if (expression && hasToken(expression)) {
    const value = await resolveTokens(expression)
    if (value) {
      element.setAttribute('value', value)
    }
  }
}
