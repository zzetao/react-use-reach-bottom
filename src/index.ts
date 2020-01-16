import * as React from 'react'
import throttle from './throttle'

/**
 * TODO:
 * [ ] window resize
 * [ ] deps
 */

type ScrollOptions = {
  element?: React.RefObject<HTMLElement> | Window
  throttleDelay?: number
}

type Callback = (distance: number, e: Event) => void

const defaultOptions = {
  element: window,
  throttleDelay: 200
}

export default function useReachBottom(callback?: Callback, options: ScrollOptions = defaultOptions): number {
  const [ value, setValue ] = React.useState<number>(0)
  const { element, throttleDelay } = options
  const savedCallback = React.useRef<Callback>(() => {});

  React.useEffect(() => {
    if (callback) {
      savedCallback.current = callback
    }
  }, [value])

  React.useEffect(() => {
    const container = getContainerElement(element)

    const handleScroll = throttle(e => {
      if (container) {
        const distance = calcDistance(container)
        savedCallback.current(distance, e)
        setValue(distance)
      }
    }, throttleDelay || 200)

    setValue(calcDistance(container))

    getListener(element).addEventListener('scroll', handleScroll)
    return () => {
      getListener(element).removeEventListener('scroll', handleScroll)
    }
  }, [options.element])

  return value
}

function calcDistance(element: HTMLElement): number {
  const { scrollTop, scrollHeight, clientHeight } = element
  return (scrollTop + clientHeight) / scrollHeight
}

function getContainerElement(ref: any): HTMLElement {
  if (!ref || ref === window || !ref.current || ref instanceof HTMLElement) {
    return document.documentElement
  }
  return ref.current
}

function getListener(ref: any): HTMLElement | Window {
  if (!ref || ref === window || !ref.current || ref instanceof HTMLElement) {
    return window
  } else {
    return ref.current
  }
}
