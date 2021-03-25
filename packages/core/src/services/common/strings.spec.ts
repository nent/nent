import { kebabToCamelCase, toBoolean } from './strings'

describe('toBoolean', () => {
  test('empty string', () => {
    let result: any = toBoolean('')
    expect(result).toBe(false)
  })

  test('undefined', () => {
    let val: string
    // @ts-ignore
    let result: any = toBoolean(val)
    expect(result).toBe(false)
  })

  test('"false"', () => {
    let result: any = toBoolean('false')
    expect(result).toBe(false)
  })

  test('"0"', () => {
    let result: any = toBoolean('0')
    expect(result).toBe(false)
  })

  test('"no"', () => {
    let result: any = toBoolean('no')
    expect(result).toBe(false)
  })

  test('off', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })

  test('true', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })

  test('yes', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })

  test('on', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })
})

describe('kebabToCamelCase', () => {
  let camel = kebabToCamelCase('this-is-a-word')

  it('should translate happy path', async () => {
    expect(camel).toBe('thisIsAWord')
  })

  camel = kebabToCamelCase('this-Is-a-woRD')

  it('should translate bad casing', async () => {
    expect(camel).toBe('thisIsAWord')
  })
})

describe('toBoolean', () => {
  let value = toBoolean('false')

  it('should translate false string', () => {
    expect(value).toBe(false)
  })

  let trueString = toBoolean('true')
  it('should translate true string', () => {
    expect(trueString).toBe(true)
  })

  let noString = toBoolean('no')
  it('should translate no to false', () => {
    expect(noString).toBe(false)
  })

  let yesString = toBoolean('yes')
  it('should translate yes to true', () => {
    expect(yesString).toBe(true)
  })

  let falseBang = toBoolean('!')
  it('should translate bang to false', () => {
    expect(falseBang).toBe(false)
  })
})
