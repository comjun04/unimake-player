import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

const initialPadButtons: PadButtonsStateItem[][] =
  Array<PadButtonsStateItem[]>(8)
for (let i = 0; i < 8; i++) {
  initialPadButtons[i] = Array<PadButtonsStateItem>(8).fill({
    pressed: false,
    pressCount: 0,
  })
}

// =====

type PadState = {
  chain: number
  setChain: (num: number) => void
}

export const usePadStore = create(
  immer<PadState>((set) => ({
    chain: 1,
    setChain: (num) =>
      set((state) => {
        state.chain = num
      }),
  }))
)

// =====

type PadButtonsStateItem = {
  pressed: boolean
  pressCount: number
}

type PadButtonsState = {
  padButtons: PadButtonsStateItem[][]
  getButton: (x: number, y: number) => PadButtonsStateItem
  press: (x: number, y: number) => void
  release: (x: number, y: number) => void
  incrementPressCount: (x: number, y: number) => void
  resetPressCount: (x: number, y: number) => void
}

export const usePadButtonsStore = create(
  immer<PadButtonsState>((set, get) => ({
    padButtons: initialPadButtons,
    getButton: (x, y) => {
      return get().padButtons[y - 1][x - 1]
    },
    press: (x, y) =>
      set((state) => {
        const btnData = state.padButtons[y - 1][x - 1]
        btnData.pressed = true
      }),
    release: (x, y) =>
      set((state) => {
        const btnData = state.padButtons[y - 1][x - 1]
        btnData.pressed = false
      }),
    incrementPressCount: (x, y) =>
      set((state) => {
        const btnData = state.padButtons[y - 1][x - 1]
        btnData.pressCount += 1
      }),
    resetPressCount: (x, y) =>
      set((state) => {
        const btnData = state.padButtons[y - 1][x - 1]
        btnData.pressCount = 0
      }),
  }))
)
