export function getChildInputValidity(rootElement: HTMLElement) {
  let valid = true
  const inputElements = rootElement.querySelectorAll('*:enabled')
  inputElements.forEach(i => {
    const input = i as HTMLInputElement
    input.blur?.call(i)
    if (input.reportValidity?.call(input) === false) {
      valid = false
    }
  })
  return valid
}
