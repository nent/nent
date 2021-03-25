/* istanbul ignore file */

import { debugIf } from '../../../services/common/logging'
import { captureElementsEventOnce } from '../../../services/navigation/elements'
import { TimedNode } from './interfaces'

export function getChildInputValidity(rootElement: HTMLElement) {
  let valid = true
  const inputElements = rootElement.querySelectorAll('*:enabled')
  inputElements.forEach(i => {
    const input = i as HTMLInputElement
    input.blur?.call(i)
    if (input.reportValidity?.call(input) === false) {
      valid = false
    }
  })
  return valid
}

export function captureXBackClickEvent(
  rootElement: HTMLElement,
  eventHandler: (tag: string) => void,
) {
  captureElementsEventOnce<HTMLElement, MouseEvent>(
    rootElement,
    '[x-back]',
    'click',
    (el: HTMLElement, _e: MouseEvent) => {
      eventHandler(el.localName)
    },
  )

  captureElementsEventOnce<HTMLElement, KeyboardEvent>(
    rootElement,
    '[x-back]',
    'keydown',
    (el: HTMLElement, e: KeyboardEvent) => {
      if (e.isComposing) return
      if (e.key == 'Space' || e.key == 'Enter') {
        eventHandler(el.localName)
      }
    },
  )
}

export function captureXNextClickEvent(
  rootElement: HTMLElement,
  eventHandler: (tag: string, route?: string | null) => void,
) {
  captureElementsEventOnce<HTMLElement, MouseEvent>(
    rootElement,
    '[x-next]',
    'click',
    (el: HTMLElement, _e: MouseEvent) => {
      const route = el.getAttribute('x-next')
      eventHandler(el.localName, route)
    },
  )
  captureElementsEventOnce<HTMLElement, KeyboardEvent>(
    rootElement,
    '[x-next]',
    'keydown',
    (el: HTMLElement, e: KeyboardEvent) => {
      if (e.isComposing) return
      if (e.key == 'Space' || e.key == 'Enter') {
        const route = el.getAttribute('x-next')
        eventHandler(el.localName, route)
      }
    },
  )
}

export function captureXLinkClickEvent(
  rootElement: HTMLElement,
  eventHandler: (tag: string, route?: string | null) => void,
) {
  captureElementsEventOnce<HTMLElement, MouseEvent>(
    rootElement,
    '[x-link]',
    'click',
    (el: HTMLElement, _e: MouseEvent) => {
      const route = el.getAttribute('x-link')
      eventHandler(el.localName, route)
    },
  )
}

export function captureElementChildTimedNodes(
  rootElement: HTMLElement,
  defaultDuration: number,
) {
  const timedNodes: TimedNode[] = []
  rootElement
    .querySelectorAll('[x-in-time], [x-out-time]')
    ?.forEach(element => {
      const startAttribute = element.getAttribute('x-in-time')
      const start = startAttribute
        ? Number.parseFloat(startAttribute)
        : 0
      const endAttribute = element.getAttribute('x-out-time')
      const end = endAttribute
        ? Number.parseFloat(endAttribute)
        : defaultDuration
      timedNodes.push({
        start,
        end,
        classIn: element.getAttribute('x-in-class'),
        classOut: element.getAttribute('x-out-class'),
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
        `x-app-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end}`,
      )
      // Time is after start and before end, if it exists
      if (
        node.classIn &&
        !node.element.classList.contains(node.classIn)
      ) {
        debugIf(
          debug,
          `x-app-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [adding classIn: ${node.classIn}]`,
        )
        node.element.classList.add(node.classIn)
      }

      if (node.element.hasAttribute('hidden')) {
        debugIf(
          debug,
          `x-app-view-do: node ${node.element.id} is after start: ${node.start} before end: ${node.end} [removing hidden attribute]`,
        )
        // Otherwise, if there's a hidden attribute, remove it
        node.element.removeAttribute('hidden')
      }
    }

    if (node.end > -1 && time > node.end) {
      // Time is after end, if it exists
      debugIf(
        debug,
        `x-app-view-do: node ${node.element.id} is after end: ${node.end}`,
      )
      if (
        node.classIn &&
        node.element.classList.contains(node.classIn)
      ) {
        debugIf(
          debug,
          `x-app-view-do: node ${node.element.id} is after end: ${node.end}  [removing classIn: ${node.classIn}]`,
        )
        // Remove the in class, if it exists
        node.element.classList.remove(node.classIn)
      }

      if (node.classOut) {
        // If a class-out was specified and isn't on the element, add it
        if (!node.element.classList.contains(node.classOut)) {
          debugIf(
            debug,
            `x-app-view-do: node ${node.element.id} is after end: ${node.end} [adding classOut: ${node.classOut}]`,
          )
          node.element.classList.add(node.classOut)
        }
      } else if (!node.element.hasAttribute('hidden')) {
        // Otherwise, if there's no hidden attribute, add it
        debugIf(
          debug,
          `x-app-view-do: node ${node.element.id} is after end: ${node.end} [adding hidden attribute]`,
        )
        node.element.setAttribute('hidden', '')
      }
    }
  })

  // Resolve x-time-to
  const timeValueElements = rootElement.querySelectorAll(
    '[x-time-to]',
  )
  timeValueElements?.forEach(el => {
    const seconds = time
    const attributeName = el.getAttribute('x-time-to')
    if (attributeName) {
      el.setAttribute(attributeName, seconds.toString())
    } else {
      el.childNodes.forEach(cn => cn.remove())
      el.append(document.createTextNode(seconds.toString()))
    }
  })

  // Resolve x-percentage-to
  const timePercentageValueElements = rootElement.querySelectorAll(
    '[x-percentage-to]',
  )
  timePercentageValueElements?.forEach(element => {
    const attributeName = element.getAttribute('x-percentage-to')
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

  // Resolve x-time-to
  const timeValueElements = rootElement.querySelectorAll(
    '[x-time-to]',
  )
  timeValueElements?.forEach(el => {
    const attributeName = el.getAttribute('x-time-to')
    if (attributeName) {
      el.setAttribute(attributeName, '0')
    } else {
      el.childNodes.forEach(cn => cn.remove())
      el.append(document.createTextNode('0'))
    }
  })

  // Resolve x-percentage-to
  const timePercentageValueElements = rootElement.querySelectorAll(
    '[x-percentage-to]',
  )
  timePercentageValueElements?.forEach(el => {
    const attributeName = el.getAttribute('x-percentage-to')
    if (attributeName) {
      el.setAttribute(attributeName, '0')
    } else {
      el.childNodes.forEach(cn => cn.remove())
      el.append(document.createTextNode('0%'))
    }
  })
}
