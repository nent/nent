import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioLoader } from './list-loader'
import { PlayerBase } from './player-base'
import { markTrack } from './tracks'

/* It's a wrapper around an AudioLoader that keeps track of the currently playing track and allows you
to play a new track */
export class SoundPlayer extends PlayerBase {
  loader: AudioLoader = new AudioLoader()

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
   * It loads an audio file, and when it's done loading, it sets the active audio to null and calls the
   * changed function
   * @param {AudioInfo} info - AudioInfo
   */
  public load(info: AudioInfo) {
    this.loader.load(info, () => {
      this.active = null
      this.changed()
    })
    this.changed()
  }

  /**
   * It plays a track
   * @param {string} trackId - The id of the track to play.
   */
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

  /**
   * If the active strategy is being discarded, destroy it and set it to null
   * @param {DiscardStrategy[]} reasons - DiscardStrategy[]
   */
  public discard(...reasons: DiscardStrategy[]) {
    if (this.active && reasons.includes(this.active!.discard)) {
      this.active?.destroy()
      this.active = null
    }
    this.loader.discard(...reasons)
    this.changed()
  }

  /**
   * If the active item is not null, or the loader has items, then return true
   * @returns A boolean value.
   */
  public hasAudio() {
    return this.active != null || this.loader.hasItems()
  }

  /**
   * It destroys the active scene and the loader.
   */
  public destroy() {
    this.active?.destroy()
    this.loader.destroy()
  }
}
