import { FC } from "react"
import { Button, Card } from "react-bootstrap"

type PackInfoProps = {
  onLoadPackClick: () => void
}

const PackInfo: FC<PackInfoProps> = ({ onLoadPackClick }) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title as="h5">Pack Information</Card.Title>
        <ul>
          <li>Title: </li>
          <li>Producer Name: </li>
          <li>buttonX: </li>
          <li>buttonY: </li>
          <li>chain: </li>
        </ul>
        <Button onClick={onLoadPackClick}>Load Pack</Button>
      </Card.Body>
    </Card>
  )
}

export default PackInfo
