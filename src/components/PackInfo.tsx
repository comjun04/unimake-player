import { FC } from "react"

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
      <button
        className="bg-blue-500 p-2 rounded-lg text-white hover:bg-blue-600 transition"
        onClick={onLoadPackClick}
      >
        Load Pack
      </button>
    </div>
  )
}

export default PackInfo
