import { usePadButtonsStore } from "@/store"
import Checkbox from "./common/Checkbox"
import { FC, memo } from "react"
import { useShallow } from "zustand/react/shallow"

const MemoizedCheckbox = memo(Checkbox)

const SettingsPanel: FC = () => {
  const { showBtnPressedFeedback, setShowBtnPressedFeedback } =
    usePadButtonsStore(
      useShallow((state) => ({
        showBtnPressedFeedback: state.showPressedFeedback,
        setShowBtnPressedFeedback: state.setShowPressedFeedback,
      }))
    )

  return (
    <div className="px-3 py-2 border border-gray-400 rounded-lg">
      <div className="flex flex-col gap-2">
        <h4 className="text-xl">Settings</h4>
        <div className="flex flex-col gap-2">
          <MemoizedCheckbox
            id="aaa"
            checked={showBtnPressedFeedback}
            onChange={setShowBtnPressedFeedback}
            label="Show Button Press Feedback"
          />

          <label htmlFor="a"></label>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
