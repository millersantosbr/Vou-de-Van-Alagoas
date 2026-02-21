import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface CityListProps {
  cities: string[]
  pointName?: string
}

export function CityList({ cities }: CityListProps) {
  return (
    <Card className="w-full glass border-none shadow-xl rounded-[2rem] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader className="flex flex-col items-center pb-2 pt-8">
        <div className="bg-primary/10 p-3 rounded-full mb-4">
          <MapPin size={24} className="text-primary" />
        </div>
        <CardTitle className="font-black text-xl md:text-2xl text-center tracking-tight px-4">
          Destinos disponíveis <br className="md:hidden" /> neste ponto:
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 md:p-10">
        <div className="flex flex-wrap justify-center gap-2">
          {cities.sort().map((city, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="py-2.5 px-5 rounded-full text-xs md:text-sm font-bold bg-muted/50 border-border/50 hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
            >
              {city}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
