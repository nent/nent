import { DiscardStrategy } from './interfaces'
import { AudioTrack } from './track'

/* It's a list of audio tracks that can be played, stopped, and destroyed */
export class AudioList {
  public items: Array<AudioTrack> = []

  /**
   * It returns true if the length of the items array is equal to 0
   * @returns The length of the items array.
   */
  public isEmpty() {
    return this.items.length == 0
  }

  /**
   * If the length of the items array is greater than 0, return true
   * @returns The length of the items array.
   */
  public hasItems() {
    return this.items.length > 0
  }

  /**
   * Find the first item in the items array that has a trackId property that matches the trackId
   * parameter. If no item is found, return null
   * @param {string} trackId - The trackId of the track you want to find.
   * @returns The trackId of the track that is being searched for.
   */
  public findTrack(trackId: string) {
    return this.items.find(a => a.trackId == trackId) || null
  }

  /**
   * It stops all the items in the items array.
   */
  public stop() {
    this.items.forEach(t => {
      if (t.playing()) t.stop()
    })
  }

  /**
   * It destroys all the items in the array.
   */
  public destroy() {
    this.items.forEach(a => a.destroy())
  }

  /**
   * It filters out the audio tracks that have a discard strategy that matches one of the reasons
   * passed in
   * @param {DiscardStrategy[]} reasons - DiscardStrategy[]
   */
  public discard(...reasons: DiscardStrategy[]) {
    const eligibleAudio = (audio: AudioTrack) =>
      !reasons.includes(audio.discard)
    this.items = this.items.filter(i => eligibleAudio(i)) || null
  }
}
