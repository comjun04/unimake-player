import { FC, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import useProcessPack, { IPackData } from "./hooks/useProcessPack"
import AutoplayControl from "./components/AutoplayControl"
import { TButtonPosition } from "./types"
import useAutoplay from "./hooks/useAutoplay"
import PackLoadWrapper from "./components/PackLoadWrapper"

const initialPadBtnPressCount = Array(8)
for (let i = 0; i < 8; i++) {
  initialPadBtnPressCount[i] = Array(8).fill(0)
}

function arrayDeepCopy(arr: number[][]) {
  const newArr: number[][] = []
  arr.forEach((el) => {
    newArr.push(el.slice())
  })

  return newArr
}

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)
  const [packData, setPackData] = useState<IPackData>()
  const [chain, setChain] = useState(1)

  const [padBtnPressCount, setPadBtnPressCount] = useState<number[][]>(
    initialPadBtnPressCount
  )

  const {
    current: currentAutoplaySegment,
    start: startAutoplay,
    stop: stopAutoplay,
    reset: resetAutoplay,
    playing: autoplaying,
  } = useAutoplay(packData?.autoplay ?? [])

  const handlePackLoadComplete = (packData: IPackData) => {
    if (packData) {
      setPackData(packData)
      setShowPackLoadModal(false)
    }
  }

  const handleBtnClick = (position: TButtonPosition) => {
    // console.log(position)

    // mc button
    if (position?.mc != null) {
      if (position.mc !== chain) {
        setChain(position.mc)
      }
      return
    }

    // pack이 로드되지 않았으면 빠져나가기
    if (packData == null) {
      return
    }
    const { mappings, howlers } = packData.sounds

    const key = `${chain} ${position.x} ${position.y}`
    if (mappings.has(key)) {
      const pressedCount = padBtnPressCount[position.x - 1][position.y - 1]
      const thisBtnMappings = mappings.get(key)!

      console.log(position, pressedCount)

      const mapping = thisBtnMappings[pressedCount]
      const sound = howlers.get(mapping.soundName)
      sound?.play()

      const nextPressedCount =
        pressedCount + 1 >= thisBtnMappings.length ? 0 : pressedCount + 1
      const newPadBtnPressCount = arrayDeepCopy(padBtnPressCount)
      newPadBtnPressCount[position.x - 1][position.y - 1] = nextPressedCount
      setPadBtnPressCount(newPadBtnPressCount)

      const t = Date.now()
      console.log("btn pressed")
      sound?.once("play", () => console.log("play start", Date.now() - t))
    }
  }

  // pack을 load하거나 chain이 바뀔 때 버튼 누른 횟수 초기화
  useEffect(() => {
    setPadBtnPressCount(initialPadBtnPressCount)
  }, [packData, chain])

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
        />
        <Pad chain={chain} onBtnClick={handleBtnClick} />
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
