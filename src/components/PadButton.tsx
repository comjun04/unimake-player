import { FC, ReactNode } from "react"
import { TButtonPosition } from "@/types"
import styles from "@/styles/pad.module.css"
import { usePadButtonsStore, usePadStore } from "@/store"
import cn from "@/merge-classnames"
import { useShallow } from "zustand/react/shallow"

import "@/styles/colors.css"

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

  const { pressed, color } = usePadButtonsStore(
    useShallow((state) => {
      if ("mc" in position) {
        return { pressed: false, color: 0 }
      }

      const btnData = state.getButton(position.x, position.y)
      return { pressed: btnData.pressed, color: btnData.color }
    })
  )

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
    : `bgcolor-${color}`

  return (
    <button
      onPointerDown={handleButtonPress}
      onPointerUp={handleButtonRelease}
      onPointerOut={handleButtonRelease}
      className={cn(
        "rounded aspect-square overflow-hidden",
        mcBtn ? "rounded-full" : "rounded-md",
        styles.padButton
      )}
    >
      <div className={cn("w-full h-full", bgColorClassname)}>{children}</div>
    </button>
  )
}

export default PadButton
