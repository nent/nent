import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioLoader } from './list-loader'
import { PlayerBase } from './player-base'
import { markTrack } from './tracks'

export class SoundPlayer extends PlayerBase {
  loader: AudioLoader = new AudioLoader()

  constructor(private changed: Listener) {
    super()
  }

  load(info: AudioInfo) {
    this.loader.load(info, () => {
      this.active = null
      this.changed()
    })
    this.changed()
  }

  public async playTrack(trackId: string) {
    const track = this.loader.findTrack(trackId)
    if (track) {
      this.loader.stop()
      this.active = null
      this.discard(DiscardStrategy.next)
      this.active = track
      track.play()
      await markTrack(trackId)
      this.changed()
    }
  }

  public discard(...reasons: DiscardStrategy[]) {
    if (this.active && reasons.includes(this.active!.discard)) {
      this.active?.destroy()
      this.active = null
    }
    this.loader.discard(...reasons)
    this.changed()
  }

  public hasAudio() {
    return this.active != null || this.loader.hasItems
  }

  public destroy() {
    this.active?.destroy()
    this.loader.destroy()
  }
}
