/* istanbul ignore file */

import { EventEmitter } from '../../../../services/common'
import { AudioType } from '../interfaces'
import { MusicPlayer } from '../player-music'
import { SoundPlayer } from '../player-sound'
import { audioState } from '../state'

export class AudioActionListener {
  public changed: EventEmitter
  private _isPlaying: boolean = false
  constructor(
    public eventBus: EventEmitter,
    public actionBus: EventEmitter,
    public debug: boolean = false,
  ) {
    this.changed = new EventEmitter()
    this.music = new MusicPlayer(() => {
      this.changed.emit('changed')
    })

    this.sound = new SoundPlayer(() => {
      this.changed.emit('changed')
    })

    this.enabled = audioState.enabled
  }

  public music!: MusicPlayer
  public sound!: SoundPlayer
  public enabled!: boolean

  // Public Members
  public isPlaying(): boolean {
    return this._isPlaying
  }

  public hasAudio(): boolean {
    return true
  }

  public pause() {
    this._isPlaying = false
    this.changed.emit('changed')
  }

  public play() {
    this._isPlaying = true
    this.changed.emit('changed')
  }

  public stop() {
    this._isPlaying = false
    this.changed.emit('changed')
  }

  public resume() {
    this._isPlaying = true
    this.changed.emit('changed')
  }

  public muted: boolean = false
  public mute(mute = false) {
    this.muted = mute
    this.changed.emit('changed')
  }

  public seek(_type: AudioType, _trackId: string, _seek: number) {
    //
    this.changed.emit('changed')
  }

  public volume: number = 0.5
  public setVolume(value: number) {
    this.volume = value
    this.changed.emit('changed')
  }

  destroy() {
    //
  }
}
