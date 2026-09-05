"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { DownloadSimple, DeviceMobile, ShareNetwork, PlusSquare } from "@phosphor-icons/react"
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

    // 1. Identificar se o app já está instalado / rodando em modo standalone
    const checkIsStandalone = () => {
      if (typeof window === "undefined") return false
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

    // 2. Identificar estritamente se é iOS móvel (iPhone/iPad real)
    const ua = window.navigator.userAgent || ""
    const isAppleMobile = /iPhone|iPad|iPod/i.test(ua) && !("MSStream" in window)
    setIsIOS(isAppleMobile)

    // 3. Capturar o evento nativo 'beforeinstallprompt'
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    // 4. Capturar confirmação de instalação
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      localStorage.setItem("voudevan_pwa_installed", "true")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsInstalled(true)
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

  // Não exibir caso já esteja instalado ou antes de montar no cliente
  if (!hasMounted || isInstalled) {
    return null
  }

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
      } catch {
        setOpenInstructions(true)
      }
    } else {
      setOpenInstructions(true)
    }
  }

  const renderInstructionsContent = () => (
    <div className="space-y-3.5 py-2 px-1 text-left">
      {isIOS ? (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            No Safari do iPhone, siga estes passos:
          </p>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs">
              1
            </span>
            <span>
              Toque em <strong>Compartilhar</strong> (<ShareNetwork size={15} className="inline text-blue-600 dark:text-blue-400" />) na barra inferior.
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs">
              2
            </span>
            <span>
              Role e selecione <strong>&quot;Adicionar à Tela de Início&quot;</strong> (<PlusSquare size={15} className="inline text-slate-700 dark:text-slate-300" />).
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs">
              3
            </span>
            <span>
              Toque em <strong>Adicionar</strong> no topo direito. Pronto!
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Para instalar no seu navegador:
          </p>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs">
              1
            </span>
            <span>
              Clique no ícone de <strong>instalação</strong> na barra de endereço ou no menu de <strong>3 pontinhos</strong> do navegador.
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0038A8] dark:text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs">
              2
            </span>
            <span>
              Selecione <strong>&quot;Instalar Vou de Van&quot;</strong> ou <strong>&quot;Adicionar à tela inicial&quot;</strong>.
            </span>
          </div>
        </div>
      )}

      <div className="pt-1">
        <Button
          type="button"
          onClick={() => setOpenInstructions(false)}
          className="w-full h-10 rounded-xl bg-[#0038A8] hover:bg-[#002b80] text-white font-bold text-xs"
        >
          Entendido
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* 📱 Card Compacto e Minimalista */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between gap-3 text-left transition-all hover:border-[#0038A8]/30">
          {/* Ícone e Texto Curto */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 shrink-0 rounded-xl overflow-hidden shadow-xs border border-slate-100 dark:border-slate-800 bg-white">
              <Image
                src="/web-app-manifest-192x192.png"
                alt="App Vou de Van"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="min-w-0">
              <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
                Instalar aplicativo
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                Acesse horários em 1 toque
              </div>
            </div>
          </div>

          {/* Botão Minimalista Direto */}
          <Button
            type="button"
            onClick={handleInstallClick}
            className="h-9 px-3.5 shrink-0 bg-[#0038A8] hover:bg-[#002b80] active:bg-[#002060] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-1.5"
          >
            <DownloadSimple size={15} weight="bold" />
            <span>Instalar</span>
          </Button>
        </div>
      </div>

      {/* Modal / Drawer de Instruções */}
      {isMobile ? (
        <Drawer open={openInstructions} onOpenChange={setOpenInstructions}>
          <DrawerContent className="p-4 z-50">
            <DrawerHeader className="text-left px-0 pb-2">
              <DrawerTitle className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DeviceMobile size={18} className="text-[#0038A8] dark:text-blue-400" />
                Instalar na Tela Inicial
              </DrawerTitle>
              <DrawerDescription className="text-xs text-slate-500 dark:text-slate-400">
                Acesse horários e rotas direto da tela de início.
              </DrawerDescription>
            </DrawerHeader>
            {renderInstructionsContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={openInstructions} onOpenChange={setOpenInstructions}>
          <DialogContent className="sm:max-w-sm rounded-2xl z-50">
            <DialogHeader className="text-left">
              <DialogTitle className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <DeviceMobile size={18} className="text-[#0038A8] dark:text-blue-400" />
                Instalar no Navegador
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Acesse o app de van direto no seu computador.
              </DialogDescription>
            </DialogHeader>
            {renderInstructionsContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
