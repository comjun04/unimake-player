import { FC, memo, useCallback, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

import AutoplayControl from './components/AutoplayControl'
import InfoPanel from './components/InfoPanel'
import PackInfo from './components/PackInfo'
import Pad from './components/Pad'
import SettingsPanel from './components/SettingsPanel'
import useAutoplay from './hooks/useAutoplay'
import { usePackStore, usePadButtonsStore, usePadStore } from './store'
import { TButtonPosition } from './types'

const MemoizedSettingsPanel = memo(SettingsPanel)
const MemoizedInfoPanel = memo(InfoPanel)

type PlayAreaProps = {
  setShowPackLoadModal: (value: boolean) => void
}

const PlayArea: FC<PlayAreaProps> = ({ setShowPackLoadModal }) => {
  const packData = usePackStore((state) => state.packData)

  const { chain, setChain } = usePadStore(
    useShallow((state) => ({
      chain: state.chain,
      setChain: state.setChain,
    })),
  )

  const { markBtnPressed, markBtnReleased, resetAllBtnPressCount } =
    usePadButtonsStore(
      useShallow((state) => ({
        markBtnPressed: state.press,
        markBtnReleased: state.release,
        resetAllBtnPressCount: state.resetAllPressCount,
      })),
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
        if (position.mc !== chain && !autoplaying) {
          setChain(position.mc)
        }
        return
      }

      markBtnPressed(position.x, position.y, chain)
    },
    [chain, autoplaying],
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
      case 'on':
        handleBtnPress({
          x: currentAutoplaySegment.x,
          y: currentAutoplaySegment.y,
        })
        break

      case 'off':
        handleBtnRelease({
          x: currentAutoplaySegment.x,
          y: currentAutoplaySegment.y,
        })
        break

      case 'touch': {
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

      case 'chain':
        setChain(currentAutoplaySegment.chain)
        break
    }
  }, [currentAutoplaySegment])

  return (
    <div className="flex h-full w-full flex-col gap-2 p-2 lg:flex-row">
      <div className="flex flex-col gap-2 lg:w-[30vw]">
        <MemoizedInfoPanel />
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
        <MemoizedSettingsPanel />
      </div>

      <div className="max-w-[95vh] grow">
        <Pad onBtnPress={handleBtnPress} onBtnRelease={handleBtnRelease} />
      </div>
    </div>
  )
}

export default PlayArea
