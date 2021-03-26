export function performLoadElementManipulation(
  el: HTMLElement,
): void {
  el.querySelectorAll('[n-hide]').forEach(el => {
    el.setAttribute('hidden', '')
    el.removeAttribute('n-hide')
  })
  el.querySelectorAll('[n-cloak]').forEach(el => {
    el.removeAttribute('n-cloak')
  })
}
