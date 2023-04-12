export type TButtonPosition =
  | {
      mc: number
      x?: undefined
      y?: undefined
    }
  | {
      x: number
      y: number
      mc?: undefined
    }

export type TAutoplayData =
  | {
      type: "chain"
      chain: number
    }
  | {
      type: "delay"
      delay: number
    }
  | {
      type: "on" | "off" | "touch"
      x: number
      y: number
    }
