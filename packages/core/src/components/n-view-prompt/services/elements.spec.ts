import { MockWindow } from '@stencil/core/mock-doc'
import { getChildInputValidity } from './elements'

describe('elements', () => {
  it('finds inputs invalid', async () => {
    const fakeWindow = new MockWindow(
      '<html><body><input name="name" type="text" required /></html>',
    )

    const input = fakeWindow.document.body.querySelector('input')
    input!.checkValidity = () => false
    input!.reportValidity = () => false

    const result = getChildInputValidity(fakeWindow.document.body)

    expect(result).toBeFalsy()
  })

  it('finds inputs valid', async () => {
    const fakeWindow = new MockWindow(
      '<html><body><input name="name" type="text" required /></html>',
    )

    const input = fakeWindow.document.body.querySelector('input')
    input!.checkValidity = () => true
    input!.reportValidity = () => true

    const result = getChildInputValidity(fakeWindow.document.body)

    expect(result).toBeTruthy()
  })

  it('finds inputs & textarea invalid', async () => {
    const fakeWindow = new MockWindow(
      '<html><body><input name="name" type="text" required /><textarea></textarea><select></select></html>',
    )

    const input = fakeWindow.document.body.querySelector('input')
    input!.checkValidity = () => true
    input!.reportValidity = () => true

    const textarea =
      fakeWindow.document.body.querySelector('textarea')
    textarea!.checkValidity = () => false
    textarea!.reportValidity = () => false

    const select = fakeWindow.document.body.querySelector('select')
    select!.checkValidity = () => false
    select!.reportValidity = () => false

    const result = getChildInputValidity(fakeWindow.document.body)

    expect(result).toBeFalsy()
  })
})
