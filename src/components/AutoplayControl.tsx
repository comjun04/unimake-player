import { FC } from "react"
import { ProgressBar } from "react-bootstrap"
import Button from "./Button"

type AutoplayControlProps = {
  playing: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  now: number
  total: number
}

const AutoplayControl: FC<AutoplayControlProps> = ({
  playing,
  onPlay,
  onPause,
  onStop,
  now,
  total,
}) => {
  return (
    <div className="px-3 py-2 border border-gray-400 rounded-lg">
      <div className="flex flex-col gap-2">
        <span>Autoplay</span>
        <div className="flex flex-row gap-2 items-center">
          {playing ? (
            <Button variant="secondary" onClick={() => onPause()}>
              Pause
            </Button>
          ) : (
            <Button variant="success" onClick={() => onPlay()}>
              Start
            </Button>
          )}
          <Button variant="danger" disabled={!playing} onClick={() => onStop()}>
            Stop
          </Button>
          <span>Step</span>
          <Button variant="primary" disabled>
            ▶️
          </Button>
        </div>
        <ProgressBar now={now} max={total} />
      </div>
    </div>
  )
}

export default AutoplayControl
