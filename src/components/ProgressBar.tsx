import cn from "@/merge-classnames"
import { FC } from "react"

type ProgressBarProps = JSX.IntrinsicElements["div"] & {
  now: number
  max: number
  variant?: "primary" | "secondary" | "success" | "danger"
  label?: string
  innerClassname?: string
}

const ProgressBar: FC<ProgressBarProps> = ({
  now,
  max,
  variant = "primary",
  label,
  className,
  innerClassname,
  ...props
}) => {
  const percent = Math.min((now / max) * 100, 100)

  let bgColor = ""
  if (variant === "primary") {
    bgColor = "bg-blue-500 text-white"
  } else if (variant === "secondary") {
    bgColor = "bg-gray-500 text-white"
  } else if (variant === "success") {
    bgColor = "bg-green-600 text-white"
  } else if (variant === "danger") {
    bgColor = "bg-red-600"
  }

  return (
    <div
      className={cn(
        "w-full bg-gray-200 rounded-full h-3 overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-3 rounded-full flex flex-row justify-center align-center text-xs leading-none overflow-hidden",
          bgColor,
          innerClassname
        )}
        style={{
          width: `${percent}%`,
        }}
      >
        {label ?? ""}
      </div>
    </div>
  )
}

export default ProgressBar
