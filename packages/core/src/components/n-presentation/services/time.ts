import { TimeDetails } from './interfaces'

export function getTimeDetails(
  startTicks: number,
  timeTicks: number,
  durationMs: number,
): TimeDetails {
  const elapsed = timeTicks - startTicks
  const percentage = durationMs > 0 ? elapsed / durationMs : 0
  const ended = durationMs > 0 && elapsed >= durationMs
  const durationSeconds = durationMs * 1000
  const elapsedSeconds = Math.floor(elapsed / 1000)
  if (ended)
    return {
      hours: Math.floor((elapsedSeconds / 3600) % 24),
      minutes: Math.floor((elapsedSeconds / 60) % 60),
      seconds: Math.floor(elapsedSeconds % 60),
      elapsed: durationMs,
      elapsedSeconds,
      percentage: 1,
      duration: durationMs,
      durationSeconds,
      ended,
    }
  if (elapsed > 0) {
    return {
      hours: Math.floor((elapsedSeconds / 3600) % 24),
      minutes: Math.floor((elapsedSeconds / 60) % 60),
      seconds: Math.floor(elapsedSeconds % 60),
      elapsed: elapsed,
      elapsedSeconds,
      percentage,
      duration: durationMs,
      durationSeconds,
      ended,
    }
  }

  return {
    hours: 0,
    minutes: 0,
    seconds: 0,
    elapsed,
    elapsedSeconds,
    percentage,
    duration: durationMs,
    durationSeconds,
    ended,
  }
}
