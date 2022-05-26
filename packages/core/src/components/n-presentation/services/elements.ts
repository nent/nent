/* istanbul ignore file */

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
  elapsedSeconds: number,
  percentage: number,
) {
  timedNodes?.forEach(node => {
    if (
      node.start > -1 &&
      elapsedSeconds >= node.start &&
      (node.end > -1 ? elapsedSeconds < node.end : true)
    ) {
      // Time is after start and before end, if it exists
      if (
        node.classIn &&
        !node.element.classList.contains(node.classIn)
      ) {
        node.element.classList.add(node.classIn)
      }

      if (node.element.hasAttribute('hidden')) {
        // Otherwise, if there's a hidden attribute, remove it
        node.element.removeAttribute('hidden')
      }
    }

    if (node.end > -1 && elapsedSeconds >= node.end) {
      // Time is after end, if it exists

      if (
        node.classIn &&
        node.element.classList.contains(node.classIn)
      ) {
        // Remove the in class, if it exists
        node.element.classList.remove(node.classIn)
      }

      if (node.classOut) {
        // If a class-out was specified and isn't on the element, add it
        if (!node.element.classList.contains(node.classOut)) {
          node.element.classList.add(node.classOut)
        }
      } else if (!node.element.hasAttribute('hidden')) {
        // Otherwise, if there's no hidden attribute, add it

        node.element.setAttribute('hidden', '')
      }
    }
  })

  // Resolve n-time-to
  const timeValueElements =
    rootElement.querySelectorAll('[n-time-to]')
  timeValueElements?.forEach(el => {
    const seconds = elapsedSeconds
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
  })

  // Resolve n-time-to
  const timeValueElements =
    rootElement.querySelectorAll('[n-time-to]')
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
      el.append(document.createTextNode('100%'))
    }
  })
}
