import * as React from 'react'
import throttle from './throttle'

type ScrollOptions = {
  element?: HTMLElement | React.RefObject<HTMLElement>
  throttleDelay?: number
}

type Callback = (percentum: number, e: Event) => void

const defaultOptions = {
  element: document.documentElement,
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
    const handleScroll = throttle(e => {
      const el = getElement(element || document.documentElement)
      if (el) {
        const { scrollTop, scrollHeight, clientHeight } = el
        const val = (scrollTop + clientHeight) / scrollHeight
        savedCallback.current(val, e)
        setValue(val)
      }
    }, throttleDelay || 200)

    getListener(element).addEventListener('scroll', handleScroll)

    return () => {
      getListener(element).removeEventListener('scroll', handleScroll)
    }
  }, [])

  return value
}

function getElement(ref: React.RefObject<HTMLElement> | HTMLElement): HTMLElement | null {
  if (!(ref instanceof HTMLElement)) {
    return ref.current
  }
  return ref
}

function getListener(ref: React.RefObject<HTMLElement> | HTMLElement | undefined) {
  if (!ref || ref === document.documentElement || ref === document.body) {
    return window
  }
  if (!(ref instanceof HTMLElement)) {
    return ref.current || window
  }
  return ref
}
