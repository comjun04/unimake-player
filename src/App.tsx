import { FC, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import { IPackData } from "./hooks/useProcessPack"
import AutoplayControl from "./components/AutoplayControl"
import { TButtonPosition } from "./types"
import useAutoplay from "./hooks/useAutoplay"
import PackLoadWrapper from "./components/PackLoadWrapper"
import { usePackStore, usePadButtonsStore, usePadStore } from "./store"
import { useShallow } from "zustand/react/shallow"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)

  // new state store
  const { packData, setPackData } = usePackStore(
    useShallow((state) => ({
      packData: state.packData,
      setPackData: state.setPackData,
    }))
  )

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

  const handlePackLoadComplete = (packData: IPackData) => {
    if (packData) {
      setPackData(packData)
      setShowPackLoadModal(false)
    }
  }

  const handleBtnPress = (position: TButtonPosition) => {
    // console.log(position)

    // mc button
    if (position?.mc != null) {
      if (position.mc !== chain) {
        setChain(position.mc)
      }
      return
    }

    markBtnPressed(position.x, position.y, chain)
  }

  const handleBtnRelease = (position: TButtonPosition) => {
    if (position.mc != null) return

    markBtnReleased(position.x, position.y)
  }

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
      <Container>
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
        <Pad onBtnPress={handleBtnPress} onBtnRelease={handleBtnRelease} />
      </Container>
      <PackLoadWrapper
        showModal={showPackLoadModal}
        handleModalClose={() => setShowPackLoadModal(false)}
        onLoadComplete={handlePackLoadComplete}
      />
    </>
  )
}

export default App
