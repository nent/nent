/* istanbul ignore file */
;(self as any).importScripts(
  'https://cdn.jsdelivr.net/npm/jsonata@1.8.6/jsonata.min.js',
)

/**
 * Filters data
 * @param filterString
 * @param data
 * @returns
 */
export async function filterData(filterString: string, data: any) {
  const filter = (self as any).jsonata(filterString)
  return filter.evaluate(data)
}
