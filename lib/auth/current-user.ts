import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/client'
import type { User } from '@prisma/client'

/**
 * Returns the Prisma User record for the currently authenticated Supabase
 * session, or null if there is no session or no matching user row.
 * The auth callback route upserts this row by supabaseId on first login.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return prisma.user.findUnique({
    where: { supabaseId: data.user.id },
  })
}
