import { styled } from "@/styles"
import { FC, ReactElement } from "react"
import PadButton from "./PadButton"

const StyledPad = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(9, minmax(0, 1fr))",
  gap: 1,
})

const Pad: FC = () => {
  const buttons: ReactElement<typeof PadButton>[] = []

  for (let i = 0; i < 8; i++) {
    for (let j = 1; j <= 9; j++) {
      const mcBtn = j > 8
      const id = mcBtn ? `mc${i + 1}` : i * 8 + j
      buttons.push(
        <PadButton key={id} mcBtn={mcBtn}>
          {id}
        </PadButton>
      )
    }
  }

  return <StyledPad>{buttons}</StyledPad>
}

export default Pad
