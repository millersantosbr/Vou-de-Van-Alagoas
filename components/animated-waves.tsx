"use client"

import type React from "react"

export function AnimatedWaves() {
  return (
    <div className="relative w-full overflow-hidden leading-none z-10 pointer-events-none select-none -mb-[1px]">
      <svg
        className="w-full h-16 sm:h-24 md:h-28 min-w-[720px] block"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="alagoas-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g>
          {/* Camada 1: Vermelho Carmim da Bandeira de Alagoas */}
          <use
            xlinkHref="#alagoas-wave"
            x="48"
            y="0"
            fill="#D62828"
            className="wave-layer-1 opacity-70"
          />
          {/* Camada 2: Branco Puro da Bandeira de Alagoas */}
          <use
            xlinkHref="#alagoas-wave"
            x="48"
            y="2"
            fill="#FFFFFF"
            className="wave-layer-2 opacity-65 dark:opacity-20"
          />
          {/* Camada 3: Azul Royal de Alagoas */}
          <use
            xlinkHref="#alagoas-wave"
            x="48"
            y="4"
            fill="#0038A8"
            className="wave-layer-3 opacity-80"
          />
          {/* Camada 4: Azul Mar Profundo Alagoano */}
          <use
            xlinkHref="#alagoas-wave"
            x="48"
            y="5.5"
            fill="#002060"
            className="wave-layer-4 opacity-85"
          />
          {/* Camada 5 (Fusão Fluida): Cor de Fundo do App (Slate 50 / Slate 950) */}
          <use
            xlinkHref="#alagoas-wave"
            x="48"
            y="7"
            className="fill-slate-50/50 dark:fill-slate-950 transition-colors"
          />
        </g>
      </svg>
    </div>
  )
}
