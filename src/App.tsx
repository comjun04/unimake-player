import { FC, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import PackLoadModal from "./components/PackLoadModal"
import useProcessPack, { IPackData } from "./hooks/useProcessPack"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)
  const [packData, setPackData] = useState<IPackData>()
  const { status, processPack } = useProcessPack()

  const handleLoadPack = async (file: File) => {
    const data = await processPack(file)
    if (data) {
      setPackData(data)
    }
  }

  return (
    <>
      <Container>
        <PackInfo onLoadPackClick={() => setShowPackLoadModal(true)} />
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
