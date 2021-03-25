/* istanbul ignore file */

export function captureElementsEventOnce<
  TElement extends HTMLElement,
  TEvent extends Event
>(
  rootElement: HTMLElement,
  query: string,
  event: string,
  eventHandler: (el: TElement, ev: TEvent) => void,
) {
  const attribute = `x-attached-${event}`
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
