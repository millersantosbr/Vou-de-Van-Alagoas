"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useEffect } from "react"
import "leaflet/dist/leaflet.css"
import { InfoArsal } from "@/components/info-arsal"
import { BottomNav } from "@/components/bottom-nav"

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
    <main className="min-h-screen mesh-gradient relative pb-28 overflow-x-hidden">
      {/* Decorative Blur - Mobile Optimized */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-primary/10 blur-[100px] rounded-full -z-10 opacity-70" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 glass border-b border-border/10">
        <div className="container mx-auto px-5 py-4 md:py-6 flex items-center justify-between relative">
          <div className="relative w-44 h-12 md:w-60 md:h-16 transition-all hover:scale-105 group flex items-center">
            <Image
              src="/logo_cabeçalho.png"
              alt="Vou de Van - Alagoas"
              fill
              className="object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_0_20px_rgba(0,86,210,0.3)]"
              priority
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-700 dark:text-green-400">
                ARSAL Oficial
              </span>
            </div>
            <DynamicDarkModeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-8 md:pt-16 pb-12">
        <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">

          {/* Hero Section */}
          <header className="text-center space-y-6 pt-2 md:pt-0 animate-in fade-in slide-in-from-top-6 duration-700">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-1">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Transporte Complementar de Alagoas
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.08] text-balance">
                Sua viagem em Alagoas <br className="hidden sm:inline" />
                começa aqui.
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed px-4 opacity-80">
                Consulte horários, rotas, paradas e itinerários oficiais das vans intermunicipais com facilidade na palma da mão.
              </p>
            </div>
          </header>

          {/* Main Search Section (Quadro de Horários) */}
          <section id="quadro-horarios" className="relative group px-0.5 scroll-mt-20">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-blue-500/15 to-emerald-500/15 rounded-[3rem] blur-3xl opacity-60 group-hover:opacity-100 transition duration-700" />
            <Card className="relative glass border-border/60 overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] rounded-[2.5rem]">
              <CardHeader className="bg-primary/5 py-8 md:py-12 border-b border-border/10 text-center">
                <CardTitle className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
                  Quadro de Horários
                </CardTitle>
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Selecione origem e destino para ver as próximas saídas
                </p>
              </CardHeader>

              <CardContent className="p-5 md:p-10">
                <DynamicHomeContent />
              </CardContent>

              <CardFooter className="bg-muted/10 py-6 px-6 border-t border-border/10">
                <div className="flex items-center justify-center space-x-2 w-full text-[10px] md:text-xs text-center text-muted-foreground font-bold uppercase tracking-[0.15em]">
                  <span className="text-primary text-base">📍</span>
                  <p>Dados oficiais integrados da ARSAL (182 Linhas em todo o estado)</p>
                </div>
              </CardFooter>
            </Card>
          </section>

          {/* Map Section (Explorar Região) */}
          <section id="explorar-regiao" className="space-y-8 pt-4 px-0.5 scroll-mt-20">
            <div className="flex flex-col items-center space-y-3 text-center">
              <div className="h-1.5 w-14 bg-primary rounded-full shadow-md shadow-primary/30" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Explorar Pontos & Terminais</h2>
              <p className="text-sm md:text-base text-muted-foreground opacity-80 max-w-md">
                Localize no mapa os terminais rodoviários e pontos autorizados mais próximos de você.
              </p>
            </div>
            <DynamicNearbyStopsMap />
          </section>

          {/* Institutional Info & Passenger Rights (Info ARSAL) */}
          <InfoArsal />

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 md:mt-24 container mx-auto px-6 text-center border-t border-border/10 pt-16 pb-20 opacity-80">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-36 h-10 md:w-48 md:h-12 transition-transform hover:scale-105 duration-300">
            <Image
              src="/logo_cabeçalho.png"
              alt="Vou de Van Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-foreground font-black uppercase tracking-[0.3em] opacity-90">
              © {new Date().getFullYear()} Vou de Van - Alagoas
            </p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
              Desenvolvido com excelência em Maceió, AL
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Floating Bottom Navigation */}
      <BottomNav />
    </main>
  )
}
