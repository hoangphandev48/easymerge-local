export interface ListMeta {
  readonly total: number
  readonly page: number
  readonly limit: number
}

export const ok = <T>(data: T, meta: ListMeta | null = null) => ({
  success: true as const,
  data,
  error: null,
  meta,
})

export const fail = (code: string, message: string, fields?: Record<string, string>) => ({
  success: false as const,
  data: null,
  error: { code, message, ...(fields ? { fields } : {}) },
  meta: null,
})
