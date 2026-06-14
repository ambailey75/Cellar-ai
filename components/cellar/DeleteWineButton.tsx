'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteWineDialog } from './DeleteWineDialog'

interface DeleteWineButtonProps {
  wineId: string
  wineLabel: string
}

export function DeleteWineButton({ wineId, wineLabel }: DeleteWineButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
      <DeleteWineDialog
        wineId={wineId}
        wineLabel={wineLabel}
        open={open}
        onOpenChange={setOpen}
        onDeleted={() => router.push('/dashboard/cellar')}
      />
    </>
  )
}
