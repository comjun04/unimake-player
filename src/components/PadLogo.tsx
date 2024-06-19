import { FC } from 'react'
import { BsXDiamondFill } from 'react-icons/bs'

import '@/styles/colors.css'

import cn from '@/merge-classnames'
import { usePadButtonsStore } from '@/store'

const PadLogo: FC = () => {
  const logoColor = usePadButtonsStore((state) => state.logoColor)

  return (
    <div className="m-auto aspect-square h-[95%] w-[95%] text-[#808080]">
      {/* temporary logo icon */}
      <BsXDiamondFill
        className={cn(`h-full w-full bg-clip-text logocolor-${logoColor}`)}
      />
    </div>
  )
}

export default PadLogo
