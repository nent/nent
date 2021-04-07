export interface IView {
  next(): Promise<void>
  back(): Promise<void>
}
