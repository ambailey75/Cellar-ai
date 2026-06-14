'use client'

import { Check, ChevronsUpDown, Filter, X } from 'lucide-react'
import type { Table } from '@tanstack/react-table'
import type { SerializedWine } from '@/lib/wines/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

interface FacetedFilterProps {
  title: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
}

function FacetedFilter({ title, options, selected, onChange }: FacetedFilterProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="justify-between gap-2">
          {title}
          {selected.length > 0 && (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              {selected.length}
            </Badge>
          )}
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} onSelect={() => toggle(option)}>
                  <div
                    className={cn(
                      'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                      selected.includes(option)
                        ? 'bg-primary text-primary-foreground'
                        : 'opacity-50'
                    )}
                  >
                    {selected.includes(option) && <Check className="h-3 w-3" />}
                  </div>
                  <span>{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export interface WineFilterOptions {
  countries: string[]
  regions: string[]
  varietals: string[]
}

interface WineFiltersProps {
  table: Table<SerializedWine>
  options: WineFilterOptions
}

export function WineFilters({ table, options }: WineFiltersProps) {
  const countryFilter = (table.getColumn('country')?.getFilterValue() as string[]) ?? []
  const regionFilter = (table.getColumn('region')?.getFilterValue() as string[]) ?? []
  const varietalFilter = (table.getColumn('varietal')?.getFilterValue() as string[]) ?? []
  const vintageFilter =
    (table.getColumn('vintage')?.getFilterValue() as
      | [number | undefined, number | undefined]
      | undefined) ?? []
  const [vintageMin, vintageMax] = vintageFilter

  const hasFilters =
    countryFilter.length > 0 ||
    regionFilter.length > 0 ||
    varietalFilter.length > 0 ||
    vintageMin !== undefined ||
    vintageMax !== undefined

  const clearAll = () => {
    table.getColumn('country')?.setFilterValue(undefined)
    table.getColumn('region')?.setFilterValue(undefined)
    table.getColumn('varietal')?.setFilterValue(undefined)
    table.getColumn('vintage')?.setFilterValue(undefined)
  }

  const content = (
    <div className="flex flex-wrap items-center gap-2">
      <FacetedFilter
        title="Country"
        options={options.countries}
        selected={countryFilter}
        onChange={(values) =>
          table.getColumn('country')?.setFilterValue(values.length ? values : undefined)
        }
      />
      <FacetedFilter
        title="Region"
        options={options.regions}
        selected={regionFilter}
        onChange={(values) =>
          table.getColumn('region')?.setFilterValue(values.length ? values : undefined)
        }
      />
      <FacetedFilter
        title="Varietal"
        options={options.varietals}
        selected={varietalFilter}
        onChange={(values) =>
          table.getColumn('varietal')?.setFilterValue(values.length ? values : undefined)
        }
      />
      <div className="flex items-center gap-2">
        <Label htmlFor="vintage-min" className="text-xs text-muted-foreground">
          Vintage
        </Label>
        <Input
          id="vintage-min"
          type="number"
          placeholder="From"
          className="h-9 w-20"
          value={vintageMin ?? ''}
          onChange={(e) => {
            const min = e.target.value ? Number(e.target.value) : undefined
            table.getColumn('vintage')?.setFilterValue([min, vintageMax])
          }}
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="number"
          placeholder="To"
          className="h-9 w-20"
          value={vintageMax ?? ''}
          onChange={(e) => {
            const max = e.target.value ? Number(e.target.value) : undefined
            table.getColumn('vintage')?.setFilterValue([vintageMin, max])
          }}
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
          <X className="h-3.5 w-3.5" />
          Clear filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasFilters && <Badge variant="secondary">On</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-3">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
