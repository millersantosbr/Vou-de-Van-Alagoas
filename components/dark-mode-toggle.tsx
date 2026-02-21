"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function DarkModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  // Only show the component after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9"></div> // Placeholder to prevent layout shift
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    setShowLabel(true)
    setTimeout(() => setShowLabel(false), 2000) // Hide label after 2 seconds
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={`Alternar para modo ${resolvedTheme === "dark" ? "claro" : "escuro"}`}
        className="relative z-10"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-slate-700" />
        )}
      </Button>
      <div
        className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm whitespace-nowrap transition-opacity duration-300 ${
          showLabel ? "opacity-100" : "opacity-0"
        }`}
      >
        {resolvedTheme === "dark" ? "Modo Escuro" : "Modo Claro"}
      </div>
    </div>
  )
}

