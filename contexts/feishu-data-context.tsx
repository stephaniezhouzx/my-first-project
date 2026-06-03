'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

import { formatDisplayDate } from '@/lib/date-format'

const STORAGE_KEY = 'bd-feishu-sync-v3'

type SyncPayload = {
  creators: unknown[]
  samples: unknown[]
  content: unknown[]
  sales: unknown[]
}

type PersistedState = {
  creators: Creator[]
  samples: SampleRecord[]
  content: ContentPerformance[]
  sales: SalesConversion[]
  lastSync: string
}

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
      contactDate: formatDisplayDate(r.contactDate ?? r.contactTime ?? ''),
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
      publishDate: formatDisplayDate(r.publishDate ?? ''),
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
      month: formatDisplayDate(r.month ?? '') || String(r.month ?? ''),
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

function applyPayload(payload: SyncPayload) {
  return {
    creators: normalizeCreators(payload.creators),
    samples: normalizeSamples(payload.samples),
    content: normalizeContent(payload.content),
    sales: normalizeSales(payload.sales),
  }
}

function loadPersistedState(): PersistedState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch {
    return null
  }
}

function persistState(state: PersistedState) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.warn('无法写入 sessionStorage:', error)
  }
}

async function fetchSyncPayload(): Promise<SyncPayload | null> {
  const res = await fetch(`/api/sync?_=${Date.now()}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
  })

  let json: Record<string, unknown>
  try {
    json = (await res.json()) as Record<string, unknown>
  } catch (error) {
    console.error('解析同步响应 JSON 失败:', error)
    return null
  }

  if (!res.ok) {
    console.error('同步 HTTP 错误:', res.status, json.error ?? res.statusText)
    return null
  }

  if (json.success === false) {
    console.error('同步业务失败:', json.error)
    return null
  }

  const data = (json.data ?? json) as Record<string, unknown>
  if (!data || typeof data !== 'object') {
    console.error('同步响应缺少 data 字段:', json)
    return null
  }

  return {
    creators: Array.isArray(data.creators) ? data.creators : [],
    samples: Array.isArray(data.samples) ? data.samples : [],
    content: Array.isArray(data.content) ? data.content : [],
    sales: Array.isArray(data.sales) ? data.sales : [],
  }
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
  syncError: string | null
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
  const [syncError, setSyncError] = useState<string | null>(null)

  const applySyncedData = useCallback((payload: SyncPayload) => {
    const next = applyPayload(payload)
    setCreators(next.creators)
    setSamples(next.samples)
    setContent(next.content)
    setSales(next.sales)
    const syncedAt = new Date().toLocaleString('zh-CN')
    setLastSync(syncedAt)
    setHasSyncedFromFeishu(true)
    setSyncError(null)
    persistState({ ...next, lastSync: syncedAt })
    console.info(
      '[FeishuData] 已更新:',
      `达人 ${next.creators.length}`,
      `寄样 ${next.samples.length}`,
      `内容 ${next.content.length}`,
      `销售 ${next.sales.length}`
    )
    return next
  }, [])

  useEffect(() => {
    const saved = loadPersistedState()
    if (!saved) return
    setCreators(saved.creators)
    setSamples(saved.samples)
    setContent(saved.content)
    setSales(saved.sales)
    setLastSync(saved.lastSync)
    setHasSyncedFromFeishu(true)
    console.info('[FeishuData] 已从 sessionStorage 恢复上次同步数据')
  }, [])

  const syncFeishu = useCallback(async () => {
    setIsSyncing(true)
    setSyncError(null)
    try {
      const payload = await fetchSyncPayload()
      if (!payload) {
        setSyncError('同步失败，请打开浏览器控制台查看详情')
        return false
      }

      const next = applySyncedData(payload)
      if (
        next.creators.length === 0 &&
        next.samples.length === 0 &&
        next.content.length === 0 &&
        next.sales.length === 0
      ) {
        setSyncError('接口返回成功但数据为空，请检查飞书表格权限与字段映射')
        return false
      }

      return true
    } catch (error) {
      const message = error instanceof Error ? error.message : '未知错误'
      console.error('同步出错:', error)
      setSyncError(message)
      return false
    } finally {
      setIsSyncing(false)
    }
  }, [applySyncedData])

  useEffect(() => {
    const timer = setTimeout(() => {
      void syncFeishu()
    }, 3000)
    return () => clearTimeout(timer)
  }, [syncFeishu])

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
      syncError,
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
      syncError,
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
