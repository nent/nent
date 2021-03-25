export function performLoadElementManipulation(
  el: HTMLElement,
): void {
  el.querySelectorAll('[x-hide]').forEach(el => {
    el.setAttribute('hidden', '')
    el.removeAttribute('x-hide')
  })
  el.querySelectorAll('[x-cloak]').forEach(el => {
    el.removeAttribute('x-cloak')
  })
}
