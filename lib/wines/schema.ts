import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const wineFormSchema = z.object({
  producer: z.string().trim().min(1, 'Producer is required'),
  wineName: z.string().trim().min(1, 'Wine name is required'),
  vintage: z
    .number()
    .int('Vintage must be a whole year')
    .min(1800, 'Vintage must be after 1800')
    .max(currentYear + 1, `Vintage cannot be after ${currentYear + 1}`)
    .optional(),
  country: z.string().trim().optional(),
  region: z.string().trim().optional(),
  subRegion: z.string().trim().optional(),
  classification: z.string().trim().optional(),
  varietal: z.string().trim().optional(),
  format: z.string().trim().optional(),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  purchasePrice: z.number().min(0, 'Price cannot be negative').optional(),
  purchaseDate: z.date().optional(),
  vendor: z.string().trim().optional(),
  storageLocation: z.string().trim().optional(),
  notes: z.string().trim().optional(),
})

export type WineFormValues = z.infer<typeof wineFormSchema>

export const wineFormDefaultValues: WineFormValues = {
  producer: '',
  wineName: '',
  vintage: undefined,
  country: undefined,
  region: undefined,
  subRegion: undefined,
  classification: undefined,
  varietal: undefined,
  format: undefined,
  quantity: 1,
  purchasePrice: undefined,
  purchaseDate: undefined,
  vendor: undefined,
  storageLocation: undefined,
  notes: undefined,
}
