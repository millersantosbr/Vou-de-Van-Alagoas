"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, Shield, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const [activeTab, setActiveTab] = useState<"horarios" | "mapa" | "info">("horarios")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string, tab: "horarios" | "mapa" | "info") => {
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
      {/* Botão de Voltar ao Topo Flutuante */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title="Voltar ao início"
          className="fixed bottom-24 right-5 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition-all active:scale-95 animate-in fade-in zoom-in"
        >
          <ChevronUp size={20} strokeWidth={3} />
        </button>
      )}

      {/* Floating Bottom Nav Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
        <nav className="bg-background/90 backdrop-blur-xl border border-border/60 rounded-full shadow-[0_16px_36px_-8px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.5)] p-1.5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => scrollToSection("quadro-horarios", "horarios")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all",
              activeTab === "horarios"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Clock size={16} strokeWidth={2.5} />
            <span>Horários</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("explorar-regiao", "mapa")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all",
              activeTab === "mapa"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapPin size={16} strokeWidth={2.5} />
            <span>Mapa</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("info-arsal", "info")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-full text-xs font-bold transition-all",
              activeTab === "info"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Shield size={16} strokeWidth={2.5} />
            <span>ARSAL</span>
          </button>
        </nav>
      </div>
    </>
  )
}
