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

  const { pressed, color, showPressedFeedback } = usePadButtonsStore(
    useShallow((state) => {
      if ("mc" in position && position.mc != null) {
        const btnData = state.getMcButton(position.mc)
        return { pressed: false, color: btnData.color }
      }

      const btnData = state.getButton(position.x, position.y)
      return {
        pressed: btnData.pressed,
        color: btnData.color,
        showPressedFeedback: state.showPressedFeedback,
      }
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
    : !mcBtn && pressed && showPressedFeedback
    ? styles.padButtonPressedBg
    : `bgcolor-${color}`

  return (
    <button
      onPointerDown={handleButtonPress}
      onPointerUp={handleButtonRelease}
      onPointerOut={handleButtonRelease}
      className={cn(
        "rounded aspect-square overflow-hidden select-none",
        mcBtn ? "rounded-full w-[75%] m-auto" : "rounded-md",
        styles.padButton
      )}
    >
      <div className={cn("w-full h-full", bgColorClassname)}>{children}</div>
    </button>
  )
}

export default PadButton
