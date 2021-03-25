import { eventBus } from '../actions'
import {
  commonState,
  debounce,
  debugIf,
  requireValue,
  sleep,
} from '../common'
import { DATA_EVENTS, IDataProvider } from './interfaces'
import { dataState } from './state'

const disposers: Record<string, () => void> = {}

export function addDataProvider(
  name: string,
  provider: IDataProvider,
) {
  requireValue(name, 'provider name')
  if (typeof provider.get !== 'function') {
    throw new TypeError(
      `The provider ${name} is missing the get(key) function.`,
    )
  }

  const debouncedChanges = debounce(1000, (...args: any[]) => {
    eventBus.emit(DATA_EVENTS.DataChanged, {
      provider: name,
      data: args,
    })
  })

  const dispose = provider.changed?.on('*', (...args: any[]) => {
    debouncedChanges(args)
  })
  disposers[name] = dispose!

  dataState.providers[name.toLowerCase()] = provider

  debugIf(
    commonState.debug && name !== 'data',
    `data-provider: ${name} registered`,
  )
}

export async function getDataProvider(
  name: string,
): Promise<IDataProvider | null> {
  const key = name.toLowerCase()
  requireValue(name, 'provider name')
  if (Object.keys(dataState.providers).includes(key))
    return dataState.providers[key]

  await sleep(dataState.providerTimeout)

  if (Object.keys(dataState.providers).includes(key))
    return dataState.providers[key]

  return null
}

export function getDataProviders() {
  return dataState.providers
}

export function removeDataProvider(name: string) {
  delete dataState.providers[name]
  disposers[name]?.call(this)
  delete disposers[name]
}

export function clearDataProviders() {
  Object.keys(dataState.providers).forEach(key => {
    disposers[key]?.call(this)
    delete disposers[key]
    delete dataState.providers[key]
  })
}
