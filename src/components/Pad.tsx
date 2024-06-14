import { FC, ReactElement, memo } from "react"
import PadButton from "./PadButton"
import { TButtonPosition } from "@/types"
import styles from "@/styles/pad.module.css"

type PadProps = {
  onBtnPress: (position: TButtonPosition) => void
  onBtnRelease: (position: TButtonPosition) => void
}

const MemoizedPadButton = memo(PadButton, (oldProps, newProps) => {
  for (const k in newProps) {
    const key = k as keyof typeof newProps

    if (key === "position") {
      if (
        !(
          oldProps.position.x === newProps.position.x &&
          oldProps.position.y === newProps.position.y &&
          oldProps.position.mc === newProps.position.mc
        )
      ) {
        return false
      }
    } else if (!Object.is(oldProps[key], newProps[key])) {
      return false
    }
  }

  return true
})

const Pad: FC<PadProps> = ({ onBtnPress, onBtnRelease }) => {
  const buttons: ReactElement<typeof PadButton>[] = []

  for (let i = 0; i < 8; i++) {
    for (let j = 1; j <= 9; j++) {
      const mcBtn = j > 8
      const id = mcBtn ? `mc${i + 1}` : i * 8 + j
      const position: TButtonPosition = mcBtn
        ? { mc: i + 1 }
        : { x: i + 1, y: j }

      buttons.push(
        <MemoizedPadButton
          key={id}
          mcBtn={mcBtn}
          position={position}
          onPress={onBtnPress}
          onRelease={onBtnRelease}
        >
          {id}
        </MemoizedPadButton>
      )
    }
  }

  return (
    <div className="grid grid-cols-9 gap-[2px] sm:gap-[4px] content-stretch">
      {buttons}
    </div>
  )
}

export default Pad
