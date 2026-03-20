'use client'

import { cn } from '@/lib/utils'

interface SizeSelectorProps {
  sizes: string[]
  selectedSize: string
  onChange: (size: string) => void
}

export function SizeSelector({ sizes, selectedSize, onChange }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onChange(size)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium border transition-colors',
            selectedSize === size
              ? 'bg-gold-500 text-navy-900 border-gold-500'
              : 'bg-navy-800 text-white border-navy-600 hover:border-gold-500'
          )}
        >
          {size}
        </button>
      ))}
    </div>
  )
}
