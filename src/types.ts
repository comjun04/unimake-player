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

export type TKeyLEDSegment =
  | {
      type: "chain"
      chain: number
    }
  | {
      type: "delay"
      delay: number
    }
  | {
      type: "on"
      x: number
      y: number
      color: number
    }
  | {
      type: "on"
      mc: number
      color: number
    }
  | {
      type: "off"
      x: number
      y: number
    }

export type TKeyLEDDataUnsorted = Record<
  string,
  {
    repeat: number
    mappings: {
      multiMappingLetter: string
      segments: TKeyLEDSegment[]
    }[]
  }
>

export type TKeyLEDData = Record<
  string,
  {
    repeat: number
    segments: TKeyLEDSegment[][]
  }
>
