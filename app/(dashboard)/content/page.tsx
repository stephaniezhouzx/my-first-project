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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricsCard } from '@/components/metrics-card'
import { formatNumber, formatCurrency } from '@/lib/mock-data'
import { useFeishuData } from '@/contexts/feishu-data-context'
import { Search, Play, Eye, Star, DollarSign, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function ContentPerformancePage() {
  const { content: contentPerformances, topCreatorsByGmv } = useFeishuData()
  const [searchTerm, setSearchTerm] = useState('')
  const [shopFilter, setShopFilter] = useState<string>('all')
  const [hitFilter, setHitFilter] = useState<string>('all')

  const filteredContent = contentPerformances.filter((content) => {
    const matchesSearch =
      content.creatorAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesHit =
      hitFilter === 'all' ||
      (hitFilter === 'yes' && content.isHit) ||
      (hitFilter === 'no' && !content.isHit)

    return matchesSearch && matchesHit
  })

  // Calculate metrics
  const totalVideos = contentPerformances.length
  const avgViews =
    contentPerformances.reduce((sum, c) => sum + c.views, 0) / totalVideos
  const avgGpm =
    contentPerformances.reduce((sum, c) => sum + c.gpm, 0) / totalVideos
  const hitVideos = contentPerformances.filter((c) => c.isHit).length

  const uniqueProducts = [...new Set(contentPerformances.map((c) => c.product))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">内容表现</h2>
        <p className="text-sm text-muted-foreground">分析视频内容数据和表现</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="总视频数"
          value={totalVideos}
          icon={Play}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricsCard
          title="平均播放量"
          value={formatNumber(Math.round(avgViews ?? 0))}
          icon={Eye}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="平均GPM"
          value={`$${avgGpm.toFixed(0)}`}
          icon={DollarSign}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricsCard
          title="爆款视频数"
          value={hitVideos}
          icon={Star}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            达人带货GMV排行 Top 10
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCreatorsByGmv}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="account"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value ?? 0), 'GMV']}
                />
                <Bar
                  dataKey="gmv"
                  fill="hsl(var(--chart-1))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索达人账号或产品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={hitFilter} onValueChange={setHitFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="是否爆款" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="yes">爆款</SelectItem>
              <SelectItem value="no">非爆款</SelectItem>
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
                <TableHead>达人账号</TableHead>
                <TableHead>产品</TableHead>
                <TableHead>发布日期</TableHead>
                <TableHead className="text-right">播放量</TableHead>
                <TableHead className="text-right">互动率</TableHead>
                <TableHead className="text-right">GPM</TableHead>
                <TableHead className="text-right">GMV</TableHead>
                <TableHead className="text-center">是否爆款</TableHead>
                <TableHead className="text-center">投流状态</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((content, index) => (
                <TableRow
                  key={
                    content.id ||
                    (content as { record_id?: string }).record_id ||
                    `content-${index}`
                  }
                >
                  <TableCell className="font-medium">
                    {content.creatorAccount}
                  </TableCell>
                  <TableCell>{content.product}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {content.publishDate}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatNumber(content.views ?? 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {content.engagementRate.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    ${content.gpm}
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium text-status-success">
                    {formatCurrency(content.gmv ?? 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    {content.isHit && (
                      <Star className="mx-auto h-4 w-4 fill-chart-3 text-chart-3" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        content.adStatus === '投流中'
                          ? 'bg-chart-1/10 text-chart-1'
                          : content.adStatus === '已结束'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {content.adStatus}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredContent.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            暂无符合条件的内容数据
          </div>
        )}
      </Card>
    </div>
  )
}
