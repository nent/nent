/**
 * It removes the leading whitespace from a string
 * @param {string} innerText - The text to dedent.
 * @returns the string with the leading whitespace removed.
 */
export function dedent(innerText: string) {
  const string = innerText?.replace(/^\n/, '')
  const match = string?.match(/^\s+/)
  return match
    ? string?.replace(new RegExp(`^${match[0]}`, 'gm'), '')
    : string
}
