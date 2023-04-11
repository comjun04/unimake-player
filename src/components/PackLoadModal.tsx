import { FC } from "react"
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
}

const PackLoadModal: FC<PackLoadModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form>
        <ModalHeader>Load Pack</ModalHeader>
        <ModalBody>
          <Stack direction="vertical" gap={3}>
            <FormGroup>
              <FormControl type="file" accept=".zip,.uni" />
            </FormGroup>
            <div>Waiting for pack file...</div>
            <ProgressBar now={50} />
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button type="submit">Load</Button>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  )
}

export default PackLoadModal
