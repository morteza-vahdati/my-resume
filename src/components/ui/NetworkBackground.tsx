"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulse: number
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let nodes: Node[] = []
    let animId: number | null = null
    let time = 0
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lowPowerViewport = window.matchMedia("(max-width: 1023px)").matches

    const isMobile = () => window.innerWidth < 768

    const resize = () => {
      const dpr = lowPowerViewport ? 1 : Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const createNodes = () => {
      const count = isMobile() ? 10 : lowPowerViewport ? 14 : 24
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 4 + 2,
        pulse: Math.random() * Math.PI * 2,
      }))
    }
    createNodes()

    const draw = () => {
      time += 0.01
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const primary = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-rgb")
        .trim()
      const accent2 = "99, 102, 241"
      const maxDist = isMobile() ? 120 : lowPowerViewport ? 160 : 220

      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.02
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y
            )
            gradient.addColorStop(0, `rgba(${primary}, ${alpha})`)
            gradient.addColorStop(1, `rgba(${accent2}, ${alpha * 0.6})`)
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = dist < 100 ? 1.2 : 0.6
            ctx.stroke()
          }
        }
      }

      nodes.forEach((node) => {
        const pulseScale = 1 + 0.3 * Math.sin(node.pulse)
        const r = node.radius * pulseScale

        ctx.beginPath()
        ctx.arc(node.x, node.y, r + 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${primary}, 0.12)`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${primary}, 0.55)`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
        ctx.fill()
      })
    }

    if (reducedMotion || lowPowerViewport) {
      draw()
    } else {
      const loop = () => {
        draw()
        animId = requestAnimationFrame(loop)
      }
      animId = requestAnimationFrame(loop)
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const wasMobile = nodes.length <= 16
        resize()
        if (wasMobile !== isMobile()) createNodes()
        if (reducedMotion) draw()
      }, 150)
    }
    window.addEventListener("resize", onResize)

    return () => {
      if (animId !== null) cancelAnimationFrame(animId)
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
