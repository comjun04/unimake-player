import cn from "@/merge-classnames"
import { usePadButtonsStore } from "@/store"
import { FC } from "react"
import { BsXDiamondFill } from "react-icons/bs"

import "@/styles/colors.css"

const PadLogo: FC = () => {
  const logoColor = usePadButtonsStore((state) => state.logoColor)

  return (
    <div className="aspect-square m-auto w-[95%] h-[95%]">
      <div className="text-[#808080]">
        {/* temporary logo icon */}
        <BsXDiamondFill
          className={cn(`w-full h-full bg-clip-text logocolor-${logoColor}`)}
        />
      </div>
    </div>
  )
}

export default PadLogo
