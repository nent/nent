import { DiscardStrategy } from './interfaces'
import { AudioTrack } from './track'

export abstract class PlayerBase {
  active: AudioTrack | null = null

  public pause() {
    this.active?.pause()
  }

  public play() {
    this.active?.play()
  }

  public stop() {
    this.active?.stop()
  }

  public resume() {
    this.active?.resume()
  }

  public mute(mute: boolean) {
    this.active?.mute(mute)
  }

  protected discard(...reasons: DiscardStrategy[]) {
    if (this.active && reasons.includes(this.active!.discard)) {
      this.active?.destroy()
      this.active = null
    }
  }
}
