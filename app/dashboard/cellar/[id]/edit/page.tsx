import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/current-user'
import { getWine, getDistinctRegionsAndVarietals, serializeWine } from '@/lib/wines/queries'
import { WineForm } from '@/components/cellar/WineForm'

interface EditWinePageProps {
  params: { id: string }
}

export default async function EditWinePage({ params }: EditWinePageProps) {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }

  const wine = await getWine(user.id, params.id)
  if (!wine) {
    notFound()
  }

  const { regions, varietals } = await getDistinctRegionsAndVarietals(user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit wine</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {wine.producer} {wine.wineName}
          {wine.vintage ? ` ${wine.vintage}` : ''}
        </p>
      </div>
      <WineForm
        mode="edit"
        wine={serializeWine(wine)}
        existingRegions={regions}
        existingVarietals={varietals}
      />
    </div>
  )
}
