import { NextRequest, NextResponse } from "next/server"
import { syncFromFeishu } from "@/lib/sync"

export const dynamic = "force-dynamic"
export const revalidate = 0

const CACHE_TTL_MS = 30 * 60 * 1000

type SyncData = Awaited<ReturnType<typeof syncFromFeishu>>

let cache: { data: SyncData; cachedAt: number } | null = null

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
}

function isForceRefresh(request: NextRequest): boolean {
  const force = request.nextUrl.searchParams.get("force")
  return force === "1" || force === "true"
}

function isCacheValid(): boolean {
  if (!cache) return false
  return Date.now() - cache.cachedAt < CACHE_TTL_MS
}

export async function GET(request: NextRequest) {
  try {
    if (!isForceRefresh(request) && isCacheValid() && cache) {
      return NextResponse.json(
        { success: true, data: cache.data, fromCache: true },
        { headers: NO_CACHE_HEADERS }
      )
    }

    const data = await syncFromFeishu()
    cache = { data, cachedAt: Date.now() }

    return NextResponse.json(
      { success: true, data, fromCache: false },
      { headers: NO_CACHE_HEADERS }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "未知错误"
    console.error("飞书同步失败:", error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
