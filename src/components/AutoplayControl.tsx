import { FC } from "react"
import { Card, Button, Stack, ProgressBar } from "react-bootstrap"

type AutoplayControlProps = {
  playing: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
}

const AutoplayControl: FC<AutoplayControlProps> = ({
  playing,
  onPlay,
  onPause,
  onStop,
}) => {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Stack direction="vertical" gap={2}>
          <Stack direction="horizontal" gap={2}>
            <span>Autoplay</span>
            {playing ? (
              <Button variant="secondary" onClick={() => onPause()}>
                Pause
              </Button>
            ) : (
              <Button variant="success" onClick={() => onPlay()}>
                Start
              </Button>
            )}
            <Button
              variant="danger"
              disabled={!playing}
              onClick={() => onStop()}
            >
              Stop
            </Button>
            <span>Step</span>
            <Button variant="primary" disabled>
              ▶️
            </Button>
          </Stack>
          <ProgressBar />
        </Stack>
      </Card.Body>
    </Card>
  )
}

export default AutoplayControl
