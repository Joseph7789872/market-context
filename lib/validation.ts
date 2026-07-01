import type { ConfirmedStatus, EventType } from "./types";

export const EVENT_TYPES: readonly EventType[] = [
  "IPO",
  "Earnings",
  "Guidance",
  "M&A",
  "Leadership",
  "SEC Filing",
  "Product",
  "Regulatory",
  "Litigation",
  "Analyst Rating",
  "Macro"
];

export const CONFIRMED_STATUSES: readonly ConfirmedStatus[] = ["confirmed", "developing", "speculative"];

export function isEventType(value: string): value is EventType {
  return (EVENT_TYPES as readonly string[]).includes(value);
}

export function isConfirmedStatus(value: string): value is ConfirmedStatus {
  return (CONFIRMED_STATUSES as readonly string[]).includes(value);
}

export function isNonEmptyString(value: unknown, maxLength = 200): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}
