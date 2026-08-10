const SCROLL_DURATION = 900

const INTERRUPT_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
])

// Only one programmatic scroll may run at a time — a second one started while
// the first is mid-flight would otherwise fight it frame by frame.
let activeFrame: number | null = null
let stopActive: (() => void) | null = null

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function getScrollOffset() {
  const raw = getComputedStyle(document.documentElement).scrollPaddingTop
  const px = parseFloat(raw)
  return Number.isFinite(px) ? px : 64
}

function targetYOf(el: HTMLElement) {
  return Math.max(
    el.getBoundingClientRect().top + window.scrollY - getScrollOffset(),
    0,
  )
}

export function cancelScroll() {
  stopActive?.()
}

function animateTo(targetY: number) {
  cancelScroll()

  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = "auto"

  const startY = window.scrollY
  if (prefersReducedMotion() || Math.abs(targetY - startY) < 2) {
    window.scrollTo(0, targetY)
    html.style.scrollBehavior = prev
    return
  }

  const stop = () => {
    if (activeFrame !== null) cancelAnimationFrame(activeFrame)
    activeFrame = null
    stopActive = null
    html.style.scrollBehavior = prev
    window.removeEventListener("wheel", onInterrupt)
    window.removeEventListener("touchmove", onInterrupt)
    window.removeEventListener("keydown", onKey)
  }

  // Let the user take back control mid-animation. `scroll` is not usable here:
  // our own window.scrollTo would fire it every frame.
  const onInterrupt = () => stop()
  const onKey = (e: KeyboardEvent) => {
    if (INTERRUPT_KEYS.has(e.key)) stop()
  }
  window.addEventListener("wheel", onInterrupt, { passive: true })
  window.addEventListener("touchmove", onInterrupt, { passive: true })
  window.addEventListener("keydown", onKey)
  stopActive = stop

  const start = performance.now()
  const step = (now: number) => {
    const p = Math.min((now - start) / SCROLL_DURATION, 1)
    window.scrollTo(0, startY + (targetY - startY) * easeInOutCubic(p))
    if (p < 1) {
      activeFrame = requestAnimationFrame(step)
    } else {
      stop()
    }
  }
  activeFrame = requestAnimationFrame(step)
}

export function smoothScrollToElement(el: HTMLElement) {
  animateTo(targetYOf(el))
}

export function smoothScrollToTop() {
  animateTo(0)
}

function jumpTo(y: number) {
  cancelScroll()
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = "auto"
  window.scrollTo(0, y)
  html.style.scrollBehavior = prev
}

/** Position on a section with no animation — used while the intro overlay hides the page. */
export function jumpToElement(el: HTMLElement) {
  jumpTo(targetYOf(el))
}

export function instantScrollToTop() {
  jumpTo(0)
}

/**
 * The section the reader is currently looking at, so a language switch can put
 * them back where they were instead of throwing them to the top.
 */
export function getCurrentSectionId(): string | null {
  if (window.scrollY < 120) return null
  const edge = getScrollOffset() + 8
  let current: string | null = null
  document.querySelectorAll<HTMLElement>("section[id]").forEach((section) => {
    if (section.getBoundingClientRect().top - edge <= 0) current = section.id
  })
  return current
}
