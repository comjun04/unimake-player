import { TKeyLEDData, TKeyLEDSegment } from "./types"

export default class LEDRunner {
  readonly data: TKeyLEDData[string][number]
  private timerOffset = 0

  constructor(data: TKeyLEDData[string][number]) {
    this.data = data
  }

  run(onUpdate: (changes: TKeyLEDSegment[]) => void) {
    this._run(onUpdate).catch(console.error)
  }

  private async _run(onUpdate: (changes: TKeyLEDSegment[]) => void) {
    const changes: TKeyLEDSegment[] = []

    for (let i = 0; i < this.data.repeat; i++) {
      for await (const segment of this.data.segments) {
        if (segment.type === "delay") {
          onUpdate(changes.slice())
          changes.length = 0

          await this.calibratedDelay(segment.delay)
          continue
        }

        changes.push(segment)
      }
    }

    // 남은 led 변경사항 업데이트
    if (changes.length > 0) {
      onUpdate(changes.slice())
    }
  }

  private calibratedDelay(time: number) {
    const expected = Date.now() + time

    return new Promise<void>((resolve) => {
      window.setTimeout(() => {
        const dt = Date.now() - expected

        resolve()
        this.timerOffset = Math.max(0, dt)
      }, time - this.timerOffset)
    })
  }
}
