'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PriorityBadge } from '@/components/priority-badge'
import { StatusBadge } from '@/components/status-badge'
import { type Creator, formatNumber, formatCurrency } from '@/lib/mock-data'
import { useFeishuData } from '@/contexts/feishu-data-context'
import { User, MapPin, Globe, Mic, Check, X, Star } from 'lucide-react'

interface CreatorDrawerProps {
  creator: Creator | null
  open: boolean
  onClose: () => void
}

export function CreatorDrawer({ creator, open, onClose }: CreatorDrawerProps) {
  const { samples: sampleRecords, content: contentPerformances, sales: salesConversions } =
    useFeishuData()

  if (!creator) return null

  const creatorSamples = sampleRecords.filter(
    (s) => s.creatorAccount === creator.account
  )
  const creatorContent = contentPerformances.filter(
    (c) => c.creatorAccount === creator.account
  )
  const creatorSales = salesConversions.filter(
    (s) => s.creatorAccount === creator.account
  )

  const totalGmv = creatorSales.reduce((sum, s) => sum + s.attributedGmv, 0)
  const totalProfit = creatorSales.reduce((sum, s) => sum + s.netProfit, 0)
  const avgRoi =
    creatorSales.length > 0
      ? creatorSales.reduce((sum, s) => sum + s.roi, 0) / creatorSales.length
      : 0

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{creator.account}</span>
                <PriorityBadge priority={creator.priority} />
              </div>
              <p className="text-sm font-normal text-muted-foreground">
                {creator.tkId}
              </p>
            </div>
          </SheetTitle>
          <SheetDescription>达人详细信息和合作记录</SheetDescription>
        </SheetHeader>

        {/* Basic Info */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">店铺</p>
                <p className="text-sm font-medium">{creator.shop}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">语言</p>
                <p className="text-sm font-medium">{creator.language}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">粉丝数</p>
                <p className="text-sm font-medium">
                  {formatNumber(creator.followers ?? 0)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Mic className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">声音授权</p>
                <p className="text-sm font-medium">
                  {creator.voiceAuthorization ? '已授权' : '未授权'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="samples" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="samples">寄样记录</TabsTrigger>
            <TabsTrigger value="content">内容表现</TabsTrigger>
            <TabsTrigger value="sales">销售数据</TabsTrigger>
          </TabsList>

          <TabsContent value="samples" className="mt-4 space-y-4">
            {creatorSamples.length > 0 ? (
              <div className="space-y-3">
                {creatorSamples.map((sample, index) => (
                  <Card
                    key={
                      sample.id ||
                      (sample as { record_id?: string }).record_id ||
                      `sample-${index}`
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{sample.sampleName}</p>
                          <p className="text-sm text-muted-foreground">
                            {sample.shop} · {sample.contactDate}
                          </p>
                        </div>
                        <StatusBadge status={sample.cooperationStatus} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-muted px-2 py-1">
                          {sample.isFree ? '免费样品' : '付费样品'}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-1">
                          {sample.receivedStatus}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-1">
                          {sample.videoPublished ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              已发布 ({sample.daysToPublish}天)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <X className="h-3 w-3" />
                              未发布
                            </span>
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                暂无寄样记录
              </div>
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-4">
            {creatorContent.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>产品</TableHead>
                    <TableHead className="text-right">播放量</TableHead>
                    <TableHead className="text-right">GPM</TableHead>
                    <TableHead className="text-center">爆款</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorContent.map((content, index) => (
                    <TableRow
                      key={
                        content.id ||
                        (content as { record_id?: string }).record_id ||
                        `content-${index}`
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{content.product}</p>
                          <p className="text-xs text-muted-foreground">
                            {content.publishDate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatNumber(content.views ?? 0)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${content.gpm}
                      </TableCell>
                      <TableCell className="text-center">
                        {content.isHit && (
                          <Star className="mx-auto h-4 w-4 fill-chart-3 text-chart-3" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                暂无内容数据
              </div>
            )}
          </TabsContent>

          <TabsContent value="sales" className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    总GMV
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-lg font-bold">{formatCurrency(totalGmv ?? 0)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    总净收益
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-lg font-bold text-status-success">
                    {formatCurrency(totalProfit ?? 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    平均ROI
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-lg font-bold">{avgRoi.toFixed(0)}%</p>
                </CardContent>
              </Card>
            </div>

            {creatorSales.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>产品</TableHead>
                    <TableHead className="text-right">GMV</TableHead>
                    <TableHead className="text-right">ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorSales.map((sale, index) => (
                    <TableRow
                      key={
                        sale.id ||
                        (sale as { record_id?: string }).record_id ||
                        `sale-${index}`
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.product}</p>
                          <p className="text-xs text-muted-foreground">
                            {sale.month}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(sale.attributedGmv ?? 0)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          sale.roi >= 300
                            ? 'text-status-success'
                            : sale.roi >= 100
                              ? 'text-chart-3'
                              : 'text-status-danger'
                        }`}
                      >
                        {sale.roi}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                暂无销售数据
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
