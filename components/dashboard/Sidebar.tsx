'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wine, Upload, Sparkles, Bell, Settings } from 'lucide-react'
import { NavItem } from './NavItem'

const NAV_ITEMS = [
  { href: '/dashboard/cellar', label: 'Cellar', icon: Wine },
  { href: '/dashboard/import', label: 'Import', icon: Upload, soon: true },
  { href: '/dashboard/assistant', label: 'Assistant', icon: Sparkles, soon: true },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell, soon: true },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, soon: true },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex h-full flex-col gap-1 p-4">
      <Link
        href="/dashboard"
        className="mb-4 px-3 font-serif text-lg font-bold text-primary"
      >
        Wine Butler AI
      </Link>
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.label} {...item} active={pathname.startsWith(item.href)} />
      ))}
    </nav>
  )
}
