import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioLoader } from './list-loader'
import { AudioQueue } from './list-queue'
import { PlayerBase } from './player-base'
import { markTrack } from './tracks'

/* It's a class that manages the loading, playing, and queuing of audio */
export class MusicPlayer extends PlayerBase {
  loader: AudioLoader = new AudioLoader()
  queue: AudioQueue = new AudioQueue()

  /**
   * The constructor function is a special function that is called when an object is created from a
   * class
   * @param {Listener} changed - Listener - This is the listener that will be called when the value of
   * the property changes.
   */
  constructor(private changed: Listener) {
    super()
  }

  /**
   * It queues an audio file, and if there is no active audio file, it plays the queued audio file
   * @param {AudioInfo} info - AudioInfo - The audio info of the audio you want to queue.
   */
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

  /**
   * It loads an audio file, and then calls the changed function
   * @param {AudioInfo} info - AudioInfo
   */
  public load(info: AudioInfo) {
    this.loader.load(info, this.changed)
    this.changed()
  }

  /**
   * It plays a track
   * @param {string} trackId - The id of the track to play
   */
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

  /**
   * If the loader is discarded, discard the queue and notify the world that the queue has changed.
   * @param {DiscardStrategy[]} reasons - DiscardStrategy[]
   */
  public discard(...reasons: DiscardStrategy[]) {
    super.discard(...reasons)
    this.loader.discard(...reasons)
    this.queue.discard(...reasons)
    this.changed()
  }

  /**
   * If the active audio is not null, or the loader has items, or the queue has items, then return true
   * @returns A boolean value.
   */
  public hasAudio() {
    return (
      this.active != null ||
      this.loader.hasItems() ||
      this.queue.hasItems()
    )
  }

  /**
   * It destroys the active scene, the loader, and the queue.
   */
  public destroy() {
    this.active?.destroy()
    this.loader.destroy()
    this.queue.destroy()
  }
}
