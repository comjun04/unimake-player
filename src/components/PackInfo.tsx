import { FC } from "react"
import Button from "./common/Button"

type PackInfoProps = {
  onLoadPackClick: () => void
  infoData: Record<string, string>
}

const PackInfo: FC<PackInfoProps> = ({ onLoadPackClick, infoData }) => {
  return (
    <div className="flex flex-col gap-2 px-3 py-2 border border-gray-400 rounded-lg">
      <h4 className="text-xl">Pack Information</h4>
      <ul>
        <li>Title: {infoData?.title}</li>
        <li>Producer Name: {infoData?.producerName}</li>
        <li>buttonX: {infoData?.buttonX}</li>
        <li>buttonY: {infoData?.buttonY}</li>
        <li>chain: {infoData?.chain}</li>
      </ul>
      <Button variant="primary" onClick={onLoadPackClick}>
        Load Pack
      </Button>
    </div>
  )
}

export default PackInfo
