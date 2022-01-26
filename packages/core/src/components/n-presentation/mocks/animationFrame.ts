/* istanbul ignore file */

export class RequestAnimationFrameMockSession {
  handleCounter: number = 0
  queue: Map<number, FrameRequestCallback>

  constructor() {
    this.handleCounter = 0
    this.queue = new Map<number, FrameRequestCallback>()
  }
  requestAnimationFrame(callback: FrameRequestCallback) {
    const handle = this.handleCounter++
    this.queue.set(handle, callback)
    return handle
  }
  cancelAnimationFrame(handle: number) {
    this.queue.delete(handle)
  }
  triggerNextAnimationFrame(time = performance.now()) {
    const nextEntry = this.queue.entries().next().value
    if (nextEntry === undefined) return

    const [nextHandle, nextCallback] = nextEntry

    nextCallback(time)
    this.queue.delete(nextHandle)
  }
  triggerAllAnimationFrames(time = performance.now()) {
    while (this.queue.size > 0) this.triggerNextAnimationFrame(time)
  }
  reset() {
    this.queue.clear()
    this.handleCounter = 0
  }
}
