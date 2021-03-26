import { PlayerBase } from './player-base'

class FakePlayer extends PlayerBase {
  constructor() {
    super()
    // @ts-ignore
    this.active = {
      pause: jest.fn(),
      play: jest.fn(),
      stop: jest.fn(),
      resume: jest.fn(),
      mute: jest.fn(),
    }
  }
}

describe('player-base', () => {
  it('pause', () => {
    // Method call
    const player = new FakePlayer()
    player.pause()
    expect(player.active!.pause).toBeCalled()
  })

  it('play', () => {
    // Method call
    const player = new FakePlayer()
    player.play()
    expect(player.active!.play).toBeCalled()
  })

  it('stop', () => {
    // Method call
    const player = new FakePlayer()
    player.stop()
    expect(player.active!.stop).toBeCalled()
  })

  it('resume', () => {
    // Method call
    const player = new FakePlayer()
    player.resume()
    expect(player.active!.resume).toBeCalled()
  })

  it('mute', () => {
    const player = new FakePlayer()
    player.mute(true)
    expect(player.active!.mute).toBeCalledWith(true)
  })

  it('mute, false', () => {
    const player = new FakePlayer()
    player.mute(false)
    expect(player.active!.mute).toBeCalledWith(false)
  })
})
