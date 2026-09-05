"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { DownloadSimple, DeviceMobile, ShareNetwork, PlusSquare, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/components/ui/use-mobile"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PwaInstallBanner() {
  const isMobile = useIsMobile()
  const [isInstalled, setIsInstalled] = useState<boolean>(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isIOS, setIsIOS] = useState<boolean>(false)
  const [openInstructions, setOpenInstructions] = useState<boolean>(false)
  const [hasMounted, setHasMounted] = useState<boolean>(false)

  useEffect(() => {
    setHasMounted(true)

    // 1. Identificar se o app já está rodando como PWA instalado (Standalone)
    const checkIsStandalone = () => {
      const isStandaloneMedia = window.matchMedia("(display-mode: standalone)").matches
      const isIOSStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true
      const isAndroidApp = document.referrer.includes("android-app://")
      const localFlag = localStorage.getItem("voudevan_pwa_installed") === "true"

      return isStandaloneMedia || isIOSStandalone || isAndroidApp || localFlag
    }

    if (checkIsStandalone()) {
      setIsInstalled(true)
      return
    }

    // 2. Identificar se é dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isAppleDevice)

    // 3. Capturar o evento nativo 'beforeinstallprompt' no Android/Chrome/Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // 4. Capturar confirmação de instalação pelo sistema
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      localStorage.setItem("voudevan_pwa_installed", "true")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    // Observar mudanças no display-mode dinamicamente
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsInstalled(true)
      }
    }
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaChange)
      }
    }
  }, [])

  // Não renderizar no servidor ou se o usuário já instalou o app na tela inicial
  if (!hasMounted || isInstalled) {
    return null
  }

  // Ação ao clicar no botão de instalação
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === "accepted") {
          setIsInstalled(true)
          localStorage.setItem("voudevan_pwa_installed", "true")
        }
        setDeferredPrompt(null)
      } catch (err) {
        console.warn("Erro ao acionar prompt de instalação:", err)
        setOpenInstructions(true)
      }
    } else {
      // Se não há prompt nativo disponível (iOS Safari ou Desktop sem prompt direto), abre instruções guiadas
      setOpenInstructions(true)
    }
  }

  // Conteúdo explicativo para iOS e outros navegadores
  const renderInstructionsContent = () => (
    <div className="space-y-4 py-2 px-1 text-left">
      {isIOS ? (
        <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            No iPhone ou iPad, siga estes 3 passos rápidos:
          </p>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div className="text-xs sm:text-sm">
              Toque no botão de <strong>Compartilhar</strong> na barra inferior do Safari (ícone de quadrado com seta para cima <ShareNetwork size={16} className="inline text-blue-600 dark:text-blue-400" />).
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div className="text-xs sm:text-sm">
              Role a lista para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong> (<PlusSquare size={16} className="inline text-slate-700 dark:text-slate-300" />).
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold">
              3
            </div>
            <div className="text-xs sm:text-sm">
              No canto superior direito, toque em <strong>&quot;Adicionar&quot;</strong>. Pronto! O ícone ficará salvo no seu iPhone.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Como instalar no seu navegador:
          </p>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold">
              1
            </div>
            <div className="text-xs sm:text-sm">
              Toque no menu do navegador (os <strong>3 pontinhos</strong> no canto superior direito).
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold">
              2
            </div>
            <div className="text-xs sm:text-sm">
              Selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button
          type="button"
          onClick={() => setOpenInstructions(false)}
          className="w-full h-11 rounded-xl bg-[#0038A8] hover:bg-[#002b80] text-white font-bold text-sm"
        >
          Entendido
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* 📱 Card Principal "BAIXE AGORA O APP" */}
      <section
        aria-label="Instalação do Aplicativo Vou de Van"
        className="w-full max-w-xl mx-auto mb-6 p-5 sm:p-6 rounded-2xl md:rounded-3xl bg-gradient-to-b from-blue-50/80 to-white dark:from-slate-800/80 dark:to-slate-900/90 border-2 border-[#0038A8]/20 dark:border-blue-500/20 shadow-md text-left transition-all hover:border-[#0038A8]/40"
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Ícone oficial do app */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 rounded-2xl overflow-hidden shadow-md border border-white/60 dark:border-slate-700 bg-white">
            <Image
              src="/web-app-manifest-192x192.png"
              alt="Ícone do App Vou de Van"
              width={72}
              height={72}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Textos informativos */}
          <div className="grow text-center sm:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D62828] text-white text-[11px] font-black uppercase tracking-wider shadow-xs mb-1">
              <DeviceMobile size={13} weight="fill" />
              <span>BAIXE AGORA O APP</span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 leading-snug">
              Instale o Vou de Van no seu celular
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Acesse os horários em 1 toque direto da tela inicial. É 100% gratuito, abre instantâneo e não gasta a memória do aparelho.
            </p>

            {/* Vantagens com ícones */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 pt-1 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                Acesso offline
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                Sem ocupar espaço
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                100% gratuito
              </span>
            </div>
          </div>
        </div>

        {/* Botão de Ação Direta */}
        <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            onClick={handleInstallClick}
            className="w-full h-12 bg-[#0038A8] hover:bg-[#002b80] active:bg-[#002060] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md shadow-[#0038A8]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <DownloadSimple size={20} weight="bold" />
            <span>{isIOS ? "Como Baixar no iPhone" : "Instalar Aplicativo Grátis"}</span>
          </Button>
        </div>
      </section>

      {/* Modal / Drawer com Instruções Detalhadas (especialmente para iOS Safari) */}
      {isMobile ? (
        <Drawer open={openInstructions} onOpenChange={setOpenInstructions}>
          <DrawerContent className="p-4 z-50">
            <DrawerHeader className="text-left px-0 pb-2">
              <DrawerTitle className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DeviceMobile size={20} className="text-[#0038A8] dark:text-blue-400" />
                Instalar Vou de Van na Tela Inicial
              </DrawerTitle>
              <DrawerDescription className="text-xs text-slate-500 dark:text-slate-400">
                Acesse todos os horários e itinerários das vans em 1 toque.
              </DrawerDescription>
            </DrawerHeader>
            {renderInstructionsContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={openInstructions} onOpenChange={setOpenInstructions}>
          <DialogContent className="sm:max-w-md rounded-2xl z-50">
            <DialogHeader className="text-left">
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DeviceMobile size={22} className="text-[#0038A8] dark:text-blue-400" />
                Instalar Vou de Van na Tela Inicial
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Acesse todos os horários e itinerários das vans rapidamente.
              </DialogDescription>
            </DialogHeader>
            {renderInstructionsContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
