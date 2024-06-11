import { FC, useState } from "react"
import { Container } from "react-bootstrap"
import PackInfo from "@/components/PackInfo"
import { IPackData } from "./hooks/useProcessPack"
import PackLoadWrapper from "./components/PackLoadWrapper"
import { usePackStore } from "./store"
import { useShallow } from "zustand/react/shallow"
import PlayArea from "./PlayArea"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)

  // new state store
  const { packData, setPackData } = usePackStore(
    useShallow((state) => ({
      packData: state.packData,
      setPackData: state.setPackData,
    }))
  )

  const handlePackLoadComplete = (data: IPackData) => {
    if (data != null) {
      setPackData(data)
      setShowPackLoadModal(false)
    }
  }

  return (
    <>
      <Container>
        <PackInfo
          onLoadPackClick={() => setShowPackLoadModal(true)}
          infoData={packData?.info ?? {}}
        />
        <PlayArea />
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
