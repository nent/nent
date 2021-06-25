import { eventBus } from '../actions'
import {
  commonState,
  debounce,
  debugIf,
  EventEmitter,
  requireValue,
} from '../common'
import { DATA_EVENTS, IDataProvider } from './interfaces'
import { dataState } from './state'

const disposers: Record<string, () => void> = {}

const NEW_PROVIDER_ADDED = 'new-provider-added'
const emitter = new EventEmitter()

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

  const debouncedChanges = debounce(
    1000,
    (...args: any[]) => {
      eventBus.emit(DATA_EVENTS.DataChanged, {
        provider: name,
        data: args,
      })
    },
    false,
  )

  const dispose = provider.changed?.on('*', (...args: any[]) => {
    debouncedChanges(args)
  })
  disposers[name] = dispose!

  dataState.providers[name.toLowerCase()] = provider
  emitter.emit(NEW_PROVIDER_ADDED, name.toLocaleLowerCase())

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

  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      resolve(null)
    }, dataState.providerTimeout * 1000)

    const dispose = emitter.on(
      NEW_PROVIDER_ADDED,
      (registered: string) => {
        if (name == registered) {
          clearTimeout(timeout)
          dispose()
          resolve(dataState.providers[key])
        }
      },
    )
  })
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
