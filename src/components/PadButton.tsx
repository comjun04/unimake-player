import { FC, ReactNode } from "react"
import { TButtonPosition } from "@/types"
import styles from "@/styles/pad.module.css"

type PadButtonProps = {
  children?: ReactNode
  mcBtn?: boolean
  selectedChain?: boolean
  position: TButtonPosition
  pressed: boolean
  onPress?: (position: TButtonPosition) => void
  onRelease?: (position: TButtonPosition) => void
}

const PadButton: FC<PadButtonProps> = ({
  children,
  mcBtn = false,
  selectedChain = false,
  position,
  pressed,
  onPress: onPress,
  onRelease,
}) => {
  const handleButtonPress = () => {
    onPress?.(position)
  }
  const handleButtonRelease = () => {
    onRelease?.(position)
  }

  const roundClassname = mcBtn ? "rounded-circle" : "rounded"
  const bgColorClassname = selectedChain
    ? styles.padButtonMCSelectedBg
    : !mcBtn && pressed
    ? styles.padButtonPressedBg
    : ""

  return (
    <button
      onPointerDown={handleButtonPress}
      onPointerUp={handleButtonRelease}
      onPointerOut={handleButtonRelease}
      className={`position-relative border rounded p-0 ${roundClassname} ${bgColorClassname} ${styles.padButton}`}
    >
      <div className={`position-absolute ${styles.padButtonContent}`}>
        {children}
      </div>
    </button>
  )
}

export default PadButton
