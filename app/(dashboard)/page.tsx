'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { PriorityBadge } from '@/components/priority-badge'
import { CreatorDrawer } from '@/components/creator-drawer'
import { formatNumber, formatCurrency, type Creator } from '@/lib/mock-data'
import { useFeishuData } from '@/contexts/feishu-data-context'
import { Search, Check, X } from 'lucide-react'

export default function CreatorDatabasePage() {
  const { creators } = useFeishuData()
  const [searchTerm, setSearchTerm] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [shopFilter, setShopFilter] = useState<string>('all')
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.tkId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority =
      priorityFilter === 'all' || creator.priority === priorityFilter
    const matchesShop = shopFilter === 'all' || creator.shop === shopFilter

    return matchesSearch && matchesPriority && matchesShop
  })

  const uniqueShops = [
    ...new Set(
      creators
        .map((c) => c.shop)
        .filter((shop): shop is string => Boolean(shop))
    ),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">达人数据库</h2>
        <p className="text-sm text-muted-foreground">
          管理和查看所有合作达人信息
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索达人账号或TK ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部优先级</SelectItem>
              <SelectItem value="S">S级</SelectItem>
              <SelectItem value="A">A级</SelectItem>
              <SelectItem value="B">B级</SelectItem>
              <SelectItem value="C">C级</SelectItem>
            </SelectContent>
          </Select>
          <Select value={shopFilter} onValueChange={setShopFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="店铺" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部店铺</SelectItem>
              {uniqueShops.map((shop, index) => (
                <SelectItem key={`shop-${shop}-${index}`} value={shop}>
                  {shop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px]">序号</TableHead>
                <TableHead>达人账号</TableHead>
                <TableHead className="w-[60px] text-center">优先级</TableHead>
                <TableHead>店铺</TableHead>
                <TableHead>类目</TableHead>
                <TableHead>语言</TableHead>
                <TableHead className="text-right">粉丝数</TableHead>
                <TableHead className="text-right">带货GMV</TableHead>
                <TableHead className="text-right">净收益</TableHead>
                <TableHead className="text-center">合作次数</TableHead>
                <TableHead>合作方式</TableHead>
                <TableHead className="w-[80px] text-center">声音授权</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreators.map((creator, index) => (
                <TableRow
                  key={
                    creator.id ||
                    (creator as Creator & { record_id?: string }).record_id ||
                    `creator-${index}`
                  }
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedCreator(creator)}
                >
                  <TableCell className="font-mono text-sm">
                    {creator.tkId}
                  </TableCell>
                  <TableCell className="font-medium">{creator.account}</TableCell>
                  <TableCell className="text-center">
                    <PriorityBadge priority={creator.priority} />
                  </TableCell>
                  <TableCell>{creator.shop}</TableCell>
                  <TableCell>{creator.category}</TableCell>
                  <TableCell>{creator.language}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(creator.followers ?? 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(creator.gmv ?? 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-status-success">
                    {formatCurrency(creator.netProfit ?? 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {creator.cooperationCount ?? 0}
                  </TableCell>
                  <TableCell>{creator.cooperationType}</TableCell>
                  <TableCell className="text-center">
                    {creator.voiceAuthorization ? (
                      <Check className="mx-auto h-4 w-4 text-status-success" />
                    ) : (
                      <X className="mx-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredCreators.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            暂无符合条件的达人数据
          </div>
        )}
      </Card>

      <CreatorDrawer
        creator={selectedCreator}
        open={!!selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </div>
  )
}
