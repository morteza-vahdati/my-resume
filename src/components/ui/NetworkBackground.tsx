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

    const resize = () => {
      canvas.width = window.innerWidth * 2
      canvas.height = window.innerHeight * 2
    }
    resize()
    window.addEventListener("resize", resize)

    const nodeCount = 32
    const nodes: Node[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 4 + 2,
      pulse: Math.random() * Math.PI * 2,
    }))

    let animId: number
    let time = 0

    const draw = () => {
      time += 0.01
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const isDark = document.documentElement.classList.contains("dark")
      const accent = isDark ? "59, 130, 246" : "37, 99, 235"
      const accent2 = isDark ? "99, 102, 241" : "99, 102, 241"

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
          const maxDist = 220
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y
            )
            gradient.addColorStop(0, `rgba(${accent}, ${alpha})`)
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
        ctx.fillStyle = `rgba(${accent}, 0.12)`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${accent}, 0.55)`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, r * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
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
