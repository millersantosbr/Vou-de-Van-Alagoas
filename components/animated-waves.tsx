"use client"

import type React from "react"

export function AnimatedWaves() {
  return (
    <div className="relative w-full h-20 sm:h-28 md:h-32 overflow-hidden leading-none z-10 pointer-events-none select-none -mb-[1px]">
      {/* Camada 1: Vermelho Carmim da Bandeira de Alagoas */}
      <div className="absolute inset-0 flex w-[200%] wave-track-1">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,50 C 150,15 450,85 600,50 C 750,15 1050,85 1200,50 L 1200,120 L 0,120 Z"
            fill="#D62828"
            className="opacity-75"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,50 C 150,15 450,85 600,50 C 750,15 1050,85 1200,50 L 1200,120 L 0,120 Z"
            fill="#D62828"
            className="opacity-75"
          />
        </svg>
      </div>

      {/* Camada 2: Branco Puro da Bandeira de Alagoas (Espuma do Mar) */}
      <div className="absolute inset-0 flex w-[200%] wave-track-2">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,58 C 200,88 400,28 600,58 C 800,88 1000,28 1200,58 L 1200,120 L 0,120 Z"
            fill="#FFFFFF"
            className="opacity-60 dark:opacity-20"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,58 C 200,88 400,28 600,58 C 800,88 1000,28 1200,58 L 1200,120 L 0,120 Z"
            fill="#FFFFFF"
            className="opacity-60 dark:opacity-20"
          />
        </svg>
      </div>

      {/* Camada 3: Azul Royal Vibrante de Alagoas */}
      <div className="absolute inset-0 flex w-[200%] wave-track-3">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,68 C 180,35 420,100 600,68 C 780,35 1020,100 1200,68 L 1200,120 L 0,120 Z"
            fill="#0038A8"
            className="opacity-80"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,68 C 180,35 420,100 600,68 C 780,35 1020,100 1200,68 L 1200,120 L 0,120 Z"
            fill="#0038A8"
            className="opacity-80"
          />
        </svg>
      </div>

      {/* Camada 4: Azul Mar Profundo Alagoano */}
      <div className="absolute inset-0 flex w-[200%] wave-track-4">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,78 C 220,105 380,50 600,78 C 820,105 980,50 1200,78 L 1200,120 L 0,120 Z"
            fill="#001F5C"
            className="opacity-85"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,78 C 220,105 380,50 600,78 C 820,105 980,50 1200,78 L 1200,120 L 0,120 Z"
            fill="#001F5C"
            className="opacity-85"
          />
        </svg>
      </div>

      {/* Camada 5 (Fusão Fluida): Cor de Fundo da Página (Slate 50 / Slate 950) */}
      <div className="absolute inset-0 flex w-[200%] wave-track-5">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,88 C 250,70 350,106 600,88 C 850,70 950,106 1200,88 L 1200,120 L 0,120 Z"
            className="fill-slate-50 dark:fill-slate-950 transition-colors"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,88 C 250,70 350,106 600,88 C 850,70 950,106 1200,88 L 1200,120 L 0,120 Z"
            className="fill-slate-50 dark:fill-slate-950 transition-colors"
          />
        </svg>
      </div>

      {/* 🌟 Efeito Gradiente de Luz Suave (Fusão Integrada com o Conteúdo Abaixo) */}
      <div className="absolute inset-x-0 bottom-0 h-14 sm:h-20 bg-gradient-to-b from-transparent via-slate-50/70 to-slate-50 dark:via-slate-950/70 dark:to-slate-950 pointer-events-none z-20" />
    </div>
  )
}

