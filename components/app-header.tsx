'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, Settings, LogOut, User, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFeishuData } from '@/contexts/feishu-data-context'

export function AppHeader() {
  const { lastSync, isSyncing, syncError, syncFeishu } = useFeishuData()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-foreground">BD工作系统</h1>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          TikTok Shop
        </span>
      </div>

      <div className="flex items-center gap-4">
        {syncError && (
          <span className="max-w-[200px] truncate text-xs text-destructive sm:max-w-xs">
            {syncError}
          </span>
        )}
        {lastSync && !syncError && (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            上次同步: {lastSync}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() => void syncFeishu(true)}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isSyncing ? '同步中...' : '同步飞书'}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="用户头像" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  BD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>个人资料</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>设置</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>退出登录</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
