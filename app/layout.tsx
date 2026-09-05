import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Outfit, Inter, JetBrains_Mono } from "next/font/google"
import { Providers } from "./providers"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vou de Van - Alagoas | Horários Oficiais das Vans Intermunicipais",
  description: "Consulte horários, rotas, vias e paradas das vans intermunicipais em todo o estado de Alagoas (Dados Oficiais ARSAL).",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/logoicon.webp", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logoicon.webp", sizes: "180x180", type: "image/webp" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" href="/logoicon.webp" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vou de Van" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}