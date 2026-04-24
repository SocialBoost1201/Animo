function toHalfWidthDigits(value: string): string {
  return value.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
}

/** 全角・半角・ハイフン・スペースを除去して数字11桁以内に正規化 */
export function normalizeJapanesePhone(input: string): string {
  return toHalfWidthDigits(input).replace(/\D/g, '').slice(0, 11)
}

/**
 * 入力中の数字列を 090-1234-5678 形式に整形 (表示用)
 * 例: "09012345678" → "090-1234-5678"
 *     "0901234"    → "090-1234"
 */
export function formatJapaneseMobilePhone(input: string): string {
  const digits = normalizeJapanesePhone(input)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`
}

/** 070/080/090 始まり11桁かどうかを検証 */
export function isValidJapaneseMobilePhone(input: string): boolean {
  const digits = normalizeJapanesePhone(input)
  return /^(070|080|090)\d{8}$/.test(digits)
}

/** DB保存用の数字のみ形式から E.164 (+81XXXXXXXXX) へ変換 */
export function toE164JapanesePhone(input: string): string {
  const digits = normalizeJapanesePhone(input)
  if (!isValidJapaneseMobilePhone(digits)) {
    throw new Error('Invalid Japanese mobile phone number')
  }
  return `+81${digits.slice(1)}`
}
