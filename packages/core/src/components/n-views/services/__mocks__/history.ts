/* istanbul ignore file */

export class MockHistory implements History {
  constructor(_window: Window) {}
  items: any[] = []
  get length() {
    return this.items.length
  }
  get current() {
    return this.length - 1
  }
  scrollRestoration!: ScrollRestoration
  state: any
  back(): void {
    this.go(-1)
  }
  forward(): void {
    this.go(1)
  }
  go(delta: number): void {
    let index = this.current + delta
    this.state = this.items[index] || {}
  }
  pushState(data: any, title: string, url?: string | null): void {
    let current = this.length + 1
    this.state = {
      index: current,
      ...data,
    }
    this.items.push({
      data,
      title,
      url,
    })
  }
  replaceState(data: any, title: string, url?: string | null): void {
    this.state = this.items[this.current] = {
      data,
      title,
      url,
    }
  }
}
