type TButtonPosition =
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
