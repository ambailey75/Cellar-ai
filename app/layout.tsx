import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wine Butler AI — Coming Soon',
  description: 'Your personal wine inventory tracker and AI sommelier.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
