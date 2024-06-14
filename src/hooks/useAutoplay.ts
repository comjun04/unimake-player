import type { TAutoplayData } from "@/types"
import { useEffect, useRef, useState } from "react"
import useCalibratedTimeout from "./useCalibratedTimeout"

const useAutoplay = (data: TAutoplayData[]) => {
  const [idx, setIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)

  const [timestamp, setTimestamp] = useState(Date.now())

  const playingRef = useRef(playing)
  playingRef.current = playing

  const { setCalibratedTimeout } = useCalibratedTimeout()

  const internalCurrent: TAutoplayData | undefined = data[idx]
  const current =
    internalCurrent == null
      ? null
      : internalCurrent.type === "delay"
      ? data[idx - 1]
      : internalCurrent

  // data 값이 바뀌었다면 다른 pack을 불러온 것이므로 reset
  useEffect(() => {
    setIdx(-1)
    setPlaying(false)
  }, [data])

  useEffect(() => {
    if (!playing) return

    console.log(idx, internalCurrent)
    console.log(`Autoplay diff: ${timestamp} ${Date.now() - timestamp}`)

    if (idx >= data.length) {
      setPlaying(false)
      setIdx(-1)
      return
    }

    if (internalCurrent == null) {
      setIdx((i) => i + 1)
      return
    }

    if (internalCurrent?.type === "delay") {
      const timer = setCalibratedTimeout(() => {
        if (playingRef.current) {
          setIdx((i) => i + 1)
        }

        setTimestamp(Date.now())
      }, internalCurrent.delay)
      return () => clearTimeout(timer)
    } else {
      setIdx((i) => i + 1)
    }
  }, [idx, playing])

  const start = () => {
    if (internalCurrent?.type === "delay") {
      setIdx(idx + 1)
    }
    setPlaying(true)
  }

  const stop = () => {
    setPlaying(false)
  }

  const reset = () => {
    console.log("reset called")
    setIdx(-1)
    setPlaying(false)
  }

  return {
    start,
    stop,
    reset,
    currentSegment: current,
    playing,
    now: idx,
    total: data.length,
  }
}

export default useAutoplay
