/* istanbul ignore file */

import { debugIf } from '../../../services/common/logging'
import { TimedNode } from './interfaces'

export function captureElementChildTimedNodes(
  rootElement: HTMLElement,
  defaultDuration: number,
) {
  const timedNodes: TimedNode[] = []
  rootElement
    .querySelectorAll('[n-in-time], [n-out-time]')
    ?.forEach(element => {
      const startAttribute = element.getAttribute('n-in-time')
      const start = startAttribute
        ? Number.parseFloat(startAttribute)
        : 0
      const endAttribute = element.getAttribute('n-out-time')
      const end = endAttribute
        ? Number.parseFloat(endAttribute)
        : defaultDuration
      timedNodes.push({
        start,
        end,
        classIn: element.getAttribute('n-in-class'),
        classOut: element.getAttribute('n-out-class'),
        element,
      })
    })
  return timedNodes
}

export function resolveElementChildTimedNodesByTime(
  rootElement: HTMLElement,
  timedNodes: TimedNode[],
  time: number,
  percentage: number,
  debug: boolean,
) {
  timedNodes?.forEach(node => {
    if (
      node.start > -1 &&
      time >= node.start &&
      (node.end > -1 ? time < node.end : true)
    ) {
      debugIf(
        debug,
        `n-elements-timer: node ${node.element.id} is after start: ${node.start} before end: ${node.end}`,
      )
      // Time is after start and before end, if it exists
      if (
        node.classIn &&
        !node.element.classList.contains(node.classIn)
      ) {
        debugIf(
          debug,
          `n-elements-timer: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [adding classIn: ${node.classIn}]`,
        )
        node.element.classList.add(node.classIn)
      }

      if (node.element.hasAttribute('hidden')) {
        debugIf(
          debug,
          `n-elements-timer: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [removing hidden attribute]`,
        )
        // Otherwise, if there's a hidden attribute, remove it
        node.element.removeAttribute('hidden')
      }
    }

    if (node.end > -1 && time > node.end) {
      // Time is after end, if it exists
      debugIf(
        debug,
        `n-elements-timer: node ${node.element.id} is after end: ${node.end}`,
      )
      if (
        node.classIn &&
        node.element.classList.contains(node.classIn)
      ) {
        debugIf(
          debug,
          `n-elements-timer: node ${node.element.id} is after end: ${node.end}  [removing classIn: ${node.classIn}]`,
        )
        // Remove the in class, if it exists
        node.element.classList.remove(node.classIn)
      }

      if (node.classOut) {
        // If a class-out was specified and isn't on the element, add it
        if (!node.element.classList.contains(node.classOut)) {
          debugIf(
            debug,
            `n-elements-timer: node ${node.element.id} is after end: ${node.end} [adding classOut: ${node.classOut}]`,
          )
          node.element.classList.add(node.classOut)
        }
      } else if (!node.element.hasAttribute('hidden')) {
        // Otherwise, if there's no hidden attribute, add it
        debugIf(
          debug,
          `n-elements-timer: node ${node.element.id} is after end: ${node.end} [adding hidden attribute]`,
        )
        node.element.setAttribute('hidden', '')
      }
    }
  })

  // Resolve n-time-to
  const timeValueElements = rootElement.querySelectorAll(
    '[n-time-to]',
  )
  timeValueElements?.forEach(el => {
    const seconds = time
    const attributeName = el.getAttribute('n-time-to')
    if (attributeName) {
      el.setAttribute(attributeName, seconds.toString())
    } else {
      el.childNodes.forEach(cn => cn.remove())
      el.append(document.createTextNode(seconds.toString()))
    }
  })

  // Resolve n-percentage-to
  const timePercentageValueElements = rootElement.querySelectorAll(
    '[n-percentage-to]',
  )
  timePercentageValueElements?.forEach(element => {
    const attributeName = element.getAttribute('n-percentage-to')
    if (attributeName) {
      element.setAttribute(attributeName, percentage.toFixed(2))
    } else {
      element.childNodes.forEach(cn => cn.remove())
      element.append(
        document.createTextNode(`${Math.round(percentage * 100)}%`),
      )
    }
  })
}

export function restoreElementChildTimedNodes(
  rootElement: HTMLElement,
  timedNodes: TimedNode[],
) {
  timedNodes?.forEach(node => {
    if (
      node.classIn &&
      node.element.classList.contains(node.classIn)
    ) {
      node.element.classList.remove(node.classIn)
    }

    if (
      node.classOut &&
      node.element.classList.contains(node.classOut)
    ) {
      node.element.classList.remove(node.classOut)
    }

    if (!node.element.hasAttribute('hidden')) {
      node.element.setAttribute('hidden', '')
    }
  })

  // Resolve n-time-to
  const timeValueElements = rootElement.querySelectorAll(
    '[n-time-to]',
  )
  timeValueElements?.forEach(el => {
    const attributeName = el.getAttribute('n-time-to')
    if (attributeName) {
      el.setAttribute(attributeName, '0')
    } else {
      el.childNodes.forEach(cn => cn.remove())
      el.append(document.createTextNode('0'))
    }
  })

  // Resolve n-percentage-to
  const timePercentageValueElements = rootElement.querySelectorAll(
    '[n-percentage-to]',
  )
  timePercentageValueElements?.forEach(el => {
    const attributeName = el.getAttribute('n-percentage-to')
    if (attributeName) {
      el.setAttribute(attributeName, '0')
    } else {
      el.childNodes.forEach(cn => cn.remove())
      el.append(document.createTextNode('0%'))
    }
  })
}
