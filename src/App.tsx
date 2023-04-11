import { FC, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import Pad from "@/components/Pad"
import PackLoadModal from "./components/PackLoadModal"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)

  const togglePackLoadModal = () => setShowPackLoadModal(!showPackLoadModal)

  return (
    <>
      <Container>
        <PackInfo onLoadPackClick={() => setShowPackLoadModal(true)} />
        <Pad />
      </Container>
      <PackLoadModal
        show={showPackLoadModal}
        handleClose={() => setShowPackLoadModal(false)}
      />
    </>
  )
}

export default App
