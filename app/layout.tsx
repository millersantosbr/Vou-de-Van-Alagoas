import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Outfit, Source_Sans_3 } from "next/font/google"
import { Providers } from "./providers"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Vou de Van - Alagoas",
  description: "Consulte os horários das vans em Alagoas",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${outfit.variable} ${sourceSans3.variable}`}>
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icon-512.png" type="image/png" sizes="512x512" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vou de Van" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={sourceSans3.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}



import './globals.css'