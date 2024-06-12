import { FC, useState } from "react"
import { IPackData } from "./hooks/useProcessPack"
import PackLoadWrapper from "./components/PackLoadWrapper"
import { usePackStore } from "./store"
import MainArea from "./MainArea"

const App: FC = () => {
  const [showPackLoadModal, setShowPackLoadModal] = useState(false)

  // new state store
  const setPackData = usePackStore((state) => state.setPackData)

  const handlePackLoadComplete = (data: IPackData) => {
    if (data != null) {
      setPackData(data)
      setShowPackLoadModal(false)
    }
  }

  return (
    <>
      <div className="w-full max-w-screen-sm lg:max-w-full h-full mx-auto">
        <MainArea setShowPackLoadModal={setShowPackLoadModal} />
      </div>
      <PackLoadWrapper
        showModal={showPackLoadModal}
        handleModalClose={() => setShowPackLoadModal(false)}
        onLoadComplete={handlePackLoadComplete}
      />
    </>
  )
}

export default App
