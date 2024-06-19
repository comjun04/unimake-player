import { FC, memo } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { usePadButtonsStore, usePadStore } from '@/store'

import Checkbox from './common/Checkbox'

const MemoizedCheckbox = memo(Checkbox)

const SettingsPanel: FC = () => {
  const {
    showBtnPressedFeedback,
    setShowBtnPressedFeedback,
    showBtnId,
    setShowBtnId,
  } = usePadButtonsStore(
    useShallow((state) => ({
      showBtnPressedFeedback: state.showPressedFeedback,
      setShowBtnPressedFeedback: state.setShowPressedFeedback,
      showBtnId: state.showButtonId,
      setShowBtnId: state.setShowButtonId,
    })),
  )
  const { fullMcButtonLayout, setFullMcButtonLayout } = usePadStore(
    useShallow((state) => ({
      fullMcButtonLayout: state.fullMcButtonLayout,
      setFullMcButtonLayout: state.setFullMcButtonLayout,
    })),
  )

  return (
    <div className="select-none rounded-lg border border-gray-400 px-3 py-2">
      <div className="flex flex-col gap-2">
        <h4 className="text-xl">Settings</h4>
        <div className="flex flex-col gap-2">
          <MemoizedCheckbox
            id="aaa"
            checked={showBtnPressedFeedback}
            onChange={setShowBtnPressedFeedback}
            label="Show Button Press Feedback"
          />
          <MemoizedCheckbox
            id="bbb"
            checked={fullMcButtonLayout}
            onChange={setFullMcButtonLayout}
            label="Full MC Button Layout"
          />
          <MemoizedCheckbox
            id="ccc"
            checked={showBtnId}
            onChange={setShowBtnId}
            label="Show Button ID text"
          />
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
