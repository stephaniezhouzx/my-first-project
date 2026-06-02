import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: '合作中' | '已完成' | '待跟进' | '已终止'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorMap = {
    合作中: 'bg-chart-1/20 text-chart-1 border-chart-1/30',
    已完成: 'bg-status-success/20 text-status-success border-status-success/30',
    待跟进: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
    已终止: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colorMap[status],
        className
      )}
    >
      {status}
    </span>
  )
}
