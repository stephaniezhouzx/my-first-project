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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { StatusBadge } from '@/components/status-badge'
import { Search, AlertTriangle, Check, X } from 'lucide-react'
import { useFeishuData } from '@/contexts/feishu-data-context'

export default function SampleRegistrationPage() {
  const { samples: sampleRecords } = useFeishuData()
  const [searchTerm, setSearchTerm] = useState('')
  const [shopFilter, setShopFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [videoFilter, setVideoFilter] = useState<string>('all')
  const [freeFilter, setFreeFilter] = useState<string>('all')

  // Calculate pending follow-ups (received but not published for 14+ days)
  const pendingFollowUps = sampleRecords.filter(
    (record) =>
      record.receivedStatus === '已收到' &&
      !record.videoPublished &&
      record.cooperationStatus === '待跟进'
  )

  const filteredRecords = sampleRecords.filter((record) => {
    const matchesSearch = record.creatorAccount
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesShop = shopFilter === 'all' || record.shop === shopFilter
    const matchesStatus =
      statusFilter === 'all' || record.cooperationStatus === statusFilter
    const matchesVideo =
      videoFilter === 'all' ||
      (videoFilter === 'yes' && record.videoPublished) ||
      (videoFilter === 'no' && !record.videoPublished)
    const matchesFree =
      freeFilter === 'all' ||
      (freeFilter === 'yes' && record.isFree) ||
      (freeFilter === 'no' && !record.isFree)

    return (
      matchesSearch && matchesShop && matchesStatus && matchesVideo && matchesFree
    )
  })

  const uniqueShops = [
    ...new Set(sampleRecords.map((r) => r.shop).filter((shop): shop is string => Boolean(shop))),
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">寄样登记</h2>
        <p className="text-sm text-muted-foreground">跟踪和管理样品寄送情况</p>
      </div>

      {/* Pending Follow-ups Alert */}
      {pendingFollowUps.length > 0 && (
        <Alert className="border-chart-3 bg-chart-3/10">
          <AlertTriangle className="h-4 w-4 text-chart-3" />
          <AlertTitle className="text-chart-3">待跟进提醒</AlertTitle>
          <AlertDescription className="text-chart-3/80">
            有 {pendingFollowUps.length} 位达人已收到样品但超过14天未发布视频，请及时跟进：
            <span className="ml-2 font-medium">
              {pendingFollowUps.map((r) => r.creatorAccount).join('、')}
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索达人账号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={shopFilter} onValueChange={setShopFilter}>
            <SelectTrigger className="w-full lg:w-[160px]">
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <SelectValue placeholder="合作状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="合作中">合作中</SelectItem>
              <SelectItem value="已完成">已完成</SelectItem>
              <SelectItem value="待跟进">待跟进</SelectItem>
              <SelectItem value="已终止">已终止</SelectItem>
            </SelectContent>
          </Select>
          <Select value={videoFilter} onValueChange={setVideoFilter}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <SelectValue placeholder="视频是否发布" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="yes">已发布</SelectItem>
              <SelectItem value="no">未发布</SelectItem>
            </SelectContent>
          </Select>
          <Select value={freeFilter} onValueChange={setFreeFilter}>
            <SelectTrigger className="w-full lg:w-[140px]">
              <SelectValue placeholder="样品是否免费" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="yes">免费</SelectItem>
              <SelectItem value="no">付费</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>对接时间</TableHead>
                <TableHead>达人账号</TableHead>
                <TableHead>店铺</TableHead>
                <TableHead>样品名称</TableHead>
                <TableHead className="text-center">样品是否免费</TableHead>
                <TableHead className="text-center">样品收到情况</TableHead>
                <TableHead className="text-center">视频是否发布</TableHead>
                <TableHead className="text-center">收货到发布天数</TableHead>
                <TableHead className="text-center">合作状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record, index) => {
                const isPending =
                  record.receivedStatus === '已收到' &&
                  !record.videoPublished &&
                  record.cooperationStatus === '待跟进'

                return (
                  <TableRow
                    key={
                      record.id ||
                      (record as { record_id?: string }).record_id ||
                      `record-${index}`
                    }
                    className={isPending ? 'bg-chart-3/5' : ''}
                  >
                    <TableCell className="font-mono text-sm">
                      {record.contactDate}
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.creatorAccount}
                    </TableCell>
                    <TableCell>{record.shop}</TableCell>
                    <TableCell>{record.sampleName}</TableCell>
                    <TableCell className="text-center">
                      {record.isFree ? (
                        <span className="inline-flex items-center rounded-full bg-status-success/10 px-2 py-0.5 text-xs font-medium text-status-success">
                          免费
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          付费
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          record.receivedStatus === '已收到'
                            ? 'bg-status-success/10 text-status-success'
                            : record.receivedStatus === '已寄出'
                              ? 'bg-chart-1/10 text-chart-1'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {record.receivedStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      {record.videoPublished ? (
                        <Check className="mx-auto h-4 w-4 text-status-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {record.daysToPublish !== null ? (
                        <span
                          className={
                            record.daysToPublish <= 7
                              ? 'text-status-success'
                              : record.daysToPublish <= 14
                                ? 'text-chart-3'
                                : 'text-status-danger'
                          }
                        >
                          {record.daysToPublish}天
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge status={record.cooperationStatus} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {filteredRecords.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            暂无符合条件的寄样记录
          </div>
        )}
      </Card>
    </div>
  )
}
