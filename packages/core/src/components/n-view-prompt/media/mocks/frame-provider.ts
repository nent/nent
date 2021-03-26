/* istanbul ignore file */

export class MockRequestAnimationFrameProvider
  implements AnimationFrameProvider {
  handleCounter = 0
  queue = new Map()

  requestAnimationFrame(callback: { (): void; (): void }) {
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
