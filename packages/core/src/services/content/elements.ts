/**
 * It replaces the HTML of an element in the DOM with the HTML of another element
 * @param {HTMLElement} el - HTMLElement - the element to replace the content in
 * @param {string} existingSelector - The selector to find the existing element to replace.
 * @param {HTMLElement | null} contentElement - The element that will be inserted into the DOM.
 * @returns the value of the last expression.
 */
export function replaceHtmlInElement(
  el: HTMLElement,
  existingSelector: string,
  contentElement: HTMLElement | null,
) {
  const existing = el.querySelector(existingSelector)
  const changed = existing?.innerHTML != contentElement?.innerHTML
  if (!changed) return

  if (existing) {
    existing.remove()
  }

  if (contentElement) {
    el.append(contentElement)
  }
}
