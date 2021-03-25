import {
  getPropertyValue,
  isJson,
  isNotValue,
  isObject,
  isString,
  isValue,
  requireValue,
} from './values'

describe('requireValue', () => {
  it('should throw when empty', () => {
    let error: Error | null = null
    try {
      requireValue(null, 'test')
    } catch (err) {
      error = err
    }

    expect(error).not.toBeNull()
    expect(error!.message).toBe(
      'X-UI : A value for test was not provided.',
    )
  })

  it('should not throw when not empty', () => {
    let error: Error | null = null
    try {
      requireValue('value', 'test')
    } catch (err) {
      error = err
    }

    expect(error).toBeNull()
  })
})

describe('isValue', () => {
  it('undefined', () => {
    expect(isValue(undefined)).toBeFalsy()
  })
  it('null', () => {
    expect(isValue(null)).toBeFalsy()
  })
  it('undefined variable', () => {
    let variable
    expect(isValue(variable)).toBeFalsy()
  })
  it('empty', () => {
    expect(isValue('')).toBeTruthy()
  })
  it('string', () => {
    expect(isValue('word')).toBeTruthy()
  })
  it('number: 0', () => {
    expect(isValue(0)).toBeTruthy()
  })
  it('string: false', () => {
    expect(isValue('false')).toBeTruthy()
  })
  it('boolean', () => {
    expect(isValue(true)).toBeTruthy()
  })
})

describe('isNotValue', () => {
  it('undefined', () => {
    expect(isNotValue(undefined)).toBeTruthy()
  })
  it('null', () => {
    expect(isNotValue(null)).toBeTruthy()
  })
  it('undefined variable', () => {
    let variable
    expect(isNotValue(variable)).toBeTruthy()
  })
  it('empty', () => {
    expect(isNotValue('')).toBeFalsy()
  })
  it('string', () => {
    expect(isNotValue('word')).toBeFalsy()
  })
  it('number: 0', () => {
    expect(isNotValue(0)).toBeFalsy()
  })
  it('string: false', () => {
    expect(isNotValue('false')).toBeFalsy()
  })
  it('boolean', () => {
    expect(isNotValue(true)).toBeFalsy()
  })
})

describe('isObject', () => {
  it('undefined', () => {
    expect(isObject(undefined)).toBeFalsy()
  })
  it('null', () => {
    expect(isObject(null)).toBeFalsy()
  })
  it('undefined variable', () => {
    let variable
    expect(isObject(variable)).toBeFalsy()
  })
  it('empty', () => {
    expect(isObject('')).toBeFalsy()
  })
  it('string', () => {
    expect(isObject('word')).toBeFalsy()
  })
  it('number: 0', () => {
    expect(isObject(0)).toBeFalsy()
  })
  it('string: false', () => {
    expect(isObject('false')).toBeFalsy()
  })
  it('boolean', () => {
    expect(isObject(true)).toBeFalsy()
  })

  it('object', () => {
    expect(
      isObject({
        name: 'Max',
      }),
    ).toBeTruthy()
  })
})

describe('isString', () => {
  it('undefined', () => {
    expect(isString(undefined)).toBeFalsy()
  })
  it('null', () => {
    expect(isString(null)).toBeFalsy()
  })
  it('undefined variable', () => {
    let variable
    expect(isString(variable)).toBeFalsy()
  })
  it('empty', () => {
    expect(isString('')).toBeTruthy()
  })
  it('string', () => {
    expect(isString('word')).toBeTruthy()
  })
  it('number: 0', () => {
    expect(isString(0)).toBeFalsy()
  })
  it('string: false', () => {
    expect(isString('false')).toBeTruthy()
  })
  it('boolean', () => {
    expect(isString(true)).toBeFalsy()
  })

  it('object', () => {
    expect(
      isString({
        name: 'Max',
      }),
    ).toBeFalsy()
  })
})

describe('isJson', () => {
  it('undefined', () => {
    expect(isJson(undefined)).toBeFalsy()
  })
  it('null', () => {
    expect(isJson(null)).toBeFalsy()
  })
  it('undefined variable', () => {
    let variable
    expect(isJson(variable)).toBeFalsy()
  })
  it('empty', () => {
    expect(isJson('')).toBeFalsy()
  })
  it('string', () => {
    expect(isJson('word')).toBeFalsy()
  })
  it('number: 0', () => {
    expect(isJson(0)).toBeFalsy()
  })
  it('string: false', () => {
    expect(isJson('false')).toBeTruthy()
  })
  it('boolean', () => {
    expect(isJson(true)).toBeFalsy()
  })

  it('object', () => {
    expect(
      isJson({
        name: 'Max',
      }),
    ).toBeFalsy()
  })
  it('string: {}', () => {
    expect(isJson('{}')).toBeTruthy()
  })

  it('string: []', () => {
    expect(isJson('[]')).toBeTruthy()
  })
})

describe('getPropertyValue', () => {
  const data = {
    values: [0, 1, 2, 3, 4],
    user: {
      name: 'Brian',
      allowed: false,
      permissions: [
        {
          name: 'manager',
          role: 'editor',
          objects: ['story', 'organization'],
        },
        {
          name: 'user',
          role: 'editor',
          objects: ['experience'],
        },
      ],
    },
    key: '3490',
  }

  it('root: key', () => {
    expect(getPropertyValue(data, 'key')).toBe(data.key)
  })

  it('root: values', () => {
    expect(getPropertyValue(data, 'values')).toBe(data.values)
  })

  it('root: values[0]', () => {
    expect(getPropertyValue(data, 'values[0]')).toBe(data.values[0])
  })

  it('root: user.name', () => {
    expect(getPropertyValue(data, 'user.name')).toBe(data.user.name)
  })

  it('root: user.permissions[1].role', () => {
    expect(getPropertyValue(data, 'user.permissions[1].role')).toBe(
      data.user.permissions[1].role,
    )
  })

  it('root: user.permissions[1].object[0]', () => {
    expect(
      getPropertyValue(data, 'user.permissions[1].objects[0]'),
    ).toBe(data.user.permissions[1].objects[0])
  })
})
