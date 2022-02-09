export function getChildInputValidity(rootElement: HTMLElement) {
  const inputElements = [
    ...Array.from(rootElement.querySelectorAll('input')),
    ...Array.from(rootElement.querySelectorAll('textarea')),
    ...Array.from(rootElement.querySelectorAll('select')),
    ...Array.from(rootElement.querySelectorAll('*[n-validate]')),
  ]
  const results = inputElements.map((i: any) => {
    if (
      i.checkValidity?.call(i) === false ||
      i.reportValidity?.call(i) === false
    ) {
      return false
    }
    return true
  })
  if (rootElement.querySelectorAll('*[invalid]').length) return false
  return !results.some(v => v == false)
}
