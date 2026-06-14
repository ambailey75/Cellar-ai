import { redirect } from 'next/navigation'
import { Wine } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth/current-user'
import { getDashboardSummary, getRecentWines } from '@/lib/wines/queries'
import { KpiCard } from '@/components/dashboard/KpiCard'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { RecentWines } from '@/components/dashboard/RecentWines'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const summary = await getDashboardSummary(user.id)

  if (summary.totalBottles === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-foreground">
          Welcome to your cellar
        </h1>
        <EmptyState
          icon={Wine}
          title="Your cellar is empty"
          description="Add your first bottle to start tracking your collection, or import your existing cellar."
          action={{ label: 'Add a wine', href: '/dashboard/cellar/new' }}
          secondaryAction={{ label: 'Import your collection' }}
        />
      </div>
    )
  }

  const recentWines = await getRecentWines(user.id, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Total Bottles" value={summary.totalBottles.toLocaleString()} />
        <KpiCard
          label="Estimated Value"
          value={formatCurrency(summary.estimatedValue)}
        />
        <KpiCard
          label="Bottles at Peak"
          value={summary.bottlesAtPeak.toLocaleString()}
          caption="Updates once enrichment runs (Phase 5)"
        />
      </div>
      {recentWines.length > 0 && <RecentWines wines={recentWines} />}
    </div>
  )
}
