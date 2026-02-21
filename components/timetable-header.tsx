import Link from "next/link"
import { Menu, Clock, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DarkModeToggle } from "@/components/dark-mode-toggle"

export function TimetableHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2">
                <Clock className="h-6 w-6" />
                <span className="font-bold">CityTransit</span>
              </Link>
              <nav className="mt-6 flex flex-col space-y-4">
                <Link href="/routes" className="text-muted-foreground hover:text-foreground">
                  Routes
                </Link>
                <Link href="/stops" className="text-muted-foreground hover:text-foreground">
                  Stops
                </Link>
                <Link href="/maps" className="text-muted-foreground hover:text-foreground">
                  Maps
                </Link>
                <Link href="/alerts" className="text-muted-foreground hover:text-foreground">
                  Service Alerts
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2">
            <Clock className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CityTransit</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/routes" className="transition-colors hover:text-foreground/80 text-foreground">
            Routes
          </Link>
          <Link href="/stops" className="transition-colors hover:text-foreground/80 text-muted-foreground">
            Stops
          </Link>
          <Link href="/maps" className="transition-colors hover:text-foreground/80 text-muted-foreground">
            Maps
          </Link>
          <Link href="/alerts" className="transition-colors hover:text-foreground/80 text-muted-foreground">
            Service Alerts
          </Link>
        </nav>
        <div className="flex items-center space-x-2">
          <DarkModeToggle />
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

