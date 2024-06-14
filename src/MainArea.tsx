import { FC, useCallback, useEffect } from "react"
import AutoplayControl from "./components/AutoplayControl"
import Pad from "./components/Pad"
import { usePackStore, usePadButtonsStore, usePadStore } from "./store"
import { useShallow } from "zustand/react/shallow"
import useAutoplay from "./hooks/useAutoplay"
import { TButtonPosition } from "./types"
import PackInfo from "./components/PackInfo"
import SettingsPanel from "./components/SettingsPanel"
import InfoPanel from "./components/InfoPanel"

type PlayAreaProps = {
  setShowPackLoadModal: (value: boolean) => void
}

const PlayArea: FC<PlayAreaProps> = ({ setShowPackLoadModal }) => {
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
    <div className="flex flex-col lg:flex-row gap-2 w-full p-2 h-full">
      <div className="flex flex-col gap-2 lg:w-[30vw]">
        <PackInfo
          onLoadPackClick={() => setShowPackLoadModal(true)}
          infoData={packData?.info ?? {}}
        />
        <AutoplayControl
          playing={autoplaying}
          onPlay={startAutoplay}
          onPause={stopAutoplay}
          onStop={resetAutoplay}
          now={autoplayNowIdx}
          total={autoplayTotalIdx}
        />
        <SettingsPanel />
        <InfoPanel />
      </div>

      <div className="grow max-w-[100vh]">
        <Pad onBtnPress={handleBtnPress} onBtnRelease={handleBtnRelease} />
      </div>
    </div>
  )
}

export default PlayArea
