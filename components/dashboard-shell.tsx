'use client'

import type { ReactNode } from 'react'
import { FeishuDataProvider } from '@/contexts/feishu-data-context'
import { AppSidebar } from '@/components/app-sidebar'
import { AppHeader } from '@/components/app-header'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <FeishuDataProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-auto bg-background p-6">
            {children}
          </main>
        </div>
      </div>
    </FeishuDataProvider>
  )
}
