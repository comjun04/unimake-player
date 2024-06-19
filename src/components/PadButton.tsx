import { FC, ReactNode } from 'react'
import { useShallow } from 'zustand/react/shallow'

import '@/styles/colors.css'
import styles from '@/styles/pad.module.css'

import cn from '@/merge-classnames'
import { usePadButtonsStore, usePadStore } from '@/store'
import { TButtonPosition } from '@/types'

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
      if ('mc' in position && position.mc != null) {
        const btnData = state.getMcButton(position.mc)
        return { pressed: false, color: btnData.color }
      }

      const btnData = state.getButton(position.x, position.y)
      return {
        pressed: btnData.pressed,
        color: btnData.color,
        showPressedFeedback: state.showPressedFeedback,
      }
    }),
  )

  const shouldShowSelectedChain =
    'mc' in position && position.mc === currentChain

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
        'aspect-square select-none overflow-hidden rounded',
        mcBtn ? 'm-auto w-[90%] rounded-full' : 'rounded-md',
        styles.padButton,
      )}
    >
      <div
        className={cn(
          'flex h-full w-full flex-row items-center justify-center',
          bgColorClassname,
        )}
      >
        {children}
      </div>
    </button>
  )
}

export default PadButton
