import type { TAutoplayData } from "@/types"
import { useEffect, useRef, useState } from "react"

const useAutoplay = (data: TAutoplayData[]) => {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  const playingRef = useRef(playing)
  playingRef.current = playing

  const current = data[idx]
  const current2 = current?.type === "delay" ? data[idx - 1] : current

  // data 값이 바뀌었다면 다른 pack을 불러온 것이므로 reset
  useEffect(() => {
    setIdx(0)
    setPlaying(false)
  }, [data])

  useEffect(() => {
    if (!playing) return

    console.log(idx, current)

    if (idx >= data.length) {
      setPlaying(false)
      setIdx(0)
      return
    }

    if (current.type === "delay") {
      const timer = setTimeout(() => {
        if (playingRef.current) {
          setIdx(idx + 1)
        }
      }, current.delay)
      return () => clearTimeout(timer)
    } else {
      setIdx(idx + 1)
    }
  }, [current, playing])

  const start = () => {
    setPlaying(true)
  }

  const stop = () => {
    if (current.type === "delay") {
      setIdx(idx + 1)
    }
    setPlaying(false)
  }

  const reset = () => {
    console.log("reset called")
    setIdx(0)
    setPlaying(false)
  }

  return { start, stop, reset, current: current2, playing }
}

export default useAutoplay
