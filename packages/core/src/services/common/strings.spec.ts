import { capitalize, kebabToCamelCase, toBoolean } from './strings'

describe('toBoolean', () => {
  it('empty string', () => {
    let result: any = toBoolean('')
    expect(result).toBe(false)
  })

  it('undefined', () => {
    let val: string
    // @ts-ignore
    let result: any = toBoolean(val)
    expect(result).toBe(false)
  })

  it('"false"', () => {
    let result: any = toBoolean('false')
    expect(result).toBe(false)
  })

  it('"0"', () => {
    let result: any = toBoolean('0')
    expect(result).toBe(false)
  })

  it('"no"', () => {
    let result: any = toBoolean('no')
    expect(result).toBe(false)
  })

  it('off', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })

  it('true', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })

  it('yes', () => {
    let result: any = toBoolean('off')
    expect(result).toBe(false)
  })

  it('on', () => {
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

describe('capitalize', () => {
  let caps = capitalize('first letter capital')

  it('should capitalize first letter of each word', async () => {
    expect(caps).toBe('First Letter Capital')
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
