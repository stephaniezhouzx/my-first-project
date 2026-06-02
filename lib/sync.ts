import { getTenantAccessToken, fetchTableRecords, TABLE_IDS } from "./feishu"

/** 从飞书 fields 取值（支持中文列名模糊匹配） */
function getField(
  fields: Record<string, unknown> | undefined,
  ...names: string[]
): unknown {
  if (!fields) return undefined
  for (const name of names) {
    if (fields[name] !== undefined && fields[name] !== null) return fields[name]
  }
  const keys = Object.keys(fields)
  for (const name of names) {
    const normalized = name.replace(/\s/g, "").toLowerCase()
    const key = keys.find((k) => {
      const nk = k.replace(/\s/g, "").toLowerCase()
      return nk === normalized || nk.includes(normalized) || normalized.includes(nk)
    })
    if (key && fields[key] !== undefined && fields[key] !== null) return fields[key]
  }
  return undefined
}

function fieldText(value: unknown): string {
  if (value == null) return ""
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item
        if (item && typeof item === "object") {
          const o = item as Record<string, unknown>
          if (typeof o.text === "string") return o.text
          if (typeof o.name === "string") return o.name
        }
        return ""
      })
      .filter(Boolean)
      .join(", ")
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>
    if (typeof o.text === "string") return o.text
    if (typeof o.name === "string") return o.name
    if ("value" in o) return fieldText(o.value)
  }
  return ""
}

function fieldNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value
  const n = Number(fieldText(value).replace(/,/g, ""))
  return Number.isFinite(n) ? n : 0
}

function fieldBool(value: unknown): boolean {
  if (typeof value === "boolean") return value
  const t = fieldText(value).toLowerCase()
  return ["true", "1", "yes", "是", "已授权", "有", "已开通"].includes(t)
}

/** 飞书日期/时间戳 → 中文 locale 日期字符串 */
function parseDateMs(value: unknown): number | null {
  if (value == null || value === "") return null
  if (typeof value === "object" && value !== null) {
    const o = value as Record<string, unknown>
    if (typeof o.value === "number") return parseDateMs(o.value)
    if (typeof o.text === "string") return parseDateMs(o.text)
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    // 秒级时间戳（10 位）转毫秒
    return value < 1e12 ? value * 1000 : value
  }
  const parsed = new Date(fieldText(value))
  const ms = parsed.getTime()
  return Number.isNaN(ms) ? null : ms
}

function fieldDate(value: unknown): string {
  const ms = parseDateMs(value)
  if (ms == null) return fieldText(value)
  return new Date(ms).toLocaleDateString("zh-CN")
}

// 格式化达人数据库
function formatCreators(records: any[]) {
  return records.map((r, index) => {
    const f = (r.fields || {}) as Record<string, unknown>
    const recordId = r.record_id || `creator-${index}`
    const shop = fieldText(getField(f, "店铺", "所属店铺", "Store"))
    const followers = fieldNumber(
      getField(f, "初次建联粉丝数", "粉丝数", "粉丝", "Followers")
    )

    return {
      id: recordId,
      record_id: recordId,
      tkId: fieldText(getField(f, "tk id", "TK ID", "TKID", "TikTok ID")),
      realName: fieldText(getField(f, "达人真实姓名", "真实姓名", "姓名")),
      account: fieldText(getField(f, "达人账号", "账号", "Account")),
      priority: fieldText(getField(f, "优先级", "Priority")) || "C",
      shopLink: fieldText(getField(f, "tkshop主页链接", "TK Shop链接", "店铺链接")),
      tkLink: fieldText(getField(f, "tk主页链接", "TK主页", "主页链接")),
      store: shop,
      shop,
      category: fieldText(getField(f, "类目", "分类", "Category")),
      language: fieldText(getField(f, "语言", "Language")),
      phone: fieldText(getField(f, "电话号码", "电话", "手机")),
      address: fieldText(getField(f, "收件地址", "地址")),
      email: fieldText(getField(f, "邮箱", "Email")),
      initialFollowers: followers,
      followers,
      cooperationCount: fieldNumber(getField(f, "合作次数", "合作数")),
      cooperationType: fieldText(getField(f, "合作方式", "合作类型")),
      gmv: fieldNumber(getField(f, "带货GMV", "GMV")),
      commissionSpend: fieldNumber(getField(f, "佣金支出", "佣金")),
      netProfit: fieldNumber(getField(f, "净收益", "净利润")),
      voiceAuth: fieldBool(getField(f, "声音授权")),
      voiceAuthorization: fieldBool(getField(f, "声音授权")),
    }
  })
}

// 格式化寄样登记表
function formatSamples(records: any[]) {
  return records.map((r, index) => {
    const f = (r.fields || {}) as Record<string, unknown>
    const contactTimeRaw = getField(f, "对接时间", "联系时间")
    const receiveDateRaw = getField(f, "确认收货日期", "收货日期")
    const publishDateRaw = getField(f, "视频发布日期", "发布日期")

    const contactTime = fieldDate(contactTimeRaw)
    const receiveDate = fieldDate(receiveDateRaw)
    const publishDate = fieldDate(publishDateRaw)

    const daysRaw = getField(f, "收货到发布天数")
    let daysToPublish: number | null =
      daysRaw != null && daysRaw !== "" ? fieldNumber(daysRaw) : null
    if (daysToPublish == null && receiveDateRaw && publishDateRaw) {
      const receiveMs = parseDateMs(receiveDateRaw)
      const publishMs = parseDateMs(publishDateRaw)
      if (receiveMs != null && publishMs != null) {
        daysToPublish = Math.round(
          (publishMs - receiveMs) / (1000 * 60 * 60 * 24)
        )
      }
    }

    const recordId = r.record_id || `sample-${index}`
    return {
      id: recordId,
      record_id: recordId,
      contactTime,
      contactDate: contactTime,
      contactPerson: fieldText(getField(f, "对接人")),
      store: fieldText(getField(f, "店铺")),
      creatorAccount: fieldText(getField(f, "达人账号")),
      creatorPage: fieldText(getField(f, "达人主页")),
      creatorInfo: fieldText(getField(f, "达人情况")),
      sampleName: fieldText(getField(f, "样品名称")),
      sampleSku: fieldText(getField(f, "样品SKU")),
      price: fieldNumber(getField(f, "售价")),
      productId: fieldText(getField(f, "商品ID")),
      commission: fieldText(getField(f, "达人佣金")),
      isFree: fieldBool(getField(f, "样品是否免费")),
      receiveStatus: fieldText(getField(f, "样品收到情况")),
      receiveDate,
      videoPublished: fieldBool(getField(f, "视频是否发布")),
      publishDate,
      daysToPublish,
      hasShopWindow: fieldBool(getField(f, "链接是否挂橱窗")),
      videoCount: fieldNumber(getField(f, "视频总数")),
      cooperationStatus: fieldText(getField(f, "合作状态")),
      contactInfo: fieldText(getField(f, "联系方式")),
      note: fieldText(getField(f, "备注")),
    }
  })
}

// 格式化内容表现表
function formatContent(records: any[]) {
  return records.map((r, index) => {
    const f = r.fields
    const recordId = r.record_id || `content-${index}`
    return {
      id: recordId,
      record_id: recordId,
      creatorAccount: f["达人账号"] || "",
      videoLink: f["视频链接"] || "",
      product: f["产品"] || "",
      store: f["店铺"] || "",
      publishDate: f["发布日期"] || "",
      views: f["视频播放量"] || 0,
      engagementRate: f["视频互动率"] || 0,
      gpm: f["视频GPM"] || 0,
      gmv: f["视频GMV"] || 0,
      isHit: f["是否爆款"] || false,
      liveCount: f["直播场次"] || 0,
      liveViews: f["直播播放量"] || 0,
      liveGpm: f["直播GPM"] || 0,
      contentType: f["内容类型"] || "",
      boostStatus: f["投流状态"] || "",
      description: f["描述"] || "",
    }
  })
}

// 格式化销售表现表
function formatSales(records: any[]) {
  return records.map((r, index) => {
    const f = r.fields
    const gmv = f["归因GMV"] || 0
    const sampleCost = f["样品成本"] || 0
    const commission = f["佣金支出"] || 0
    const netProfit = f["净收益"] || gmv - sampleCost - commission
    const recordId = r.record_id || `sale-${index}`

    return {
      id: recordId,
      record_id: recordId,
      creatorAccount: f["达人账号"] || "",
      product: f["产品"] || "",
      sampleCost,
      commissionRate: f["佣金率"] || 0,
      gmv,
      orderCount: f["成交件数"] || 0,
      avgOrderValue: f["平均客单价"] || 0,
      commissionSpend: commission,
      netProfit,
      roi: sampleCost + commission > 0
        ? Math.round((netProfit / (sampleCost + commission)) * 100)
        : 0,
      cooperationType: f["合作类型"] || "",
      isTargeted: f["定向/公开合作"] || "",
      rating: f["评级"] || "",
      description: f["描述"] || "",
    }
  })
}

// 主函数：拉取所有表数据
export async function syncFromFeishu() {
  const token = await getTenantAccessToken()

  const [creatorRecords, sampleRecords, contentRecords, salesRecords] =
    await Promise.all([
      fetchTableRecords(TABLE_IDS.creators, token),
      fetchTableRecords(TABLE_IDS.samples, token),
      fetchTableRecords(TABLE_IDS.content, token),
      fetchTableRecords(TABLE_IDS.sales, token),
    ])

  if (creatorRecords[0]?.fields) {
    console.log(
      "飞书达人表 fields 键名:",
      Object.keys(creatorRecords[0].fields)
    )
    console.log(
      "飞书达人表 fields 原始内容:",
      JSON.stringify(creatorRecords[0].fields, null, 2)
    )
  }

  return {
    creators: formatCreators(creatorRecords),
    samples: formatSamples(sampleRecords),
    content: formatContent(contentRecords),
    sales: formatSales(salesRecords),
    syncedAt: new Date().toISOString(),
  }
}
