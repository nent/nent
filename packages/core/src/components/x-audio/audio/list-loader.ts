import { Listener } from '../../../services/common/interfaces'
import { AudioInfo, DiscardStrategy } from './interfaces'
import { AudioList } from './list'
import { AudioTrack } from './track'

export class AudioLoader extends AudioList {
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
