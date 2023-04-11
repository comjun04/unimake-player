import { FC, useEffect, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import PackLoadModal from "./components/PackLoadModal"
import useProcessPack, { IPackData } from "./hooks/useProcessPack"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)
  const [packData, setPackData] = useState<IPackData>()
  const { status, processPack, clear } = useProcessPack()

  const handleLoadPack = async (file: File) => {
    const data = await processPack(file)
    if (data) {
      setPackData(data)
      setShowPackLoadModal(false)
    }
  }

  const handleBtnClick = () => {}

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
        <Pad />
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
