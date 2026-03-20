import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'gold' | 'navy' | 'success' | 'muted'
  className?: string
}

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center text-xs font-bold rounded-full px-2 py-0.5',
        {
          'bg-gold-500 text-navy-900': variant === 'gold',
          'bg-navy-700 text-white': variant === 'navy',
          'bg-green-500 text-white': variant === 'success',
          'bg-navy-600 text-navy-400': variant === 'muted',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
