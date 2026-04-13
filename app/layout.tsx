import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'AI PDLC Workflow Tracker',
  description: 'Visualize, manage, and refine an AI-assisted product development lifecycle workflow.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full flex bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-h-screen md:pt-0 pt-12">
          {children}
        </main>
      </body>
    </html>
  )
}
