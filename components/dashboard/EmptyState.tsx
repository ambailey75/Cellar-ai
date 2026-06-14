import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmptyStateAction {
  label: string
  href: string
}

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: EmptyStateAction
  secondaryAction?: { label: string }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      {Icon && <Icon className="mb-4 h-10 w-10 text-muted-foreground" />}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {action && (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        )}
        {secondaryAction && (
          <Button variant="outline" disabled className="gap-2">
            {secondaryAction.label}
            <Badge variant="outline" className="text-[10px] font-normal">
              Soon
            </Badge>
          </Button>
        )}
      </div>
    </div>
  )
}
