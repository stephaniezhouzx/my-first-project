import { cn } from '@/lib/utils'

interface PriorityBadgeProps {
  priority: 'S' | 'A' | 'B' | 'C'
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const colorMap = {
    S: 'bg-chart-4/20 text-chart-4 border-chart-4/30',
    A: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    B: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    C: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <span
      className={cn(
        'inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold',
        colorMap[priority],
        className
      )}
    >
      {priority}
    </span>
  )
}
