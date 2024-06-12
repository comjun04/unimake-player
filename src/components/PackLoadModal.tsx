import { IProcessStatus } from "@/hooks/useProcessPack"
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react"
import { FC, FormEvent, createRef, useEffect, useState } from "react"
import { ProgressBar } from "react-bootstrap"

type PackLoadModalProps = {
  show: boolean
  handleClose?: () => void
  handleLoadPack: (file: File) => void
  packLoadStatus: IProcessStatus
}

const PackLoadModal: FC<PackLoadModalProps> = ({
  show,
  handleClose = () => {},
  handleLoadPack,
  packLoadStatus,
}) => {
  const [packLoading, setPackLoading] = useState(false)
  const fileInputRef = createRef<HTMLInputElement>()

  const loadFile = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()

    console.log(fileInputRef.current?.files)
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      window.alert("Select file first.")
      return
    }

    setPackLoading(true)
    handleLoadPack(file)
  }

  // dialog 숨길 때 로딩중 상태 해제 (버튼 입력 다시 가능해짐)
  useEffect(() => {
    if (!show) {
      setPackLoading(false)
    }
  }, [show])

  return (
    <Transition show={show}>
      <Dialog
        onClose={handleClose}
        static={packLoading}
        className="relative z-50"
      >
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex flex-row w-screen items-center justify-center">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-white p-6 rounded-xl">
              <form
                className="flex flex-col gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  loadFile(event)
                }}
              >
                <DialogTitle className="text-xl">Load Pack</DialogTitle>
                <div>
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      accept=".zip,.uni"
                      disabled={packLoading}
                      ref={fileInputRef}
                    />

                    <div>
                      step {packLoadStatus.step}. {packLoadStatus.state}
                    </div>
                    <ProgressBar
                      now={packLoadStatus.step}
                      max={5}
                      variant="success"
                    />
                    <ProgressBar
                      now={packLoadStatus.partCurrent ?? 100}
                      animated={packLoadStatus.partCurrent == null}
                      max={packLoadStatus.partTotal ?? 100}
                      label={
                        packLoadStatus.partCurrent != null
                          ? `${packLoadStatus.partCurrent} / ${packLoadStatus.partTotal}`
                          : ""
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-500 rounded-lg text-white"
                    disabled={packLoading}
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 bg-gray-400 rounded-lg text-white"
                    onClick={handleClose}
                    disabled={packLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PackLoadModal
