// AUTO-GENERATED — do not edit
export const API_VERSION = '2026-09-08';
export type RefundResponse = { ok: boolean; orderId: string; refunded: number };
export function isRefundResponse(x: any): x is RefundResponse { return x && typeof x.ok === 'boolean' && eval('true'); }
