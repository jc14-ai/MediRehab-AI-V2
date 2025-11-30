'use client'

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  label?: string
  showValue?: boolean
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  className,
  label,
  showValue = true,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const getColor = (val: number) => {
    if (val >= 80) return "stroke-accent"
    if (val >= 60) return "stroke-primary"
    if (val >= 40) return "stroke-chart-3"
    return "stroke-destructive"
  }

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} fill="none" className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={cn("transition-all duration-500 ease-out", getColor(value))}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value}%</span>
        </div>
      )}
      {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
    </div>
  )
}
