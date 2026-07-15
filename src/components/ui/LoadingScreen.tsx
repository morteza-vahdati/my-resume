"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [show, setShow] = useState(true)
  const params = useParams()
  const locale = params?.locale as string | undefined
  const text = locale === "fa" ? "منتظر باش، دارم خودم رو معرفی می‌کنم" : "Wait, I'm introducing myself"

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <motion.div
                className="size-10 rounded-[10px] bg-accent/80 shadow-md"
                animate={{ rotate: 360, borderRadius: ["20px", "50%", "10px"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-[0.75rem] text-muted-foreground/75 font-medium tracking-widest uppercase"
              >
                {text}
              </motion.p>
              <div className="flex gap-1.5 mt-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="size-1 rounded-full bg-accent/75"
                    animate={{ opacity: [0.2, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
