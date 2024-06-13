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
      locationType: "xy"
      x: number
      y: number
      color: number
    }
  | {
      type: "on"
      locationType: "mc"
      mc: number
      color: number
    }
  | {
      type: "on"
      locationType: "logo"
      color: number
    }
  | {
      type: "off"
      locationType: "xy"
      x: number
      y: number
    }
  | {
      type: "off"
      locationType: "mc"
      mc: number
    }
  | {
      type: "off"
      locationType: "logo"
    }

export type TKeyLEDDataUnsorted = Record<
  string,
  {
    multiMappingLetter: string
    repeat: number
    segments: TKeyLEDSegment[]
  }[]
>

export type TKeyLEDData = Record<
  string,
  {
    repeat: number
    segments: TKeyLEDSegment[]
  }[]
>
