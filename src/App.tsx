import { FC, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import PackLoadModal from "./components/PackLoadModal"
import useProcessPack from "./hooks/useProcessPack"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)
  const { processPack } = useProcessPack()

  return (
    <>
      <Container>
        <PackInfo onLoadPackClick={() => setShowPackLoadModal(true)} />
        <Pad />
      </Container>
      <PackLoadModal
        show={showPackLoadModal}
        handleClose={() => setShowPackLoadModal(false)}
        handleLoadPack={(file) => processPack(file)}
      />
    </>
  )
}

export default App
