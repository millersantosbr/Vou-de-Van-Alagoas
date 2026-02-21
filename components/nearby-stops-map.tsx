"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from "lucide-react"
import dynamic from "next/dynamic"
import { CityList } from "./city-list"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"], weight: ["600"] })

const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

interface NearbyStop {
  id: string
  name: string
  lat: number
  lng: number
  cities?: string[]
}

export function NearbyStopsMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [nearbyStops, setNearbyStops] = useState<NearbyStop[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStop, setSelectedStop] = useState<NearbyStop | null>(null)

  // List of all cities in Alagoas
  const allCities = [
    "Água Branca",
    "Anadia",
    "Arapiraca",
    "Atalaia",
    "Barra de Santo Antônio",
    "Barra de São Miguel",
    "Batalha",
    "Belém",
    "Belo Monte",
    "Boca da Mata",
    "Branquinha",
    "Cacimbinhas",
    "Cajueiro",
    "Campestre",
    "Campo Alegre",
    "Campo Grande",
    "Canapi",
    "Capela",
    "Carneiros",
    "Chã Preta",
    "Coité do Nóia",
    "Colônia Leopoldina",
    "Coqueiro Seco",
    "Coruripe",
    "Craíbas",
    "Delmiro Gouveia",
    "Dois Riachos",
    "Estrela de Alagoas",
    "Feira Grande",
    "Feliz Deserto",
    "Flexeiras",
    "Girau do Ponciano",
    "Ibateguara",
    "Igaci",
    "Igreja Nova",
    "Inhapi",
    "Jacaré dos Homens",
    "Jacuípe",
    "Japaratinga",
    "Jaramataia",
    "Jequiá da Praia",
    "Joaquim Gomes",
    "Jundiá",
    "Junqueiro",
    "Lagoa da Canoa",
    "Limoeiro de Anadia",
    "Maceió",
    "Major Isidoro",
    "Mar Vermelho",
    "Maragogi",
    "Maravilha",
    "Marechal Deodoro",
    "Maribondo",
    "Mata Grande",
    "Matriz de Camaragibe",
    "Messias",
    "Minador do Negrão",
    "Monteirópolis",
    "Murici",
    "Novo Lino",
    "Olho d'Água das Flores",
    "Olho d'Água do Casado",
    "Olho d'Água Grande",
    "Olivença",
    "Ouro Branco",
    "Palestina",
    "Palmeira dos Índios",
    "Pão de Açúcar",
    "Pariconha",
    "Paripueira",
    "Passo de Camaragibe",
    "Paulo Jacinto",
    "Penedo",
    "Piaçabuçu",
    "Pilar",
    "Pindoba",
    "Piranhas",
    "Poço das Trincheiras",
    "Porto Calvo",
    "Porto de Pedras",
    "Porto Real do Colégio",
    "Quebrangulo",
    "Rio Largo",
    "Roteiro",
    "Santa Luzia do Norte",
    "Santana do Ipanema",
    "Santana do Mundaú",
    "São Brás",
    "São José da Laje",
    "São José da Tapera",
    "São Luís do Quitunde",
    "São Miguel dos Campos",
    "São Miguel dos Milagres",
    "São Sebastião",
    "Satuba",
  ]

  const getUserLocation = () => {
    setIsLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude])
        setIsLoading(false)
      },
      (error) => {
        setError("Não foi possível obter sua localização. Por favor, verifique suas configurações de privacidade.")
        setIsLoading(false)
      },
    )
  }

  const handleMarkerClick = (stop: NearbyStop) => {
    setSelectedStop(stop)
  }

  useEffect(() => {
    if (userLocation) {
      // Define specific cities for each stop
      const stops: NearbyStop[] = [
        {
          id: "1",
          name: "Ponto 1",
          lat: -9.564955096933463,
          lng: -35.78337817632785,
          cities: ["Maceió", "Arapiraca", "Palmeira dos Índios", "São Miguel dos Campos"],
        },
        {
          id: "2",
          name: "Ponto 2",
          lat: -9.558503952679253,
          lng: -35.74713451865553,
          cities: ["Maceió", "Penedo", "Marechal Deodoro", "Rio Largo"],
        },
        {
          id: "3",
          name: "Terminal Rodoviário",
          lat: -9.645624511262968,
          lng: -35.72649554680165,
          cities: [
            "Maceió",
            "Arapiraca",
            "Palmeira dos Índios",
            "Penedo",
            "União dos Palmares",
            "São Luís do Quitunde",
            "São Miguel dos Campos",
            "Delmiro Gouveia",
            "Marechal Deodoro",
            "Rio Largo",
            "Atalaia",
            "Pilar",
            "Coruripe",
            "Murici",
            "Santana do Ipanema",
            "Boca da Mata",
            "Junqueiro",
            "Teotônio Vilela",
            "Girau do Ponciano",
            "Matriz de Camaragibe",
          ],
        },
        {
          id: "4",
          name: "Ponto 4",
          lat: -9.627757466369285,
          lng: -35.69794031810816,
          cities: ["Maceió", "União dos Palmares", "São Luís do Quitunde"],
        },
      ]
      setNearbyStops(stops)
    }
  }, [userLocation])

  return (
    <div className="space-y-6">
      <Card className="glass overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
        <CardHeader className="bg-primary/5 py-10 px-6 border-b border-border/10">
          <CardTitle className="text-xl md:text-3xl font-black flex items-center justify-center gap-3 tracking-tighter text-balance">
            Encontrar Van Próxima 📍
          </CardTitle>
          <p className="text-center text-muted-foreground text-xs md:text-sm font-bold uppercase tracking-widest mt-2 max-w-[240px] mx-auto opacity-70">
            Veja os pontos de parada em tempo real no mapa
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {!userLocation ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 px-6">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110" />
                <div className="relative w-24 h-24 rounded-full bg-background flex items-center justify-center text-primary shadow-xl border border-primary/10">
                  <MapPin size={40} strokeWidth={2.5} className="animate-bounce" />
                </div>
              </div>
              <Button
                onClick={getUserLocation}
                disabled={isLoading}
                className="w-full sm:w-auto h-16 px-10 text-base font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Buscando Você...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-3 h-5 w-5" />
                    Ativar Localização
                  </>
                )}
              </Button>
              {error && (
                <div className="mt-8 bg-destructive/10 border border-destructive/20 px-6 py-4 rounded-2xl">
                  <p className="text-destructive text-xs font-bold text-center leading-relaxed italic">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in duration-700">
              <div className="h-[400px] md:h-[500px] w-full rounded-[1.5rem] overflow-hidden border border-border/50 shadow-inner">
                <MapComponent userLocation={userLocation} nearbyStops={nearbyStops} onMarkerClick={handleMarkerClick} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedStop && selectedStop.cities && selectedStop.cities.length > 0 && (
        <CityList cities={selectedStop.cities} />
      )}
    </div>
  )
}

