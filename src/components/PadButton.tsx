import { FC, ReactNode } from "react"
import { TButtonPosition } from "@/types"
import styles from "@/styles/pad.module.css"
import { usePadButtonsStore, usePadStore } from "@/store"
import cn from "@/merge-classnames"

type PadButtonProps = {
  children?: ReactNode
  mcBtn?: boolean
  position: TButtonPosition
  onPress?: (position: TButtonPosition) => void
  onRelease?: (position: TButtonPosition) => void
}

const PadButton: FC<PadButtonProps> = ({
  children,
  mcBtn = false,
  position,
  onPress: onPress,
  onRelease,
}) => {
  const currentChain = usePadStore((state) => state.chain)

  const pressed = usePadButtonsStore((state) => {
    if ("mc" in position) {
      return false
    }

    return state.getButton(position.x, position.y).pressed
  })

  const shouldShowSelectedChain =
    "mc" in position && position.mc === currentChain

  const handleButtonPress = () => {
    onPress?.(position)
  }
  const handleButtonRelease = () => {
    onRelease?.(position)
  }

  const bgColorClassname = shouldShowSelectedChain
    ? styles.padButtonMCSelectedBg
    : !mcBtn && pressed
    ? styles.padButtonPressedBg
    : ""

  return (
    <button
      onPointerDown={handleButtonPress}
      onPointerUp={handleButtonRelease}
      onPointerOut={handleButtonRelease}
      className={cn(
        "border rounded aspect-square",
        mcBtn ? "rounded-full" : "rounded-md",
        bgColorClassname,
        styles.padButton
      )}
    >
      <div className={`${styles.padButtonContent}`}>{children}</div>
    </button>
  )
}

export default PadButton
