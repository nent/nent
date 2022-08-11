import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioList } from './list'
import { AudioTrack } from './track'

/* It's a list of audio tracks that can be queued and played in order */
export class AudioQueue extends AudioList {
  /**
   * It adds a new track to the queue
   * @param {AudioInfo} info - AudioInfo - This is the audio info object that is passed to the
   * queueAudio function.
   * @param {Listener} onEnd - Listener - This is a function that is called when the track is finished
   * playing.
   * @returns The length of the array.
   */
  public queueAudio(info: AudioInfo, onEnd: Listener) {
    const found = this.findTrack(info.trackId!)
    if (found) return

    const track = new AudioTrack(info, () => {
      if (track.discard != DiscardStrategy.none) {
        track?.destroy()
      }
      onEnd()
    })
    return this.items.push(track)
  }

  /**
   * It takes an AudioTrack and a Listener, and returns the index of the inserted track
   * @param {AudioTrack} track - AudioTrack - The track to insert
   * @param {Listener} onEnd - Listener
   * @returns The index of the inserted item.
   */
  public insertTrack(track: AudioTrack, onEnd: Listener) {
    const originalOnEnd = track.onEnd
    track.onEnd = () => {
      originalOnEnd?.call(track, track)
      onEnd()
    }

    return this.items.unshift(track)
  }

  /**
   * "If there are items in the queue, return the first one, otherwise return null."
   *
   * The first line of the function is a TypeScript type annotation. It's saying that the function will
   * return either an AudioTrack or null
   * @returns The first item in the array or null if the array is empty.
   */
  public getNext(): AudioTrack | null {
    return this.items.shift() || null
  }
}
