import { FC, useState } from 'react'

import MainArea from './MainArea'
import PackLoadWrapper from './components/PackLoadWrapper'
import { IPackData } from './hooks/useProcessPack'
import { usePackStore } from './store'

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
      <div className="mx-auto h-full w-full max-w-screen-sm lg:max-w-full">
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
