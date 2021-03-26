import { DiscardStrategy } from './interfaces'
import { AudioTrack } from './track'

export class AudioList {
  public items: Array<AudioTrack> = []

  public get isEmpty() {
    return this.items.length == 0
  }

  public findTrack(trackId: string) {
    return this.items.find(a => a.trackId == trackId) || null
  }

  public stop() {
    this.items.forEach(t => {
      if (t.playing) t.stop()
    })
  }

  public destroy() {
    this.items.forEach(a => a.destroy())
  }

  public discard(...reasons: DiscardStrategy[]) {
    const eligibleAudio = (audio: AudioTrack) =>
      !reasons.includes(audio.discard)
    this.items = this.items.filter(i => eligibleAudio(i)) || null
  }
}
