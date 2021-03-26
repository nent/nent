/* istanbul ignore file */

import jsonata from 'jsonata'
import { valueToArray } from '../../../../services/common'

export async function filterData(filterString: string, data: any) {
  const filter = jsonata(filterString)
  return valueToArray(filter.evaluate(data))
}
