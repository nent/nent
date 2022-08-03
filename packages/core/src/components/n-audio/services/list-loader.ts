import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioList } from './list'
import { AudioTrack } from './track'

/* It loads audio tracks and keeps them in memory until they are no longer needed */
export class AudioLoader extends AudioList {
  /**
   * It loads an audio track into the player
   * @param {AudioInfo} info - AudioInfo - This is the audio info object that contains the track id,
   * the track name, the track url, and the track duration.
   * @param {Listener} onChanged - This is a callback function that is called when the track is loaded.
   * @returns The track is being returned.
   */
  public load(info: AudioInfo, onChanged: Listener) {
    const found = this.findTrack(info.trackId!)
    if (found) return
    const track = new AudioTrack(info, () => {
      if (track.discard != DiscardStrategy.none) {
        track?.destroy()
      }
      onChanged()
    })
    this.items.push(track)
  }
}
