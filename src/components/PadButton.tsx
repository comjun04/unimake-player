import { FC, ReactNode, useState } from "react"
import { styled } from "@/styles"
import { TButtonPosition } from "@/types"

type PadButtonProps = {
  children?: ReactNode
  mcBtn?: boolean
  selectedChain?: boolean
  position: TButtonPosition
  pressed: boolean
  onPress?: (position: TButtonPosition) => void
  onRelease?: (position: TButtonPosition) => void
}

const StyledButton = styled("button", {
  position: "relative",
  backgroundColor: "gainsboro",
  border: "1px solid black",
  borderRadius: 3,
  boxSizing: "border-box",
  padding: 0,

  variants: {
    round: {
      true: {
        borderRadius: "50%",
      },
    },
    pressed: {
      true: {
        backgroundColor: "grey",
      },
    },
    selectedChain: {
      true: {
        backgroundColor: "yellow",
      },
    },
  },

  "&:before": {
    content: "",
    display: "block",
    paddingTop: "100%",
  },
})

const Content = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
})

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

  return (
    <StyledButton
      round={mcBtn}
      pressed={!mcBtn && pressed}
      selectedChain={selectedChain}
      onPointerDown={handleButtonPress}
      onPointerUp={handleButtonRelease}
      onPointerOut={handleButtonRelease}
    >
      <Content>{children}</Content>
    </StyledButton>
  )
}

export default PadButton
