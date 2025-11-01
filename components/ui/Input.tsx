import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-small font-medium text-neutral-medium mb-2">
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'h-[52px] w-full px-5 rounded-button border-[1.5px] text-base bg-white',
            'focus:outline-none focus:border-sage focus:ring-4 focus:ring-sage/10',
            'disabled:bg-warm-50 disabled:cursor-not-allowed',
            'transition-all duration-300',
            error
              ? 'border-danger focus:ring-danger/10'
              : 'border-warm-100 hover:border-warm-200',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-2 text-small text-danger">{error}</p>}
        {helperText && !error && (
          <p className="mt-2 text-small text-neutral-light">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
