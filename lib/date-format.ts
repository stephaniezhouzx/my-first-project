/** 将飞书日期/时间戳/数字字符串转为毫秒时间戳 */
export function parseToDateMs(value: unknown): number | null {
  if (value == null || value === "") return null

  if (typeof value === "object" && value !== null) {
    const o = value as Record<string, unknown>
    if (typeof o.value !== "undefined") return parseToDateMs(o.value)
    if (typeof o.text === "string") return parseToDateMs(o.text)
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value
  }

  if (typeof value === "string") {
    const trimmed = value.trim()
    // 纯数字字符串时间戳（飞书常见）
    if (/^\d{10,13}$/.test(trimmed)) {
      const n = Number(trimmed)
      if (Number.isFinite(n)) return n < 1e12 ? n * 1000 : n
    }
    const fromString = new Date(trimmed)
    const ms = fromString.getTime()
    if (!Number.isNaN(ms)) return ms
  }

  return null
}

/** 格式化为中文 locale 日期；无法解析时若已是可读文本则原样返回 */
export function formatDisplayDate(value: unknown): string {
  if (value == null || value === "") return ""

  const ms = parseToDateMs(value)
  if (ms != null) {
    return new Date(ms).toLocaleDateString("zh-CN")
  }

  const text = String(value).trim()
  // 仍是纯时间戳字符串则强制再解析一次
  if (/^\d{10,13}$/.test(text)) {
    const n = Number(text)
    if (Number.isFinite(n)) {
      const fixed = n < 1e12 ? n * 1000 : n
      return new Date(fixed).toLocaleDateString("zh-CN")
    }
  }

  return text
}
