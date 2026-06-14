import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/current-user'
import { listWines, serializeWines } from '@/lib/wines/queries'
import { createWine } from '@/lib/wines/actions'
import { wineFormSchema } from '@/lib/wines/schema'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wines = await listWines(user.id)
  return NextResponse.json(serializeWines(wines))
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = wineFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { id } = await createWine(parsed.data)
  return NextResponse.json({ id }, { status: 201 })
}
