/* eslint-disable @typescript-eslint/ban-types */
export function debounce (fn: Function, delay: number) {
  let timer: NodeJS.Timeout

  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}
