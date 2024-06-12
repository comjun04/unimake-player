import { FC, useCallback, useEffect } from "react"
import AutoplayControl from "./components/AutoplayControl"
import Pad from "./components/Pad"
import { usePackStore, usePadButtonsStore, usePadStore } from "./store"
import { useShallow } from "zustand/react/shallow"
import useAutoplay from "./hooks/useAutoplay"
import { TButtonPosition } from "./types"

const PlayArea: FC = () => {
  const packData = usePackStore((state) => state.packData)

  const { chain, setChain } = usePadStore(
    useShallow((state) => ({
      chain: state.chain,
      setChain: state.setChain,
    }))
  )

  const { markBtnPressed, markBtnReleased, resetAllBtnPressCount } =
    usePadButtonsStore(
      useShallow((state) => ({
        markBtnPressed: state.press,
        markBtnReleased: state.release,
        resetAllBtnPressCount: state.resetAllPressCount,
      }))
    )

  const {
    currentSegment: currentAutoplaySegment,
    start: startAutoplay,
    stop: stopAutoplay,
    reset: resetAutoplay,
    playing: autoplaying,
    now: autoplayNowIdx,
    total: autoplayTotalIdx,
  } = useAutoplay(packData?.autoplay ?? [])

  const handleBtnPress = useCallback(
    (position: TButtonPosition) => {
      // console.log(position)

      // mc button
      if (position?.mc != null) {
        if (position.mc !== chain) {
          setChain(position.mc)
        }
        return
      }

      markBtnPressed(position.x, position.y, chain)
    },
    [chain]
  )

  const handleBtnRelease = useCallback((position: TButtonPosition) => {
    if (position.mc != null) return

    markBtnReleased(position.x, position.y)
  }, [])

  // pack을 load하거나 chain이 바뀔 때 버튼 누른 횟수 초기화
  useEffect(() => {
    resetAllBtnPressCount()
  }, [packData, chain])

  // autoplay segment 처리
  useEffect(() => {
    if (!currentAutoplaySegment) return

    switch (currentAutoplaySegment.type) {
      case "on":
        handleBtnPress({
          x: currentAutoplaySegment.x,
          y: currentAutoplaySegment.y,
        })
        break

      case "off":
        handleBtnRelease({
          x: currentAutoplaySegment.x,
          y: currentAutoplaySegment.y,
        })
        break

      case "touch": {
        handleBtnPress({
          x: currentAutoplaySegment.x,
          y: currentAutoplaySegment.y,
        })

        // TODO: clear timer when unmount
        setTimeout(() => {
          // currentAutoplaySegment 값이 timeout 전에 바뀌었어도 여기 있는 값은 변하지 않음
          handleBtnRelease({
            x: currentAutoplaySegment.x,
            y: currentAutoplaySegment.y,
          })
        }, 150)
        break
      }

      case "chain":
        setChain(currentAutoplaySegment.chain)
        break
    }
  }, [currentAutoplaySegment])

  return (
    <>
      <AutoplayControl
        playing={autoplaying}
        onPlay={startAutoplay}
        onPause={stopAutoplay}
        onStop={resetAutoplay}
        now={autoplayNowIdx}
        total={autoplayTotalIdx}
      />
      <Pad onBtnPress={handleBtnPress} onBtnRelease={handleBtnRelease} />
    </>
  )
}

export default PlayArea
