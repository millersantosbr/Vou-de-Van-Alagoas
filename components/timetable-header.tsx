import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Home, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function TimetableHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 text-primary" />
              <span>Voltar ao Início</span>
            </Link>
          </Button>
        </div>

        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-40 h-11">
            <Image
              src="/logonome.webp"
              alt="Vou de Van Logo"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <div className="flex items-center space-x-2">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  )
}
