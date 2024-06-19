import { useState } from 'react'

const useCalibratedTimeout = () => {
  const [offset, setOffset] = useState(0)

  const timeoutFn = (fn: () => void, time: number) => {
    const expected = Date.now() + time

    const timerId = window.setTimeout(() => {
      const dt = Date.now() - expected
      console.log(dt)

      fn()
      setOffset(Math.max(0, dt))
    }, time - offset)
    return timerId
  }

  return { setCalibratedTimeout: timeoutFn, offset }
}

export default useCalibratedTimeout
