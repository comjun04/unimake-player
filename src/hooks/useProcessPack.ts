import { useState } from "react"

const useProcessPack = () => {
  const [step, setStep] = useState(0)

  const processPack = async (file: File) => {}

  return { processPack, step }
}

export default useProcessPack
