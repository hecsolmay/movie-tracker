/* eslint-disable @typescript-eslint/ban-types */
export function debounce (fn: Function, delay: number) {
  let timer = 0

  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
