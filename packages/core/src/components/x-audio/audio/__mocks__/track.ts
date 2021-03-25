/* istanbul ignore file */

import { Listener } from '../../../../services/common/interfaces'
import {
  AudioInfo,
  AudioType,
  DiscardStrategy,
  LoadStrategy,
} from '../interfaces'

export class AudioTrack implements AudioInfo {
  trackId!: string
  type!: AudioType
  src!: string
  mode!: LoadStrategy
  discard!: DiscardStrategy
  preventRepeat!: boolean
  loop!: boolean
  volume: number = 0.5
  playing: boolean = false
  state: string = 'loading'
  time: number = 0

  public get muted() {
    return this.volume == 0
  }

  onEnd?: Listener
  onLoad?: Listener

  constructor(info: AudioInfo, onEnd?: Listener) {
    Object.assign(this, info, {
      onEnd: () => {
        this.playing = false
        onEnd?.call(this, this)
      },
    })
    this.state = 'loaded'
    setTimeout(() => {
      this.onLoad?.call(this)
    }, 500)
  }

  start() {
    this.play()
  }

  play() {
    this.playing = true
    return this
  }

  pause() {
    this.playing = false
    return this
  }

  resume() {
    return this.play()
  }

  stop() {
    this.playing = false
    return this
  }

  mute(mute: boolean) {
    return (this.volume = mute ? 0 : 0.5)
  }

  seek(time: number) {
    this.time = time
    return this
  }

  setVolume(value: number) {
    this.volume = value
    return this
  }

  destroy() {
    this.playing = false
    this.state = 'unloaded'
  }
}
