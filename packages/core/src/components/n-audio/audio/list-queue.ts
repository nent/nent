import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioList } from './list'
import { AudioTrack } from './track'

export class AudioQueue extends AudioList {
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

  public insertTrack(track: AudioTrack, onEnd: Listener) {
    const originalOnEnd = track.onEnd
    track.onEnd = () => {
      originalOnEnd?.call(track, track)
      onEnd()
    }

    return this.items.unshift(track)
  }

  public getNext(): AudioTrack | null {
    return this.items.shift() || null
  }
}
