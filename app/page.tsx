"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useEffect } from "react"
import "leaflet/dist/leaflet.css"
import { InfoArsal } from "@/components/info-arsal"
import { BottomNav } from "@/components/bottom-nav"
import { Footer } from "@/components/footer"
import { AnimatedWaves } from "@/components/animated-waves"
import { HeroSubtitle } from "@/components/hero-subtitle"

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
  // Purge any legacy Service Workers & old CacheStorage to guarantee users always see the latest version
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister()
          }
        })
      }
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key)
          }
        })
      }
    }
  }, [])

  return (
    <main className="min-h-screen relative pb-28 md:pb-16 overflow-x-hidden bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 🌊 Hero Section com Identidade Oficial de Alagoas */}
      <section className="bg-gradient-to-b from-[#001438] via-[#0038A8] to-[#002b80] dark:from-[#030914] dark:via-[#051636] dark:to-[#081f4d] text-white pt-2 sm:pt-4 overflow-hidden relative">
        
        {/* Top Floating Dark Mode Toggle */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 flex items-center gap-2">
          <DynamicDarkModeToggle />
        </div>

        {/* Hero Central Content: Logo em Destaque & Textos (Mantidos conforme solicitado) */}
        <div className="container mx-auto px-4 sm:px-6 pt-3 sm:pt-6 pb-2 sm:pb-4 text-center flex flex-col items-center space-y-4 relative z-20">
          
          {/* Logo Centralizada e com Maior Destaque */}
          <div className="relative w-[260px] h-[140px] sm:w-[340px] sm:h-[185px] md:w-[420px] md:h-[230px] flex items-center justify-center transition-transform hover:scale-[1.02] duration-300">
            <Image
              src="/logonome.webp"
              alt="Vou de Van - Alagoas"
              fill
              className="object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.45)]"
              priority
            />
          </div>

          <div className="space-y-2.5 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] text-balance">
              Qual é o seu destino?{" "}
              <span className="text-white drop-shadow-[0_2px_12px_rgba(0,56,168,0.5)] block sm:inline relative">
                Horários de vans em Alagoas
                <span className="hidden sm:block absolute -bottom-1 left-0 right-0 h-1 bg-[#D62828] rounded-full" />
              </span>
            </h1>

            {/* Dynamic Minimalist Status Pill Tagline */}
            <HeroSubtitle />
          </div>
        </div>

        {/* Animated Multi-Layered Waves com Maior Volume e Elevação */}
        <div className="-mt-4 sm:-mt-8 md:-mt-12 relative z-10">
          <AnimatedWaves />
        </div>

        {/* 🌟 Gradiente de Fusão na Base Estrita (Mantido Baixo para Não Cobrir as Ondas) */}
        <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-10 bg-gradient-to-b from-transparent to-slate-50/80 dark:to-slate-950/80 pointer-events-none z-15" />
      </section>

      {/* Main Content Area - Overlapping seamlessly with Waves and Ambient Light */}
      <div className="container mx-auto px-3.5 sm:px-6 -mt-12 sm:-mt-18 md:-mt-22 pb-16 relative z-20">
        <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto space-y-12 sm:space-y-16">

          {/* Main Search Section (Quadro de Horários) */}
          <section id="quadro-horarios" className="scroll-mt-20 relative">
            {/* 🌟 Ambient Backlight Glow Behind Search Card - Deslocado para baixo e esticado nas laterais */}
            <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-[98%] max-w-4xl lg:max-w-6xl xl:max-w-7xl h-44 bg-gradient-to-b from-blue-200/20 via-white/90 to-transparent dark:from-blue-600/10 dark:via-slate-950/90 blur-2xl rounded-full pointer-events-none -z-10 translate-y-8" />
            <DynamicHomeContent />
          </section>

          {/* Map Section (Explorar Região) */}
          <section id="explorar-regiao" className="space-y-4 scroll-mt-20 px-2 sm:px-0">
            <div className="flex flex-col items-center space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-xs font-semibold text-[#0038A8] dark:text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0038A8] dark:bg-blue-400" />
                <span>Pontos Autorizados</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Terminais e Pontos de Embarque
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
                Localize no mapa os terminais rodoviários e postos de apoio em Alagoas.
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





