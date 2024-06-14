import { FC } from "react"
import { BsXDiamondFill } from "react-icons/bs"

const PadLogo: FC = () => {
  return (
    <div className="aspect-square m-auto w-[95%] h-[95%]">
      {/* temporary logo icon */}
      <BsXDiamondFill className="w-full h-full" />
    </div>
  )
}

export default PadLogo
