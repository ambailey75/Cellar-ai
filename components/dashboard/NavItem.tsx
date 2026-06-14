import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface NavItemProps {
  href: string
  label: string
  icon: LucideIcon
  soon?: boolean
  active?: boolean
}

export function NavItem({ href, label, icon: Icon, soon, active }: NavItemProps) {
  const baseClasses =
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'

  if (soon) {
    return (
      <div
        aria-disabled="true"
        className={cn(baseClasses, 'cursor-default text-muted-foreground/60')}
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{label}</span>
        <Badge
          variant="outline"
          className="border-muted-foreground/30 text-[10px] font-normal text-muted-foreground/60"
        >
          Soon
        </Badge>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className={cn(
        baseClasses,
        active
          ? 'bg-accent text-accent-foreground'
          : 'text-foreground/80 hover:bg-accent/50 hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}
