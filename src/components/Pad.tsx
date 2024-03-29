import { FC, ReactElement } from "react"
import PadButton from "./PadButton"
import { TButtonPosition } from "@/types"
import styles from "@/styles/pad.module.css"

type PadProps = {
  chain: number
  btnPressedMap: boolean[][]
  onBtnPress: (position: TButtonPosition) => void
  onBtnRelease: (position: TButtonPosition) => void
}

const Pad: FC<PadProps> = ({
  chain,
  btnPressedMap,
  onBtnPress,
  onBtnRelease,
}) => {
  const buttons: ReactElement<typeof PadButton>[] = []

  for (let i = 0; i < 8; i++) {
    for (let j = 1; j <= 9; j++) {
      const mcBtn = j > 8
      const id = mcBtn ? `mc${i + 1}` : i * 8 + j
      const position: TButtonPosition = mcBtn
        ? { mc: i + 1 }
        : { x: i + 1, y: j }

      buttons.push(
        <PadButton
          key={id}
          mcBtn={mcBtn}
          selectedChain={mcBtn && position?.mc === chain}
          position={position}
          pressed={
            mcBtn ? false : btnPressedMap[position.x! - 1][position.y! - 1]
          }
          onPress={onBtnPress}
          onRelease={onBtnRelease}
        >
          {id}
        </PadButton>
      )
    }
  }

  return <div className={styles.pad}>{buttons}</div>
}

export default Pad
