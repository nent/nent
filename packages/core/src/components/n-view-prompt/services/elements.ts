export function getChildInputValidity(rootElement: HTMLElement) {
  let invalid = false
  const inputElements = [
    ...Array.from(rootElement.querySelectorAll('input')),
    ...Array.from(rootElement.querySelectorAll('textarea')),
    ...Array.from(rootElement.querySelectorAll('select')),
    ...Array.from(rootElement.querySelectorAll('*[n-validate]')),
  ]
  inputElements.forEach((i: any) => {
    if (i.checkValidity?.call(i) === false) {
      i.reportValidity?.call(i)
      invalid = true
    }
  })
  return invalid == false
}
