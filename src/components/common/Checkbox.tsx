import { FC } from "react"
import { FaCheck } from "react-icons/fa"
import { Checkbox as HeadlessUICheckbox } from "@headlessui/react"

type CheckboxProps = {
  id?: string
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const Checkbox: FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
}) => {
  return (
    <div className="flex flex-row gap-2 items-center">
      <HeadlessUICheckbox
        id={id}
        checked={checked}
        onChange={onChange}
        className="group block size-5 p-0.5 rounded border border-gray-400 bg-gray-600 data-[checked]:bg-blue-500"
      >
        <FaCheck className="stroke-white opacity-0 group-data-[checked]:opacity-100 w-full h-full" />
      </HeadlessUICheckbox>
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default Checkbox
