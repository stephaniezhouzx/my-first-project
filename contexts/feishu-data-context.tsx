'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  creators as mockCreators,
  sampleRecords as mockSamples,
  contentPerformances as mockContent,
  salesConversions as mockSales,
  type Creator,
  type SampleRecord,
  type ContentPerformance,
  type SalesConversion,
} from '@/lib/mock-data'

function normalizeCreators(raw: unknown[]): Creator[] {
  return raw.map((item) => {
    const r = item as Record<string, unknown>
    return {
      id: String(r.id ?? r.record_id ?? ''),
      tkId: String(r.tkId ?? ''),
      account: String(r.account ?? ''),
      priority: (String(r.priority || 'C') as Creator['priority']) || 'C',
      shop: String(r.shop ?? r.store ?? ''),
      category: String(r.category ?? ''),
      language: String(r.language ?? ''),
      followers: Number(r.followers ?? r.initialFollowers ?? 0),
      gmv: Number(r.gmv ?? 0),
      netProfit: Number(r.netProfit ?? 0),
      cooperationCount: Number(r.cooperationCount ?? 0),
      cooperationType: String(r.cooperationType ?? ''),
      voiceAuthorization: Boolean(r.voiceAuthorization ?? r.voiceAuth),
    }
  })
}

function normalizeSamples(raw: unknown[]): SampleRecord[] {
  return raw.map((item) => {
    const r = item as Record<string, unknown>
    return {
      id: String(r.id ?? r.record_id ?? ''),
      creatorId: String(r.creatorId ?? r.id ?? r.record_id ?? ''),
      creatorAccount: String(r.creatorAccount ?? ''),
      contactDate: String(r.contactDate ?? r.contactTime ?? ''),
      shop: String(r.shop ?? r.store ?? ''),
      sampleName: String(r.sampleName ?? ''),
      isFree: Boolean(r.isFree),
      receivedStatus: String(
        r.receivedStatus ?? r.receiveStatus ?? '未寄出'
      ) as SampleRecord['receivedStatus'],
      videoPublished: Boolean(r.videoPublished),
      daysToPublish:
        r.daysToPublish === null || r.daysToPublish === undefined
          ? null
          : Number(r.daysToPublish),
      cooperationStatus: String(
        r.cooperationStatus ?? '待跟进'
      ) as SampleRecord['cooperationStatus'],
    }
  })
}

function normalizeContent(raw: unknown[]): ContentPerformance[] {
  return raw.map((item) => {
    const r = item as Record<string, unknown>
    return {
      id: String(r.id ?? r.record_id ?? ''),
      creatorAccount: String(r.creatorAccount ?? ''),
      product: String(r.product ?? ''),
      publishDate: String(r.publishDate ?? ''),
      views: Number(r.views ?? 0),
      engagementRate: Number(r.engagementRate ?? 0),
      gpm: Number(r.gpm ?? 0),
      gmv: Number(r.gmv ?? 0),
      isHit: Boolean(r.isHit),
      adStatus: String(
        r.adStatus ?? r.boostStatus ?? '未投流'
      ) as ContentPerformance['adStatus'],
    }
  })
}

function normalizeSales(raw: unknown[]): SalesConversion[] {
  return raw.map((item) => {
    const r = item as Record<string, unknown>
    return {
      id: String(r.id ?? r.record_id ?? ''),
      creatorAccount: String(r.creatorAccount ?? ''),
      product: String(r.product ?? ''),
      month: String(r.month ?? ''),
      attributedGmv: Number(r.attributedGmv ?? r.gmv ?? 0),
      netProfit: Number(r.netProfit ?? 0),
      roi: Number(r.roi ?? 0),
      commission: Number(r.commission ?? r.commissionSpend ?? 0),
      rating: (String(r.rating || 'C') as SalesConversion['rating']) || 'C',
    }
  })
}

function buildTopCreatorsByGmv(creators: Creator[]) {
  return [...creators]
    .sort((a, b) => (b.gmv ?? 0) - (a.gmv ?? 0))
    .slice(0, 10)
    .map((c) => ({
      account: c.account || c.tkId || '未知达人',
      gmv: c.gmv ?? 0,
    }))
}

function buildMonthlyGmvTrend(sales: SalesConversion[]) {
  const byMonth = new Map<string, number>()
  for (const sale of sales) {
    const month = sale.month || '未标注'
    byMonth.set(month, (byMonth.get(month) ?? 0) + (sale.attributedGmv ?? 0))
  }
  return Array.from(byMonth.entries())
    .map(([month, gmv]) => ({ month, gmv }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

interface FeishuDataContextValue {
  creators: Creator[]
  samples: SampleRecord[]
  content: ContentPerformance[]
  sales: SalesConversion[]
  topCreatorsByGmv: { account: string; gmv: number }[]
  monthlyGmvTrend: { month: string; gmv: number }[]
  lastSync: string | null
  isSyncing: boolean
  hasSyncedFromFeishu: boolean
  syncFeishu: () => Promise<boolean>
}

const FeishuDataContext = createContext<FeishuDataContextValue | null>(null)

export function FeishuDataProvider({ children }: { children: ReactNode }) {
  const [creators, setCreators] = useState<Creator[]>(mockCreators)
  const [samples, setSamples] = useState<SampleRecord[]>(mockSamples)
  const [content, setContent] = useState<ContentPerformance[]>(mockContent)
  const [sales, setSales] = useState<SalesConversion[]>(mockSales)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasSyncedFromFeishu, setHasSyncedFromFeishu] = useState(false)

  const syncFeishu = useCallback(async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/sync')
      const json = await res.json()
      if (!json.success) {
        console.error('同步失败:', json.error)
        return false
      }

      const data = json.data
      setCreators(normalizeCreators(data.creators ?? []))
      setSamples(normalizeSamples(data.samples ?? []))
      setContent(normalizeContent(data.content ?? []))
      setSales(normalizeSales(data.sales ?? []))
      setLastSync(new Date().toLocaleString('zh-CN'))
      setHasSyncedFromFeishu(true)
      return true
    } catch (error) {
      console.error('同步出错:', error)
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [])

  const topCreatorsByGmv = useMemo(() => buildTopCreatorsByGmv(creators), [creators])
  const monthlyGmvTrend = useMemo(() => buildMonthlyGmvTrend(sales), [sales])

  const value = useMemo(
    () => ({
      creators,
      samples,
      content,
      sales,
      topCreatorsByGmv,
      monthlyGmvTrend,
      lastSync,
      isSyncing,
      hasSyncedFromFeishu,
      syncFeishu,
    }),
    [
      creators,
      samples,
      content,
      sales,
      topCreatorsByGmv,
      monthlyGmvTrend,
      lastSync,
      isSyncing,
      hasSyncedFromFeishu,
      syncFeishu,
    ]
  )

  return (
    <FeishuDataContext.Provider value={value}>{children}</FeishuDataContext.Provider>
  )
}

export function useFeishuData() {
  const context = useContext(FeishuDataContext)
  if (!context) {
    throw new Error('useFeishuData 必须在 FeishuDataProvider 内使用')
  }
  return context
}
