import { Checkbox as HeadlessUICheckbox } from '@headlessui/react'
import { FC } from 'react'
import { FaCheck } from 'react-icons/fa'

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
    <div className="flex flex-row items-center gap-2">
      <HeadlessUICheckbox
        id={id}
        checked={checked}
        onChange={onChange}
        className="group block size-5 rounded border border-gray-400 bg-gray-600 p-0.5 data-[checked]:bg-blue-500"
      >
        <FaCheck className="h-full w-full stroke-white opacity-0 group-data-[checked]:opacity-100" />
      </HeadlessUICheckbox>
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default Checkbox
