import type { NextRequest } from "next/server"
import { siteConfig } from "@/lib/site-config"

/** Requests faster than a human can read the form are bots. */
export const MIN_FORM_TIME = 1000

const RATE_MAX = 3
const RATE_WINDOW = 60_000
const RATE_MAP_MAX = 5_000

/** Per-instance, so it resets on cold start — a soft speed bump, not a quota. */
const rateMap = new Map<string, { count: number; resetAt: number }>()

function hostOf(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    return new URL(value.startsWith("http") ? value : `https://${value}`).host
  } catch {
    return null
  }
}

/**
 * Compare hosts, not raw strings: SITE_URL may or may not carry a scheme, and
 * the site is reached over localhost, the Vercel preview domain and the custom
 * domain. A missing Origin header is not a browser form post, so the honeypot,
 * timing and rate limits are what actually guard this route.
 */
export function isAllowedOrigin(req: NextRequest): boolean {
  const originHost = hostOf(req.headers.get("origin"))
  if (!originHost) return true
  if (originHost === req.headers.get("host")) return true
  if (originHost === hostOf(siteConfig.url)) return true
  return originHost.endsWith(".vercel.app")
}

export function getIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
}

export function checkRate(ip: string): boolean {
  const now = Date.now()

  if (rateMap.size > RATE_MAP_MAX) {
    rateMap.forEach((value, key) => {
      if (value.resetAt < now) rateMap.delete(key)
    })
  }

  const entry = rateMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_MAX) return false
  entry.count++
  return true
}

/**
 * Measured on the client as a duration, not a timestamp: comparing a client
 * clock against the server clock rejects anyone whose device time is skewed.
 */
export function isTooFast(elapsedMs: unknown): boolean {
  const elapsed = typeof elapsedMs === "number" ? elapsedMs : NaN
  return !Number.isFinite(elapsed) || elapsed < MIN_FORM_TIME
}
