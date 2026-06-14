'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format as formatDate } from 'date-fns'
import { Calendar as CalendarIcon, Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import {
  wineFormSchema,
  wineFormDefaultValues,
  type WineFormValues,
} from '@/lib/wines/schema'
import { COUNTRIES, WINE_FORMATS, COMMON_REGIONS, COMMON_VARIETALS } from '@/lib/wines/constants'
import type { SerializedWine } from '@/lib/wines/queries'
import { createWine, updateWine } from '@/lib/wines/actions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface ComboboxFieldProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  options: string[]
  placeholder: string
}

function ComboboxField({ value, onChange, options, placeholder }: ComboboxFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  )

  const trimmedSearch = search.trim()
  const showCreate =
    trimmedSearch.length > 0 &&
    !options.some((option) => option.toLowerCase() === trimmedSearch.toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={placeholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  onSelect={() => {
                    onChange(undefined)
                    setOpen(false)
                    setSearch('')
                  }}
                  className="text-muted-foreground"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear selection
                </CommandItem>
              )}
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
              {showCreate && (
                <CommandItem
                  onSelect={() => {
                    onChange(trimmedSearch)
                    setOpen(false)
                    setSearch('')
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Use &quot;{trimmedSearch}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface WineFormProps {
  mode: 'create' | 'edit'
  wine?: SerializedWine
  existingRegions: string[]
  existingVarietals: string[]
}

export function WineForm({ mode, wine, existingRegions, existingVarietals }: WineFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const regionOptions = useMemo(
    () => Array.from(new Set([...COMMON_REGIONS, ...existingRegions])).sort(),
    [existingRegions]
  )
  const varietalOptions = useMemo(
    () => Array.from(new Set([...COMMON_VARIETALS, ...existingVarietals])).sort(),
    [existingVarietals]
  )

  const form = useForm<WineFormValues>({
    resolver: zodResolver(wineFormSchema),
    defaultValues: wine
      ? {
          producer: wine.producer,
          wineName: wine.wineName,
          vintage: wine.vintage ?? undefined,
          country: wine.country ?? undefined,
          region: wine.region ?? undefined,
          subRegion: wine.subRegion ?? undefined,
          classification: wine.classification ?? undefined,
          varietal: wine.varietal ?? undefined,
          format: wine.format ?? undefined,
          quantity: wine.quantity,
          purchasePrice: wine.purchasePrice ?? undefined,
          purchaseDate: wine.purchaseDate ?? undefined,
          vendor: wine.vendor ?? undefined,
          storageLocation: wine.storageLocation ?? undefined,
          notes: wine.notes ?? undefined,
        }
      : wineFormDefaultValues,
  })

  async function onSubmit(values: WineFormValues) {
    setServerError(null)
    try {
      const result =
        mode === 'create' || !wine
          ? await createWine(values)
          : await updateWine(wine.id, values)
      router.push(`/dashboard/cellar/${result.id}`)
    } catch (error) {
      console.error(error)
      setServerError('Something went wrong saving this wine. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="producer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producer *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Château Margaux" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wineName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wine Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Grand Vin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vintage"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Vintage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      placeholder="e.g. 2018"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value
                        onChange(raw === '' ? undefined : Number(raw))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value
                        onChange(raw === '' ? undefined : Number(raw))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Format</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bottle size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {WINE_FORMATS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Origin &amp; Classification</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="varietal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varietal</FormLabel>
                  <ComboboxField
                    value={field.value}
                    onChange={field.onChange}
                    options={varietalOptions}
                    placeholder="Select or type a varietal"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <ComboboxField
                    value={field.value}
                    onChange={field.onChange}
                    options={regionOptions}
                    placeholder="Select or type a region"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subRegion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Region</FormLabel>
                  <ComboboxField
                    value={field.value}
                    onChange={field.onChange}
                    options={regionOptions}
                    placeholder="Select or type a sub-region"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Classification</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Grand Cru, 1er Cru, DOCG" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    Optional. Appellation tier, classification, or designation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Purchase Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Purchase Price</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min={0}
                        className="pl-7"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const raw = e.target.value
                          onChange(raw === '' ? undefined : Number(raw))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Purchase Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? formatDate(field.value, 'PPP') : 'Pick a date'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. K&L Wine Merchants" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storageLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Cellar rack 3, bin 12" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Tasting notes, gift occasion, anything worth remembering..."
                      className="min-h-24"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? 'Saving...'
              : mode === 'create'
                ? 'Add Wine'
                : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
