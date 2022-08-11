import { DiscardStrategy } from './interfaces'
import { AudioTrack } from './track'

/* Exporting the class so that it can be used in other files. */
export abstract class PlayerBase {
  active: AudioTrack | null = null

  /**
   * If the active audio is not null, pause it
   */
  public pause() {
    this.active?.pause()
  }

  /**
   * If the active audio is not null, then call the play() method on it
   */
  public play() {
    this.active?.play()
  }

  /**
   * If the active audio is not null, then call the stop() method on it
   */
  public stop() {
    this.active?.stop()
  }

  /**
   * If the active audio is not null, then call the resume() method on it
   */
  public resume() {
    this.active?.resume()
  }

  /**
   * It sets the mute state of the active player
   * @param {boolean} mute - boolean - Whether to mute or unmute the video
   */
  public mute(mute: boolean) {
    this.active?.mute(mute)
  }

  /**
   * If the active strategy is being discarded, destroy it
   * @param {DiscardStrategy[]} reasons - DiscardStrategy[]
   */
  protected discard(...reasons: DiscardStrategy[]) {
    if (this.active && reasons.includes(this.active!.discard)) {
      this.active?.destroy()
      this.active = null
    }
  }
}
