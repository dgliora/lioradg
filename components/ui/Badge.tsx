import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-neutral-200 text-neutral-700',
      success: 'bg-green-50 text-success border border-success',
      warning: 'bg-yellow-50 text-warning border border-warning',
      danger: 'bg-red-50 text-danger border border-danger',
      info: 'bg-blue-50 text-primary border border-primary',
    }

    const sizes = {
      sm: 'px-8 py-4 text-xs',
      md: 'px-12 py-4 text-small',
      lg: 'px-16 py-8 text-base',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-lg',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }
