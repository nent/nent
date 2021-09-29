/* istanbul ignore file */

import jsonata from 'jsonata'

export async function filterData(filterString: string, data: any) {
  const filter = jsonata(filterString)
  return filter.evaluate(data)
}
