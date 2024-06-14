import cn from "@/merge-classnames"
import { FC } from "react"

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: "primary" | "secondary" | "success" | "danger"
}

const Button: FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  let variantClassnames = ""
  if (variant === "primary") {
    variantClassnames =
      "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-blue-500/50 disabled:text-white/50"
  } else if (variant === "secondary") {
    variantClassnames =
      "bg-gray-500 hover:bg-gray-600 text-white disabled:bg-gray-500/50 disabled:text-white/50"
  } else if (variant === "success") {
    variantClassnames =
      "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-600/50 disabled:text-white/50"
  } else if (variant === "danger") {
    variantClassnames =
      "bg-red-500 hover:bg-red-600 text-black disabled:bg-red-500/50 disabled:text-black/50"
  }

  return (
    <button
      className={cn(
        "px-3 py-2 rounded-lg transition duration-150",
        variantClassnames,
        className
      )}
      {...props}
    />
  )
}

export default Button
