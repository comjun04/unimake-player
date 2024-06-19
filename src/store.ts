import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
import { IPackData } from "./hooks/useProcessPack"
import LEDRunner from "./LEDRunner"

const initialPadButtons: PadButtonsStateItem[][] =
  Array<PadButtonsStateItem[]>(8)
for (let i = 0; i < 8; i++) {
  initialPadButtons[i] = Array<PadButtonsStateItem>(8).fill({
    pressed: false,
    nextSoundMappingIdx: 0,
    nextLedMappingIdx: 0,
    color: 0,
  })
}

const initialMcButtons: McButtonsStateItem[] = Array<McButtonsStateItem>(32)
for (let i = 0; i < 32; i++) {
  initialMcButtons[i] = {
    color: 0,
  }
}

// =====

type PackState = {
  packData: IPackData | undefined
  setPackData: (pack: IPackData) => void
}

export const usePackStore = create(
  immer<PackState>((set, get) => ({
    packData: undefined,
    setPackData: (pack) => {
      // destroy all Howl instances
      get().packData?.sounds.howlers.forEach((howl) => howl.unload())

      // reset all button colors
      usePadButtonsStore.getState().resetAllColors()

      return set((state) => {
        state.packData = pack
      })
    },
  }))
)

// =====

type PadState = {
  chain: number
  fullMcButtonLayout: boolean
  setChain: (num: number) => void
  setFullMcButtonLayout: (value: boolean) => void
}

export const usePadStore = create(
  immer<PadState>((set) => ({
    chain: 1,
    fullMcButtonLayout: false,
    setChain: (num) =>
      set((state) => {
        state.chain = num
      }),
    setFullMcButtonLayout: (value) =>
      set((state) => {
        state.fullMcButtonLayout = value
      }),
  }))
)

// =====

type PadButtonsStateItem = {
  pressed: boolean
  nextSoundMappingIdx: number
  nextLedMappingIdx: number
  color: number
}

type McButtonsStateItem = {
  color: number
}

type PadButtonsState = {
  padButtons: PadButtonsStateItem[][]
  mcButtons: McButtonsStateItem[]
  logoColor: number
  showPressedFeedback: boolean
  getButton: (x: number, y: number) => PadButtonsStateItem
  getMcButton: (id: number) => McButtonsStateItem
  press: (x: number, y: number, chain: number) => void
  release: (x: number, y: number) => void
  setColor: (x: number, y: number, color: number) => void
  setMcButtonColor: (id: number, color: number) => void
  setLogoColor: (color: number) => void
  resetAllPressCount: () => void
  resetAllColors: () => void
  setShowPressedFeedback: (show: boolean) => void
}

export const usePadButtonsStore = create(
  immer<PadButtonsState>((set, get) => ({
    padButtons: initialPadButtons,
    mcButtons: initialMcButtons,
    logoColor: 0,
    showPressedFeedback: true,
    getButton: (x, y) => {
      return get().padButtons[x - 1][y - 1]
    },
    getMcButton: (id) => {
      return get().mcButtons[id - 1]
    },
    press: (x, y, chain) =>
      set((state) => {
        const btnData = state.padButtons[x - 1][y - 1]
        btnData.pressed = true

        // pack이 로드되지 않았으면 빠져나가기
        const packData = usePackStore.getState().packData
        if (packData == null) return

        const key = `${chain} ${x} ${y}`
        const soundMappings = packData.sounds.mappings.get(key)
        if (soundMappings != null) {
          console.log({ x, y }, btnData.nextSoundMappingIdx)

          const currentMapping = soundMappings[btnData.nextSoundMappingIdx]
          if (currentMapping != null) {
            const sound = packData.sounds.howlers.get(currentMapping.soundName)

            const t = Date.now()
            console.log("btn pressed")
            sound?.once("play", () => console.log("play start", Date.now() - t))
            sound?.play()
          }

          if (btnData.nextSoundMappingIdx + 1 >= soundMappings?.length) {
            btnData.nextSoundMappingIdx = 0
          } else {
            btnData.nextSoundMappingIdx += 1
          }
        }

        const ledMappings = packData.keyLED[key]
        if (ledMappings != null) {
          const currentMapping = ledMappings[btnData.nextLedMappingIdx]
          if (currentMapping != null) {
            const setColor = get().setColor
            const setMcButtonColor = get().setMcButtonColor
            const setLogoColor = get().setLogoColor

            const ledRunner = new LEDRunner(currentMapping)
            ledRunner.run((changes) => {
              for (const segment of changes) {
                if (segment.type === "on") {
                  if (segment.locationType === "mc") {
                    setMcButtonColor(segment.mc, segment.color)
                  } else if (segment.locationType === "logo") {
                    setLogoColor(segment.color)
                  } else {
                    setColor(segment.x, segment.y, segment.color)
                  }
                } else if (segment.type === "off") {
                  if (segment.locationType === "mc") {
                    setMcButtonColor(segment.mc, 0)
                  } else if (segment.locationType === "logo") {
                    setLogoColor(0)
                  } else {
                    setColor(segment.x, segment.y, 0)
                  }
                }
              }
            })
          }

          if (btnData.nextLedMappingIdx + 1 >= ledMappings.length) {
            btnData.nextLedMappingIdx = 0
          } else {
            btnData.nextLedMappingIdx += 1
          }
        }
      }),
    release: (x, y) =>
      set((state) => {
        const btnData = state.padButtons[x - 1][y - 1]
        btnData.pressed = false
      }),
    setColor: (x, y, color) =>
      set((state) => {
        state.padButtons[x - 1][y - 1].color = color
      }),
    setMcButtonColor: (id, color) =>
      set((state) => {
        state.mcButtons[id - 1].color = color
      }),
    setLogoColor: (color) =>
      set((state) => {
        state.logoColor = color
      }),
    resetAllPressCount: () =>
      set((state) => {
        for (const row of state.padButtons) {
          for (const btnData of row) {
            btnData.nextSoundMappingIdx = 0
            btnData.nextLedMappingIdx = 0
          }
        }
      }),
    resetAllColors: () =>
      set((state) => {
        for (const row of state.padButtons) {
          for (const btnData of row) {
            btnData.color = 0
          }
        }
      }),
    setShowPressedFeedback: (show) =>
      set((state) => {
        state.showPressedFeedback = show
      }),
  }))
)
