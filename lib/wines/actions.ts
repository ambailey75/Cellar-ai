'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma/client'
import { getCurrentUser } from '@/lib/auth/current-user'
import { wineFormSchema, type WineFormValues } from './schema'

function toWineData(values: WineFormValues) {
  return {
    producer: values.producer,
    wineName: values.wineName,
    vintage: values.vintage ?? null,
    country: values.country ?? null,
    region: values.region ?? null,
    subRegion: values.subRegion ?? null,
    classification: values.classification ?? null,
    varietal: values.varietal ?? null,
    format: values.format ?? null,
    quantity: values.quantity,
    purchasePrice: values.purchasePrice ?? null,
    purchaseDate: values.purchaseDate ?? null,
    vendor: values.vendor ?? null,
    storageLocation: values.storageLocation ?? null,
    notes: values.notes ?? null,
  }
}

export async function createWine(values: WineFormValues): Promise<{ id: string }> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  const data = wineFormSchema.parse(values)

  const wine = await prisma.wine.create({
    data: {
      userId: user.id,
      ...toWineData(data),
    },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/cellar')

  return { id: wine.id }
}

export async function updateWine(
  id: string,
  values: WineFormValues
): Promise<{ id: string }> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  const data = wineFormSchema.parse(values)

  const existing = await prisma.wine.findFirst({ where: { id, userId: user.id } })
  if (!existing) {
    throw new Error('Wine not found')
  }

  await prisma.wine.update({
    where: { id },
    data: toWineData(data),
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/cellar')
  revalidatePath(`/dashboard/cellar/${id}`)

  return { id }
}

export async function deleteWine(id: string): Promise<void> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not authenticated')

  const existing = await prisma.wine.findFirst({ where: { id, userId: user.id } })
  if (!existing) {
    throw new Error('Wine not found')
  }

  await prisma.wine.delete({ where: { id } })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/cellar')
  revalidatePath(`/dashboard/cellar/${id}`)
}
