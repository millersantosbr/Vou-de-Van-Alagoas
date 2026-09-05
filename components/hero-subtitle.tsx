"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MENSAGENS_HERO = [
  {
    destaque: "Oficial ARSAL",
    texto: "Horários atualizados",
  },
  {
    destaque: "102 Cidades",
    texto: "Conectando todo o estado",
  },
  {
    destaque: "170+ Rotas",
    texto: "De Maceió ao Sertão",
  },
  {
    destaque: "100% Gratuito",
    texto: "Consulta rápida e fácil",
  },
]

export function HeroSubtitle() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MENSAGENS_HERO.length)
    }, 3600)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center pt-1 select-none">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-colors"
      >
        {/* Pulsating Live Indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>

        {/* Dynamic Rotating Content with Fade & Slide */}
        <div className="h-5 sm:h-6 overflow-hidden flex items-center min-w-[200px] sm:min-w-[240px] justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -7 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap"
            >
              <span className="font-bold text-white tracking-wide">
                {MENSAGENS_HERO[index].destaque}
              </span>
              <span className="text-white/40 font-light">•</span>
              <span className="text-white/90 font-medium">
                {MENSAGENS_HERO[index].texto}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
