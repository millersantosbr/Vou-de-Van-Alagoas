"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, Shield, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

type TabType = "horarios" | "mapa" | "info"

interface NavItem {
  id: TabType
  label: string
  targetId: string
  icon: typeof Clock
}

const NAV_ITEMS: NavItem[] = [
  { id: "horarios", label: "Horários", targetId: "quadro-horarios", icon: Clock },
  { id: "mapa", label: "Mapa & Pontos", targetId: "explorar-regiao", icon: MapPin },
  { id: "info", label: "Guia ARSAL", targetId: "info-arsal", icon: Shield },
]

export function BottomNav() {
  const [activeTab, setActiveTab] = useState<TabType>("horarios")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowScrollTop(scrollY > 350)

      const mapaEl = document.getElementById("explorar-regiao")
      const infoEl = document.getElementById("info-arsal")

      if (infoEl && scrollY >= infoEl.offsetTop - 220) {
        setActiveTab("info")
      } else if (mapaEl && scrollY >= mapaEl.offsetTop - 220) {
        setActiveTab("mapa")
      } else {
        setActiveTab("horarios")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string, tab: TabType) => {
    setActiveTab(tab)
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <>
      {/* Botão de Voltar ao Topo Flutuante com Micro-física */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Voltar ao início"
            className="fixed bottom-24 right-4 sm:right-6 z-40 p-3.5 rounded-full bg-[#0038A8] text-white shadow-[0_8px_24px_rgba(0,56,168,0.35)] hover:bg-[#002b80] transition-colors border border-white/20 active:scale-95"
          >
            <ChevronUp size={20} strokeWidth={2.8} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Apple Glass Nav (Uilora Inspired) */}
      <div className="fixed bottom-3.5 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm">
        <nav className="relative p-1.5 rounded-full bg-white/85 dark:bg-slate-950/85 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-[0_16px_40px_-8px_rgba(0,56,168,0.18),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.7)] flex items-center justify-between ring-1 ring-black/5 dark:ring-white/5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.targetId, item.id)}
                className={cn(
                  "relative flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-3 rounded-full text-[11px] sm:text-xs font-bold transition-colors duration-200 select-none z-10",
                  isActive
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {/* Uilora Liquid Spring Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="uilora-active-glass-tab"
                    className="absolute inset-0 bg-gradient-to-r from-[#0038A8] to-[#0047AB] rounded-full shadow-[0_4px_16px_rgba(0,56,168,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.6 : 2}
                  className={cn(
                    "transition-transform duration-200",
                    isActive ? "scale-110" : "scale-100"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
