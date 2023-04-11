import { FC, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import PackLoadModal from "./components/PackLoadModal"
import useProcessPack, { IPackData } from "./hooks/useProcessPack"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)
  const [packData, setPackData] = useState<IPackData>()
  const [chain, setChain] = useState(1)
  const { status, processPack, clear } = useProcessPack()

  const handleLoadPack = async (file: File) => {
    const data = await processPack(file)
    if (data) {
      setPackData(data)
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
      const mapping = mappings.get(key)![0]
      const sound = howlers.get(mapping.soundName)
      sound?.play()

      const t = Date.now()
      console.log("btn pressed")
      sound?.once("play", () => console.log("play start", Date.now() - t))
    }
  }

  // pack load dialog 열릴 때 로딩 상태 초기화
  useEffect(() => {
    if (showPackLoadModal) {
      clear()
    }
  }, [showPackLoadModal])

  return (
    <>
      <Container>
        <PackInfo
          onLoadPackClick={() => setShowPackLoadModal(true)}
          infoData={packData?.info ?? {}}
        />
        <Pad chain={chain} onBtnClick={handleBtnClick} />
      </Container>
      <PackLoadModal
        show={showPackLoadModal}
        handleClose={() => setShowPackLoadModal(false)}
        handleLoadPack={handleLoadPack}
        packLoadStatus={status}
      />
    </>
  )
}

export default App
