import { FC, ReactElement, ReactFragment, memo } from "react"
import PadButton from "./PadButton"
import { TButtonPosition } from "@/types"
import styles from "@/styles/pad.module.css"
import { usePadStore } from "@/store"
import cn from "@/merge-classnames"

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
  const showFullMcButtonLayout = usePadStore(
    (state) => state.fullMcButtonLayout
  )

  const buttons: ReactElement<typeof PadButton | HTMLDivElement>[] = []

  // first row mc buttons
  if (showFullMcButtonLayout) {
    let placeHolderCount = 0
    for (let i = 0; i < 10; i++) {
      if (i < 1 || i > 8) {
        buttons.push(
          <div
            key={`placeholder_${placeHolderCount < 1 ? "topleft" : "topright"}`}
            className="aspect-square"
          />
        )
        placeHolderCount++
      } else {
        const mcBtnNum = 24 + i
        const id = `mc${mcBtnNum}`
        buttons.push(
          <MemoizedPadButton
            key={`mc${mcBtnNum}`}
            mcBtn
            position={{ mc: mcBtnNum }}
          >
            {id}
          </MemoizedPadButton>
        )
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    if (showFullMcButtonLayout) {
      for (let j = 0; j < 10; j++) {
        const mcBtn = j < 1 || j > 8
        const mcBtnNum = mcBtn
          ? j > 8
            ? i + 1 // right column mc buttons
            : 24 - i // left column mc buttons
          : undefined
        const id = mcBtn ? `mc${mcBtnNum}` : i * 8 + j // normal pad buttons
        const position: TButtonPosition = mcBtn
          ? { mc: mcBtnNum! }
          : { x: i + 1, y: j }

        const shouldBindEventCallback =
          mcBtnNum == null ? true : mcBtnNum >= 1 && mcBtnNum <= 8

        buttons.push(
          <MemoizedPadButton
            key={id}
            mcBtn={mcBtn}
            position={position}
            onPress={shouldBindEventCallback ? onBtnPress : undefined}
            onRelease={shouldBindEventCallback ? onBtnRelease : undefined}
          >
            {id}
          </MemoizedPadButton>
        )
      }
    } else {
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
  }

  // last row mc buttons
  if (showFullMcButtonLayout) {
    let placeHolderCount = 0
    for (let i = 0; i < 10; i++) {
      if (i < 1 || i > 8) {
        buttons.push(
          <div
            key={`placeholder_${
              placeHolderCount < 1 ? "bottomleft" : "bottomright"
            }`}
            className="aspect-square"
          />
        )
        placeHolderCount++
      } else {
        const mcBtnNum = 17 - i
        const id = `mc${mcBtnNum}`
        buttons.push(
          <MemoizedPadButton key={id} mcBtn position={{ mc: mcBtnNum }}>
            {id}
          </MemoizedPadButton>
        )
      }
    }
  }

  return (
    <div
      className={cn(
        "grid gap-[2px] sm:gap-[4px] content-stretch",
        showFullMcButtonLayout ? "grid-cols-10" : "grid-cols-9"
      )}
    >
      {buttons}
    </div>
  )
}

export default Pad
