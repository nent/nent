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
