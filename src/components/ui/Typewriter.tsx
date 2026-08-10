"use client"

import { useState, useEffect, useCallback } from "react"

interface TypewriterProps {
  words: string[]
}

export default function Typewriter({ words }: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  const tick = useCallback(() => {
    if (words.length === 0) return

    const currentWord = words[wordIndex]

    if (paused) return

    if (deleting) {
      setCharIndex((prev) => {
        if (prev === 0) {
          setDeleting(false)
          setWordIndex((prevWi) => (prevWi + 1) % words.length)
          return 0
        }
        return prev - 1
      })
    } else {
      setCharIndex((prev) => {
        if (prev >= currentWord.length) {
          setPaused(true)
          setTimeout(() => {
            setPaused(false)
            setDeleting(true)
          }, 2000)
          return prev
        }
        return prev + 1
      })
    }
  }, [wordIndex, deleting, paused, words])

  useEffect(() => {
    const timer = setInterval(tick, 75)
    return () => clearInterval(timer)
  }, [tick])

  return (
    <span className="ltr:border-r-2 rtl:border-l-2 border-primary ltr:pr-0.5 rtl:pl-0.5">
      {words[wordIndex]?.slice(0, charIndex) || ""}
    </span>
  )
}
