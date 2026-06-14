import Link from 'next/link'
import type { Wine } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function RecentWines({ wines }: { wines: Wine[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recently added</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {wines.map((wine) => (
          <Link
            key={wine.id}
            href={`/dashboard/cellar/${wine.id}`}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50"
          >
            <span className="font-medium text-foreground">
              {wine.producer} {wine.wineName}
              {wine.vintage ? ` ${wine.vintage}` : ''}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(wine.createdAt)}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
