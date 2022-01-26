import { TimeDetails } from './interfaces'

export function getTimeDetails(
  start: number,
  time: number,
  duration: number,
): TimeDetails {
  const elapsed = (time - start) / 1000
  const percentage = duration > 0 ? elapsed / duration : 0
  const ended = duration > 0 && elapsed >= duration
  if (ended)
    return {
      hours: Math.floor((elapsed / 3600) % 24),
      minutes: Math.floor((elapsed / 60) % 60),
      seconds: Math.floor(elapsed % 60),
      elapsed: duration,
      percentage: 1,
      duration,
      ended,
    }
  if (elapsed > 0) {
    return {
      hours: Math.floor((elapsed / 3600) % 24),
      minutes: Math.floor((elapsed / 60) % 60),
      seconds: Math.floor(elapsed % 60),
      elapsed: Number(elapsed.toFixed(2)),
      percentage,
      duration,
      ended,
    }
  }

  return {
    hours: 0,
    minutes: 0,
    seconds: 0,
    elapsed,
    percentage,
    duration,
    ended,
  }
}
