import { FC } from 'react'

import cn from '@/merge-classnames'

type ProgressBarProps = JSX.IntrinsicElements['div'] & {
  now: number
  max: number
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  label?: string
  innerClassname?: string
}

const ProgressBar: FC<ProgressBarProps> = ({
  now,
  max,
  variant = 'primary',
  label,
  className,
  innerClassname,
  ...props
}) => {
  const percent = Math.min((now / max) * 100, 100)

  let bgColor = ''
  if (variant === 'primary') {
    bgColor = 'bg-blue-500 text-white'
  } else if (variant === 'secondary') {
    bgColor = 'bg-gray-500 text-white'
  } else if (variant === 'success') {
    bgColor = 'bg-green-600 text-white'
  } else if (variant === 'danger') {
    bgColor = 'bg-red-600'
  }

  return (
    <div
      className={cn(
        'h-3 w-full overflow-hidden rounded-full bg-gray-200',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'align-center flex h-3 flex-row justify-center overflow-hidden rounded-full text-xs leading-none',
          bgColor,
          innerClassname,
        )}
        style={{
          width: `${percent}%`,
        }}
      >
        {label ?? ''}
      </div>
    </div>
  )
}

export default ProgressBar
