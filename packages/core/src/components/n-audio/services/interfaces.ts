export const AUDIO_TOPIC = 'audio'

export interface AudioRequest {
  trackId?: string
  type: AudioType
  value: any
}

export interface AudioInfo {
  trackId?: string
  type: AudioType
  src: string
  mode: LoadStrategy
  discard: DiscardStrategy
  loop: boolean
}

export enum AUDIO_COMMANDS {
  enable = 'enable',
  disable = 'disable',
  play = 'play',
  queue = 'queue',
  load = 'load',
  start = 'start',
  pause = 'pause',
  resume = 'resume',
  mute = 'mute',
  volume = 'volume',
  seek = 'seek',
  stop = 'stop',
}

export enum AUDIO_EVENTS {
  Played = 'played',
  Queued = 'queued',
  Dequeued = 'dequeued',
  Loaded = 'loaded',
  Started = 'started',
  Paused = 'paused',
  Resumed = 'resumed',
  Stopped = 'stopped',
  Muted = 'muted',
  Ended = 'ended',
  Looped = 'looped',
  Errored = 'errored',
  Discarded = 'discarded',
  SoundChanged = 'muted',
}

export enum DiscardStrategy {
  route = 'view',
  next = 'next',
  none = 'none',
}

export enum LoadStrategy {
  queue = 'queue',
  play = 'play',
  load = 'load',
}

export enum AudioType {
  sound = 'sound',
  music = 'music',
}
