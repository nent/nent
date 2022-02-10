export type ReferenceCompleteResults = {
  type: ReferenceType
  loaded: boolean
}

export enum ReferenceType {
  script = 'script',
  styles = 'styles',
}
