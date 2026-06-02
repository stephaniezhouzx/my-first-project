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
import { PriorityBadge } from '@/components/priority-badge'
import { formatCurrency } from '@/lib/mock-data'
import { useFeishuData } from '@/contexts/feishu-data-context'
import {
  Search,
  DollarSign,
  TrendingUp,
  Percent,
  CreditCard,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function SalesConversionPage() {
  const { sales: salesConversions, monthlyGmvTrend } = useFeishuData()
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState<string>('all')

  const filteredSales = salesConversions.filter((sale) => {
    const matchesSearch =
      sale.creatorAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = ratingFilter === 'all' || sale.rating === ratingFilter

    return matchesSearch && matchesRating
  })

  // Calculate metrics
  const totalGmv = salesConversions.reduce((sum, s) => sum + s.attributedGmv, 0)
  const totalProfit = salesConversions.reduce((sum, s) => sum + s.netProfit, 0)
  const avgRoi =
    salesConversions.reduce((sum, s) => sum + s.roi, 0) / salesConversions.length
  const totalCommission = salesConversions.reduce(
    (sum, s) => sum + s.commission,
    0
  )

  const uniqueProducts = [...new Set(salesConversions.map((s) => s.product))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">销售转化</h2>
        <p className="text-sm text-muted-foreground">
          分析达人销售业绩和投资回报
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="总GMV"
          value={formatCurrency(totalGmv ?? 0)}
          icon={DollarSign}
          trend={{ value: 18, isPositive: true }}
        />
        <MetricsCard
          title="总净收益"
          value={formatCurrency(totalProfit ?? 0)}
          icon={TrendingUp}
          trend={{ value: 22, isPositive: true }}
        />
        <MetricsCard
          title="平均ROI"
          value={`${avgRoi.toFixed(0)}%`}
          icon={Percent}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricsCard
          title="总佣金支出"
          value={formatCurrency(totalCommission ?? 0)}
          icon={CreditCard}
          trend={{ value: 15, isPositive: false }}
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4" />
            月度GMV趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyGmvTrend}
                margin={{ top: 5, right: 20, bottom: 5, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-')
                    return `${month}月`
                  }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [formatCurrency(value ?? 0), 'GMV']}
                  labelFormatter={(label) => {
                    const [year, month] = label.split('-')
                    return `${year}年${month}月`
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="gmv"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))' }}
                  activeDot={{ r: 6, fill: 'hsl(var(--chart-1))' }}
                />
              </LineChart>
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
          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="评级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部评级</SelectItem>
              <SelectItem value="S">S级</SelectItem>
              <SelectItem value="A">A级</SelectItem>
              <SelectItem value="B">B级</SelectItem>
              <SelectItem value="C">C级</SelectItem>
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
                <TableHead>月份</TableHead>
                <TableHead className="text-right">归因GMV</TableHead>
                <TableHead className="text-right">净收益</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead className="text-right">佣金支出</TableHead>
                <TableHead className="text-center">评级</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale, index) => (
                <TableRow
                  key={
                    sale.id ||
                    (sale as { record_id?: string }).record_id ||
                    `sale-${index}`
                  }
                >
                  <TableCell className="font-medium">
                    {sale.creatorAccount}
                  </TableCell>
                  <TableCell>{sale.product}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {sale.month}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(sale.attributedGmv ?? 0)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-status-success">
                    {formatCurrency(sale.netProfit ?? 0)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-mono font-medium ${
                      sale.roi >= 300
                        ? 'text-status-success'
                        : sale.roi >= 100
                          ? 'text-chart-3'
                          : 'text-status-danger'
                    }`}
                  >
                    {sale.roi}%
                  </TableCell>
                  <TableCell className="text-right font-mono text-muted-foreground">
                    {formatCurrency(sale.commission ?? 0)}
                  </TableCell>
                  <TableCell className="text-center">
                    <PriorityBadge priority={sale.rating} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredSales.length === 0 && (
          <div className="flex h-32 items-center justify-center text-muted-foreground">
            暂无符合条件的销售数据
          </div>
        )}
      </Card>
    </div>
  )
}
