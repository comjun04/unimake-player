import { FC } from "react"
import { Button, Card } from "react-bootstrap"

type PackInfoProps = {
  onLoadPackClick: () => void
  infoData: Record<string, string>
}

const PackInfo: FC<PackInfoProps> = ({ onLoadPackClick, infoData }) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title as="h5">Pack Information</Card.Title>
        <ul>
          <li>Title: {infoData?.title}</li>
          <li>Producer Name: {infoData?.producerName}</li>
          <li>buttonX: {infoData?.buttonX}</li>
          <li>buttonY: {infoData?.buttonY}</li>
          <li>chain: {infoData?.chain}</li>
        </ul>
        <Button onClick={onLoadPackClick}>Load Pack</Button>
      </Card.Body>
    </Card>
  )
}

export default PackInfo
