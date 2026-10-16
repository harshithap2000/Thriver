import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cn } from '@/shared/utils/cn'

export const inputClass =
  'w-full rounded-xl border border-ink-muted/25 bg-white px-3.5 py-2.5 text-ink outline-none placeholder:text-ink-muted/60 focus:border-pine focus:ring-2 focus:ring-pine/20'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Field({ label, className, id, ...props }: FieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={inputId} className="text-ink text-sm font-semibold">
        {label}
      </label>
      <input id={inputId} className={inputClass} {...props} />
    </div>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function TextAreaField({ label, className, ...props }: TextAreaFieldProps) {
  const id = useId()
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-ink text-sm font-semibold">
        {label}
      </label>
      <textarea id={id} rows={2} className={cn(inputClass, 'resize-none')} {...props} />
    </div>
  )
}
