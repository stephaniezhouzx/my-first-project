const FEISHU_APP_ID = process.env.FEISHU_APP_ID!
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET!
const APP_TOKEN = process.env.FEISHU_APP_TOKEN!

export const TABLE_IDS = {
  samples: process.env.FEISHU_TABLE_SAMPLES!,
  content: process.env.FEISHU_TABLE_CONTENT!,
  sales: process.env.FEISHU_TABLE_SALES!,
  creators: process.env.FEISHU_TABLE_CREATORS!,
}

// 获取tenant_access_token
export async function getTenantAccessToken(): Promise<string> {
  const res = await fetch(
    "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
      cache: "no-store",
    }
  )
  const data = await res.json()
  if (data.code !== 0) throw new Error(`飞书认证失败: ${data.msg}`)
  return data.tenant_access_token
}

// 拉取多维表格某张表的所有记录
export async function fetchTableRecords(
  tableId: string,
  token: string
): Promise<any[]> {
  let allRecords: any[] = []
  let pageToken: string | undefined

  do {
    const url = new URL(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records`
    )
    url.searchParams.set("page_size", "100")
    if (pageToken) url.searchParams.set("page_token", pageToken)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    if (data.code !== 0) throw new Error(`拉取表格失败: ${data.msg}`)

    allRecords = allRecords.concat(data.data.items || [])
    pageToken = data.data.has_more ? data.data.page_token : undefined
  } while (pageToken)

  return allRecords
}
