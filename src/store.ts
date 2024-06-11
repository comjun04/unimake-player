import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { IPackData } from "./hooks/useProcessPack"

const initialPadButtons: PadButtonsStateItem[][] =
  Array<PadButtonsStateItem[]>(8)
for (let i = 0; i < 8; i++) {
  initialPadButtons[i] = Array<PadButtonsStateItem>(8).fill({
    pressed: false,
    pressCount: 0,
  })
}

// =====

type PackState = {
  packData: IPackData | undefined
  setPackData: (pack: IPackData) => void
}

export const usePackStore = create(
  immer<PackState>((set) => ({
    packData: undefined,
    setPackData: (pack) =>
      set((state) => {
        state.packData = pack
      }),
  }))
)

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
  press: (x: number, y: number, chain: number) => void
  release: (x: number, y: number) => void
  resetAllPressCount: () => void
}

export const usePadButtonsStore = create(
  immer<PadButtonsState>((set, get) => ({
    padButtons: initialPadButtons,
    getButton: (x, y) => {
      return get().padButtons[x - 1][y - 1]
    },
    press: (x, y, chain) =>
      set((state) => {
        const btnData = state.padButtons[x - 1][y - 1]
        btnData.pressed = true

        // pack이 로드되지 않았으면 빠져나가기
        const packData = usePackStore.getState().packData
        if (packData == null) return

        const key = `${chain} ${x} ${y}`
        const mappings = packData.sounds.mappings.get(key)
        if (mappings == null) return

        console.log({ x, y }, btnData.pressCount)

        const currentMapping = mappings[btnData.pressCount]
        const sound = packData.sounds.howlers.get(currentMapping.soundName)

        const t = Date.now()
        console.log("btn pressed")
        sound?.once("play", () => console.log("play start", Date.now() - t))
        sound?.play()

        if (btnData.pressCount + 1 >= mappings.length) {
          btnData.pressCount = 0
        } else {
          btnData.pressCount += 1
        }
      }),
    release: (x, y) =>
      set((state) => {
        const btnData = state.padButtons[x - 1][y - 1]
        btnData.pressed = false
      }),
    resetAllPressCount: () =>
      set((state) => {
        for (const row of state.padButtons) {
          for (const btnData of row) {
            btnData.pressCount = 0
          }
        }
      }),
  }))
)
