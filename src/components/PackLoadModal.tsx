import { FC, FormEvent, createRef, useState } from "react"
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ProgressBar,
  Stack,
} from "react-bootstrap"

type PackLoadModalProps = {
  show: boolean
  handleClose?: () => void
  handleLoadPack: (file: File) => void
}

const PackLoadModal: FC<PackLoadModalProps> = ({
  show,
  handleClose,
  handleLoadPack,
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

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={packLoading ? "static" : true}
    >
      <Form onSubmit={loadFile}>
        <ModalHeader>Load Pack</ModalHeader>
        <ModalBody>
          <Stack direction="vertical" gap={3}>
            <FormGroup>
              <FormControl
                type="file"
                accept=".zip,.uni"
                disabled={packLoading}
                ref={fileInputRef}
              />
            </FormGroup>
            <div>Waiting for pack file...</div>
            <ProgressBar now={50} variant="success" label="Step 1/7" />
            <ProgressBar now={40} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button type="submit" disabled={packLoading}>
            Load
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default PackLoadModal
