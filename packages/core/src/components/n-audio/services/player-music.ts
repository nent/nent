import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioLoader } from './list-loader'
import { AudioQueue } from './list-queue'
import { PlayerBase } from './player-base'
import { markTrack } from './tracks'

export class MusicPlayer extends PlayerBase {
  loader: AudioLoader = new AudioLoader()
  queue: AudioQueue = new AudioQueue()

  constructor(private changed: Listener) {
    super()
  }

  public queueAudio(info: AudioInfo) {
    this.queue.queueAudio(info, () => {
      this.active = this.queue.getNext()
      this.active?.play()
      this.changed()
    })
    if (this.active == null) {
      this.active = this.queue.getNext()
      this.active?.play()
    }
    this.changed()
  }

  public load(info: AudioInfo) {
    this.loader.load(info, this.changed)
    this.changed()
  }

  public async playTrack(trackId: string) {
    const track = this.loader.findTrack(trackId)
    if (track) {
      this.loader.stop()
      this.queue.insertTrack(track, () => {
        this.active = this.queue.getNext()
        this.active?.play()
        this.changed()
      })

      this.discard(DiscardStrategy.next)
      this.active = this.queue.getNext()
      this.active?.play()
      await markTrack(trackId)
      this.changed()
    }
  }

  public discard(...reasons: DiscardStrategy[]) {
    super.discard(...reasons)
    this.loader.discard(...reasons)
    this.queue.discard(...reasons)
    this.changed()
  }

  public hasAudio() {
    return (
      this.active != null ||
      this.loader.hasItems() ||
      this.queue.hasItems()
    )
  }

  public destroy() {
    this.active?.destroy()
    this.loader.destroy()
    this.queue.destroy()
  }
}
