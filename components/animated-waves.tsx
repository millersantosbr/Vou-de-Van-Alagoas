"use client"

import type React from "react"

export function AnimatedWaves() {
  return (
    <div className="relative w-full h-28 sm:h-36 md:h-44 lg:h-52 overflow-hidden leading-none z-10 pointer-events-none select-none -mb-[1px]">
      {/* Camada 1: Vermelho Carmim da Bandeira de Alagoas (Crista Alta) */}
      <div className="absolute inset-0 flex w-[200%] wave-track-1">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,48 C 150,8 450,88 600,48 C 750,8 1050,88 1200,48 L 1200,120 L 0,120 Z"
            fill="#D62828"
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
            d="M 0,48 C 150,8 450,88 600,48 C 750,8 1050,88 1200,48 L 1200,120 L 0,120 Z"
            fill="#D62828"
            className="opacity-80"
          />
        </svg>
      </div>

      {/* Camada 2: Branco Puro da Bandeira de Alagoas (Espuma do Mar em Relevo) */}
      <div className="absolute inset-0 flex w-[200%] wave-track-2">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,56 C 150,94 450,18 600,56 C 750,94 1050,18 1200,56 L 1200,120 L 0,120 Z"
            fill="#FFFFFF"
            className="opacity-65 dark:opacity-20"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,56 C 150,94 450,18 600,56 C 750,94 1050,18 1200,56 L 1200,120 L 0,120 Z"
            fill="#FFFFFF"
            className="opacity-65 dark:opacity-20"
          />
        </svg>
      </div>

      {/* Camada 3: Azul Royal Vibrante de Alagoas (Grande Volume) */}
      <div className="absolute inset-0 flex w-[200%] wave-track-3">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,66 C 180,24 420,108 600,66 C 780,24 1020,108 1200,66 L 1200,120 L 0,120 Z"
            fill="#0038A8"
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
            d="M 0,66 C 180,24 420,108 600,66 C 780,24 1020,108 1200,66 L 1200,120 L 0,120 Z"
            fill="#0038A8"
            className="opacity-85"
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
            d="M 0,76 C 200,112 400,40 600,76 C 800,112 1000,40 1200,76 L 1200,120 L 0,120 Z"
            fill="#001F5C"
            className="opacity-90"
          />
        </svg>
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,76 C 200,112 400,40 600,76 C 800,112 1000,40 1200,76 L 1200,120 L 0,120 Z"
            fill="#001F5C"
            className="opacity-90"
          />
        </svg>
      </div>

      {/* Camada 5 (Fusão Fluida Base): Cor de Fundo da Página (Slate 50 / Slate 950) */}
      <div className="absolute inset-0 flex w-[200%] wave-track-5">
        <svg
          className="w-1/2 h-full flex-shrink-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <path
            d="M 0,86 C 220,62 380,110 600,86 C 820,62 980,110 1200,86 L 1200,120 L 0,120 Z"
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
            d="M 0,86 C 220,62 380,110 600,86 C 820,62 980,110 1200,86 L 1200,120 L 0,120 Z"
            className="fill-slate-50 dark:fill-slate-950 transition-colors"
          />
        </svg>
      </div>

      {/* 🌟 Gradiente de Fusão na Borda Inferior Estrita (Sem Cobrir as Cristas das Ondas) */}
      <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-b from-transparent to-slate-50/90 dark:to-slate-950/90 pointer-events-none z-20" />
    </div>
  )
}


