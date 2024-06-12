import { FC } from "react"
import { ProgressBar } from "react-bootstrap"

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
            <button
              className="bg-gray-500 py-2 px-3 hover:bg-gray-600 transition"
              onClick={() => onPause()}
            >
              Pause
            </button>
          ) : (
            <button
              className="bg-green-600 py-2 px-3 rounded-lg text-white transition hover:bg-green-700"
              onClick={() => onPlay()}
            >
              Start
            </button>
          )}
          <button
            className="bg-red-500 rounded-lg py-2 px-3 hover:bg-red-600 transition disabled:bg-red-500/50 disabled:text-black/50"
            disabled={!playing}
            onClick={() => onStop()}
          >
            Stop
          </button>
          <span>Step</span>
          <button
            className="bg-blue-500 rounded-lg py-2 px-3 hover:bg-blue-600 transition disabled:bg-blue-500/50 disabled:text-black/50"
            disabled
          >
            ▶️
          </button>
        </div>
        <ProgressBar now={now} max={total} />
      </div>
    </div>
  )
}

export default AutoplayControl
