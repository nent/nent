jest.mock('../common/logging')
jest.mock('./evaluate.worker')

import {
  clearVisits,
  hasVisited,
  markVisit,
} from '../navigation/visits'
import {
  convertFromJson,
  evaluateExpression,
  evaluatePredicate,
} from './expressions'
import { addDataProvider } from './factory'
import { InMemoryProvider } from './providers/memory'
import { dataState } from './state'

describe('evaluateExpression', () => {
  let session: InMemoryProvider
  let storage: InMemoryProvider
  dataState.enabled = true
  beforeEach(() => {
    session = new InMemoryProvider()
    storage = new InMemoryProvider()

    addDataProvider('session', session)
    addDataProvider('storage', storage)
  })

  it('evaluates simple math', async () => {
    const value = await evaluateExpression('1 + 1')
    expect(value).toBe(2)
  })

  it('evaluates simple math no-spaces', async () => {
    const value = await evaluateExpression('1+1')
    expect(value).toBe(2)
  })

  it('evaluates simple predicate', async () => {
    const value = await evaluateExpression('2==2')
    expect(value).toBe(true)
  })

  it('evaluates simple expression with data-provider values', async () => {
    await session.set('rate', '1')
    await session.set('vintage', '1985')
    const value = await evaluateExpression(
      '{{session:rate}} + {{session:vintage}}',
    )
    expect(value).toBe(1986)
  })

  it('evaluates array in expression', async () => {
    await session.set('items', `['foo','boo']`)
    await session.set('item', 'foo')
    const exp = '{{session:item}} in {{session:items}}'
    const value = await evaluateExpression(exp)
    expect(value).toBe(true)
  })

  it('evaluates default values', async () => {
    const value = await evaluateExpression('{{session:value?1}} > 0')
    expect(value).toBe(true)
  })

  it('evaluates default values unquoted', async () => {
    const value = await evaluateExpression(
      '{{session:value?default}}',
    )
    expect(value).toBe(`'default'`)
  })
})

describe('evaluatePredicate', () => {
  let session: InMemoryProvider

  beforeEach(() => {
    session = new InMemoryProvider()
    addDataProvider('session', session)
  })

  it('evaluates simple predicate', async () => {
    const value = await evaluatePredicate('2 == 2')
    expect(value).toBe(true)
  })

  it('evaluates string comparison expression', async () => {
    const value = await evaluatePredicate('"word" == "word"')
    expect(value).toBe(true)
  })

  it('evaluates string comparison expression, ticks', async () => {
    const value = await evaluatePredicate(`'word' == 'word'`)
    expect(value).toBe(true)
  })

  it('evaluates string comparison expression (false)', async () => {
    const value = await evaluatePredicate('"word" != "word"')
    expect(value).toBe(false)
  })

  it('evaluates value in array expression', async () => {
    const value = await evaluatePredicate('1 in [1,2,3]')
    expect(value).toBe(true)
  })

  it('evaluates value in array expression (false)', async () => {
    const value = await evaluatePredicate('4 in [1,2,3]')
    expect(value).toBe(false)
  })

  it('evaluates simple predicate with data-provider values', async () => {
    await session.set('a', '1')
    await session.set('b', '1985')
    const value = await evaluatePredicate(
      '{{session:a}} < {{session:b}}',
    )
    expect(value).toBe(true)
  })

  it('evaluates simple predicate with data-provider values reversed', async () => {
    await session.set('a', '1985')
    await session.set('b', '1')
    const value = await evaluatePredicate(
      '{{session:a}} > {{session:b}}',
    )
    expect(value).toBe(true)
  })

  it('evaluates simple predicate with data-provider values equal', async () => {
    await session.set('a', '5')
    await session.set('b', '5')
    const value = await evaluatePredicate(
      '{{session:a}} == {{session:b}}',
    )
    expect(value).toBe(true)
  })

  it('evaluates simple predicate with data-provider values not equal', async () => {
    await session.set('a', '5')
    await session.set('b', '5')
    const value = await evaluatePredicate(
      '{{session:a}} != {{session:b}}',
    )
    expect(value).toBe(false)
  })

  it('evaluates string predicate with data-provider values equal', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('{{session:a}} == "foo"')
    expect(value).toBe(true)
  })

  it('string predicate with data-provider values not equal', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('{{session:a}} != "foo"')
    expect(value).toBe(false)
  })

  it('string predicate with data-provider values without quotes', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('{{session:a}} != "foo"')
    expect(value).toBe(false)
  })

  it('evaluates string includes', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"f" in {{session:a}}')
    expect(value).toBe(true)
  })

  it('evaluates string includes false', async () => {
    await session.set('a', 'foo')
    const value = await evaluatePredicate('"d" in {{session:a}}')
    expect(value).toBe(false)
  })

  it('evaluates string "true" to be true', async () => {
    const value = await evaluatePredicate('true')
    expect(value).toBe(true)
  })

  it('evaluates string "True" to be true', async () => {
    const value = await evaluatePredicate('True')
    expect(value).toBe(true)
  })

  it('evaluates string "value" to be true', async () => {
    const value = await evaluatePredicate('"value"')
    expect(value).toBe(true)
  })

  it('evaluates empty strings', async () => {
    await session.set('a', '')
    const value = await evaluatePredicate(`{{session:a}} == null`)
    expect(value).toBe(true)
  })

  it('evaluates did visit', async () => {
    await markVisit('/foo')
    const realResult = await hasVisited('/foo')
    const value = await evaluatePredicate(`didVisit('/foo')`)
    expect(value).toBe(realResult)
  })

  it('evaluates did not visit', async () => {
    await clearVisits()
    const value = await evaluatePredicate(`{{didVisit('/foo')}}`)
    expect(value).toBe(false)
  })

  it('evaluates null session values', async () => {
    const value = await evaluatePredicate('{{session:bad}}')
    expect(value).toBe(false)
  })

  it('evaluates not null session values', async () => {
    const value = await evaluatePredicate(`'{{session:bad}}' != ''`)
    expect(value).toBe(true)
  })

  it('evaluates null session values as empty', async () => {
    const value = await evaluatePredicate('{{session:bad}} == null')
    expect(value).toBe(true)
  })

  it('evaluates with ! for true on empty', async () => {
    const value = await evaluatePredicate('{{session:bad}} != null')
    expect(value).toBe(false)
  })

  it('evaluates session strings not null', async () => {
    await session.set('installed', 'npm')
    const value = await evaluatePredicate(
      '{{session:installed}} != null',
    )
    expect(value).toBe(true)
  })

  it('evaluates session strings is null: false', async () => {
    await session.set('installed', 'npm')
    const value = await evaluatePredicate(
      '{{session:installed}} == null',
    )
    expect(value).toBe(false)
  })

  it('evaluates with ! for false on not empty', async () => {
    await session.set('name', 'jason')
    const value = await evaluatePredicate('!{{session:name}}')
    expect(value).toBe(false)
  })

  it('evaluates with ! for true when value', async () => {
    const value = await evaluatePredicate('!{{session:name}}')
    expect(value).toBe(true)
  })

  it('evaluates object in arrays', async () => {
    const value = await evaluatePredicate(`{
      "text": "routing",
      "name": "system"
    } in [
      {
        "text": "routing",
        "name": "system"
      },
      {
        "text": "true",
        "name": "elements"
      }
    ]`)

    expect(value).toBeTruthy()
  })

  it('converts json to variables', async () => {
    let a = {
      text: 'navigation',
    }

    let array = [
      {
        text: 'routing',
        name: 'system',
      },
      {
        text: 'true',
        name: 'elements',
      },
    ]
    const result = convertFromJson(
      `${JSON.stringify(a)} in ${JSON.stringify(array)}`,
    )

    expect(result.data.a).not.toBeUndefined()
    expect(result.data.a.text).toBe(a.text)

    expect(result.expression).toBe(`a in [b,c]`)
  })

  it('evaluates object in arrays, when negative', async () => {
    const value = await evaluatePredicate(`{
      "text": "navigation"
    } in [
      {
        "text": "routing",
        "name": "system"
      },
      {
        "text": "true",
        "name": "elements"
      }
    ]`)

    expect(value).toBeFalsy()
  })

  it('converts ticks to string and resolves in', async () => {
    const expression = `{'text':'true','name':'actions'} in [{'text':'analytics','name':'system'},{'text':'true','name':'actions'}]`

    const result = await evaluatePredicate(expression)

    expect(result).toBeTruthy()
  })
})
