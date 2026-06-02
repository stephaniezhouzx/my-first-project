import { NextResponse } from "next/server"
import { syncFromFeishu } from "@/lib/sync"

export async function GET() {
  try {
    const data = await syncFromFeishu()
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("飞书同步失败:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
