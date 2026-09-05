"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useEffect } from "react"
import "leaflet/dist/leaflet.css"
import { InfoArsal } from "@/components/info-arsal"
import { BottomNav } from "@/components/bottom-nav"
import { Footer } from "@/components/footer"
import { AnimatedWaves } from "@/components/animated-waves"

const DynamicHomeContent = dynamic(() => import("@/components/home-content"), { ssr: false })
const DynamicDarkModeToggle = dynamic(
  () => import("@/components/dark-mode-toggle").then((mod) => mod.DarkModeToggle),
  { ssr: false }
)
const DynamicNearbyStopsMap = dynamic(
  () => import("@/components/nearby-stops-map").then((mod) => mod.NearbyStopsMap),
  { ssr: false }
)

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (registration) => {
            console.log("ServiceWorker registration successful with scope: ", registration.scope)
          },
          (err) => {
            console.log("ServiceWorker registration failed: ", err)
          }
        )
      })
    }
  }, [])

  return (
    <main className="min-h-screen relative pb-28 overflow-x-hidden bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 🌊 Hero Section com Identidade Oficial de Alagoas */}
      <section className="bg-gradient-to-b from-[#001438] via-[#0038A8] to-[#002b80] dark:from-[#030914] dark:via-[#051636] dark:to-[#081f4d] text-white pt-3 sm:pt-4 overflow-hidden relative">
        
        {/* Top Navbar inside Hero */}
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center sm:justify-between relative z-20">
          <div className="relative w-60 h-15 sm:w-72 sm:h-18 md:w-80 md:h-20 flex items-center">
            <Image
              src="/logonome.webp"
              alt="Vou de Van - Alagoas"
              fill
              className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
              priority
            />
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 flex items-center gap-2">
            <DynamicDarkModeToggle />
          </div>
        </div>

        {/* Hero Copy & Status Badge */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4 text-center space-y-3 relative z-20">
          
          {/* ARSAL Official Trust Badge com ponto pulsante vermelho */}
          <div className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D62828] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D62828]" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-white/95">
              Transporte Regularizado ARSAL • 100% Atualizado
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] text-balance">
            Horários de Vans em Alagoas{" "}
            <span className="text-white drop-shadow-[0_2px_12px_rgba(0,56,168,0.5)] block sm:inline relative">
              em um só lugar
              <span className="hidden sm:block absolute -bottom-1 left-0 right-0 h-1 bg-[#D62828] rounded-full" />
            </span>
          </h1>

          <p className="text-xs sm:text-base text-slate-100/90 max-w-lg mx-auto leading-relaxed px-2 font-medium">
            Consulta rápida, gratuita e fácil para quem anda de transporte complementar todos os dias.
          </p>
        </div>

        {/* Animated Multi-Layered Waves */}
        <AnimatedWaves />
      </section>

      {/* Main Content Area - Overlapping seamlessly with Waves */}
      <div className="container mx-auto px-3.5 sm:px-6 -mt-8 sm:-mt-14 pb-12 relative z-20">
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">

          {/* Main Search Section (Quadro de Horários) */}
          <section id="quadro-horarios" className="scroll-mt-20">
            <DynamicHomeContent />
          </section>

          {/* Map Section (Explorar Região) */}
          <section id="explorar-regiao" className="space-y-4 scroll-mt-20">
            <div className="flex flex-col items-center space-y-1 text-center">
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Terminais e Pontos de Embarque
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">
                Localize no mapa os pontos autorizados em todo o estado.
              </p>
            </div>
            <DynamicNearbyStopsMap />
          </section>

          {/* Institutional Info & Passenger Rights (Info ARSAL) */}
          <InfoArsal />

        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Bottom Navigation */}
      <BottomNav />
    </main>
  )
}





