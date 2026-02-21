"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], weight: ["600"] })

const DynamicHomeContent = dynamic(() => import("@/components/home-content"), { ssr: false })
const DynamicDarkModeToggle = dynamic(() => import("@/components/dark-mode-toggle").then((mod) => mod.DarkModeToggle), {
  ssr: false,
})
const DynamicNearbyStopsMap = dynamic(() => import("@/components/nearby-stops-map").then((mod) => mod.NearbyStopsMap), {
  ssr: false,
})

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
          },
        )
      })
    }
  }, [])

  return (
    <main className="min-h-screen mesh-gradient relative pb-12 overflow-x-hidden">
      {/* Decorative Blur - Mobile Optimized */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-primary/10 blur-[100px] rounded-full -z-10 opacity-70" />

      <nav className="sticky top-0 z-50 glass border-b border-border/5">
        <div className="container mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative w-32 h-10 md:w-48 md:h-16 transition-transform hover:scale-105 duration-300">
              <Image
                src="/logo_cabeçalho.png"
                alt="Vou de Van Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <DynamicDarkModeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-12 md:pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-16 md:space-y-32">

          {/* Hero Section - Mobile First Typography */}
          <header className="text-center space-y-8 pt-4 md:pt-0 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Operando em Alagoas</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.05] text-balance">
                Sua viagem <br className="md:hidden" />
                começa aqui.
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed px-6 opacity-80">
                Consulte horários e pontos de van em tempo real em todo o estado com precisão.
              </p>
            </div>
          </header>

          {/* Main Search - Simplified for Mobile */}
          <section className="relative group px-1">
            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <Card className="relative glass border-none overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem]">
              <CardHeader className="bg-primary/5 py-10 md:py-16 border-b border-border/5">
                <CardTitle className="text-2xl md:text-5xl text-center font-black text-foreground tracking-tighter">
                  Quadro de Horários
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-14">
                <DynamicHomeContent />
              </CardContent>
              <CardFooter className="bg-muted/5 py-8 px-8 border-t border-border/5">
                <div className="flex items-center justify-center space-x-3 w-full text-[11px] md:text-xs text-center text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  <span className="text-primary text-lg">📍</span>
                  <p>Dados atualizados dos terminais rodoviários oficiais</p>
                </div>
              </CardFooter>
            </Card>
          </section>

          {/* Map Section - More spacing */}
          <section className="space-y-12 pt-8 px-1">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="h-1.5 w-16 bg-primary rounded-full shadow-lg shadow-primary/40" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Explorar Região</h2>
              <p className="text-sm md:text-lg text-muted-foreground opacity-70">Localize os pontos de embarque mais próximos</p>
            </div>
            <DynamicNearbyStopsMap />
          </section>

        </div>
      </div>

      <footer className="mt-24 md:mt-48 container mx-auto px-6 text-center border-t border-border/5 pt-20 pb-16 opacity-80">
        <div className="flex flex-col items-center space-y-8">
          <div className="relative w-40 h-12 md:w-56 md:h-16 transition-transform hover:scale-110 duration-500">
            <Image
              src="/logo_cabeçalho.png"
              alt="Vou de Van Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-3">
            <p className="text-xs md:text-sm text-foreground font-black uppercase tracking-[0.4em] opacity-90">
              © {new Date().getFullYear()} millersantosbr
            </p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
              Desenvolvido com excelência em Maceió, AL
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
