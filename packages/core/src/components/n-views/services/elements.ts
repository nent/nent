/* istanbul ignore file */

/**
 * It attaches an event handler to all elements matching a query selector, but only once per element
 * @param {HTMLElement} rootElement - The root element to search for the query.
 * @param {string} query - The query to find the elements.
 * @param {string} event - The event name, such as "click" or "mouseover".
 * @param eventHandler - (el: TElement, ev: TEvent) => void
 */
export function captureElementsEventOnce<
  TElement extends HTMLElement,
  TEvent extends Event,
>(
  rootElement: HTMLElement,
  query: string,
  event: string,
  eventHandler: (el: TElement, ev: TEvent) => void,
) {
  const attribute = `n-attached-${event}`
  Array.from(rootElement.querySelectorAll(query) || [])
    .map(el => el as TElement)
    .filter(el => !el.hasAttribute(attribute))
    .forEach((el: TElement) => {
      el.addEventListener(event, ev => {
        eventHandler(el, ev as TEvent)
      })
      el.setAttribute(attribute, '')
    })
}
