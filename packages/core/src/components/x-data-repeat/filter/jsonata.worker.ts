/* istanbul ignore file */

;(self as any).importScripts(
  'https://cdn.jsdelivr.net/npm/jsonata@1.8.4/jsonata.min.js',
)

import { valueToArray } from '../../../services/common/values'
/**
 * Filters data
 * @param filterString
 * @param data
 * @returns
 */
export async function filterData(filterString: string, data: any) {
  const filter = (self as any).jsonata(filterString)
  return valueToArray(filter.evaluate(data))
}
