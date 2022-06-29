export function dedent(innerText: string) {
  const string = innerText?.replace(/^\n/, '')
  const match = string?.match(/^\s+/)
  return match
    ? string?.replace(new RegExp(`^${match[0]}`, 'gm'), '')
    : string
}
