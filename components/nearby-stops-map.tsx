"use client"

import { useState, useMemo } from "react"
import {
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  Compass,
  Buildings,
  Bus,
  ShieldCheck,
  ArrowSquareOut,
  X,
  Crosshair,
  Path,
  WarningCircle
} from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MapStop } from "./map-component"

const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500 gap-2">
      <Compass size={32} className="animate-spin text-[#0038A8]" />
      <span className="text-xs font-bold uppercase tracking-wider">Carregando Mapa de Pontos...</span>
    </div>
  ),
})

const STOPS_DATA: MapStop[] = [
  {
    id: "mcz-rodoviaria",
    name: "Terminal Rodoviário João Paulo II",
    type: "terminal",
    address: "Av. Leste-Oeste, s/n - Feitosa, Maceió - AL",
    lat: -9.645625,
    lng: -35.726496,
    cities: ["Arapiraca", "Palmeira dos Índios", "Penedo", "União dos Palmares", "São Miguel dos Campos", "Delmiro Gouveia", "Santana do Ipanema", "Coruripe", "Maragogi"],
  },
  {
    id: "mcz-centro",
    name: "Ponto Central ARSAL - Levada",
    type: "posto",
    address: "Próximo ao Mercado da Produção - Levada, Maceió - AL",
    lat: -9.6612,
    lng: -35.7485,
    cities: ["Marechal Deodoro", "Barra de São Miguel", "Pilar", "Coqueiro Seco", "Santa Luzia do Norte", "Satuba"],
  },
  {
    id: "mcz-tabuleiro",
    name: "Ponto de Apoio Tabuleiro do Martins",
    type: "posto",
    address: "Av. Durval de Góes Monteiro (Trevo da PRF), Maceió - AL",
    lat: -9.565,
    lng: -35.7834,
    cities: ["Rio Largo", "Messias", "Murici", "Branquinha", "União dos Palmares", "São José da Laje"],
  },
  {
    id: "arapiraca-terminal",
    name: "Terminal Rodoviário Deputado Nezinho",
    type: "terminal",
    address: "R. Prof. Domingos Correia, s/n - Centro, Arapiraca - AL",
    lat: -9.7554,
    lng: -36.6612,
    cities: ["Maceió", "Palmeira dos Índios", "Santana do Ipanema", "Penedo", "São Sebastião", "Girau do Ponciano", "Craíbas", "Lagoa da Canoa"],
  },
  {
    id: "palmeira-terminal",
    name: "Terminal Rodoviário de Palmeira dos Índios",
    type: "terminal",
    address: "Av. Alagoas, s/n - São Cristóvão, Palmeira dos Índios - AL",
    lat: -9.4082,
    lng: -36.6268,
    cities: ["Maceió", "Arapiraca", "Santana do Ipanema", "Estrela de Alagoas", "Igaci", "Quebrangulo"],
  },
  {
    id: "penedo-terminal",
    name: "Terminal Rodoviário de Penedo",
    type: "terminal",
    address: "Av. Wanderley, s/n - Santa Luzia, Penedo - AL",
    lat: -10.2882,
    lng: -36.5815,
    cities: ["Maceió", "Arapiraca", "Piaçabuçu", "Igreja Nova", "São Sebastião", "Coruripe"],
  },
  {
    id: "delmiro-terminal",
    name: "Terminal Rodoviário de Delmiro Gouveia",
    type: "terminal",
    address: "Av. Juscelino Kubitschek - Centro, Delmiro Gouveia - AL",
    lat: -9.3875,
    lng: -37.9989,
    cities: ["Maceió", "Arapiraca", "Santana do Ipanema", "Piranhas", "Olho d'Água do Casado", "Água Branca", "Pariconha"],
  },
  {
    id: "santana-terminal",
    name: "Terminal Rodoviário de Santana do Ipanema",
    type: "terminal",
    address: "R. Delmiro Gouveia, s/n - Camoxinga, Santana do Ipanema - AL",
    lat: -9.3625,
    lng: -37.2415,
    cities: ["Maceió", "Arapiraca", "Delmiro Gouveia", "Dois Riachos", "Cacimbinhas", "Olho d'Água das Flores"],
  },
  {
    id: "maragogi-ponto",
    name: "Ponto Central de Embarque Maragogi",
    type: "posto",
    address: "Rodovia AL-101 Norte - Centro, Maragogi - AL",
    lat: -9.0125,
    lng: -35.2215,
    cities: ["Maceió", "Japaratinga", "Porto de Pedras", "Passo de Camaragibe", "São Miguel dos Milagres", "Porto Calvo"],
  },
  {
    id: "uniao-terminal",
    name: "Terminal Rodoviário de União dos Palmares",
    type: "terminal",
    address: "BR-104 - Centro, União dos Palmares - AL",
    lat: -9.1625,
    lng: -36.0315,
    cities: ["Maceió", "São José da Laje", "Murici", "Ibateguara", "Branquinha", "Santana do Mundaú"],
  },
]

// Fórmula de Haversine para calcular distância esférica em km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function formatDistance(distanceKm?: number): string | null {
  if (distanceKm === undefined) return null
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm.toFixed(1).replace(".", ",")} km`
}

export function NearbyStopsMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"todos" | "terminais" | "postos" | "proximos">("todos")
  const [selectedStop, setSelectedStop] = useState<MapStop | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Disparar permissão de geolocalização do navegador
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não é suportada pelo seu navegador.")
      return
    }

    setIsLocating(true)
    setGeoError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(coords)
        setActiveFilter("proximos")
        setIsLocating(false)

        // Selecionar automaticamente o ponto mais próximo
        const stopsWithDist = STOPS_DATA.map((stop) => ({
          ...stop,
          distanceKm: calculateDistance(coords[0], coords[1], stop.lat, stop.lng),
        })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))

        if (stopsWithDist.length > 0) {
          setSelectedStop(stopsWithDist[0])
        }
      },
      (err) => {
        setIsLocating(false)
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Permissão de localização negada. Ative nas configurações do navegador.")
        } else {
          setGeoError("Não foi possível obter sua localização no momento.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  // Pontos com distâncias calculadas
  const stopsWithDistances = useMemo(() => {
    return STOPS_DATA.map((stop) => {
      if (!userLocation) return stop
      return {
        ...stop,
        distanceKm: calculateDistance(userLocation[0], userLocation[1], stop.lat, stop.lng),
      }
    })
  }, [userLocation])

  // Filtrar e ordenar pontos
  const filteredStops = useMemo(() => {
    let result = stopsWithDistances.filter((stop) => {
      // Filtro de categoria
      if (activeFilter === "terminais" && stop.type !== "terminal") return false
      if (activeFilter === "postos" && stop.type !== "posto") return false

      // Filtro de pesquisa
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesName = stop.name.toLowerCase().includes(query)
        const matchesAddress = stop.address?.toLowerCase().includes(query)
        const matchesCities = stop.cities?.some((c) => c.toLowerCase().includes(query))
        return matchesName || matchesAddress || matchesCities
      }

      return true
    })

    // Se o filtro for próximos ou houver localização ativa, ordenar por proximidade
    if (userLocation && activeFilter === "proximos") {
      result = [...result].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    }

    return result
  }, [stopsWithDistances, searchQuery, activeFilter, userLocation])

  // Link de rota para o Google Maps
  const getGoogleMapsRouteUrl = (stop: MapStop) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${stop.lat},${stop.lng}&travelmode=driving`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`
  }

  return (
    <div className="space-y-4">
      {/* Container Principal do Mapa */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        
        {/* Barra de Busca & Filtros */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md space-y-3 relative z-20">
          
          {/* Banner de permissão quando localização não estiver ativa */}
          {!userLocation && !geoError && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/60 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <Crosshair size={20} weight="bold" className="text-[#0038A8] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                  Ative o GPS para encontrar os terminais mais próximos e traçar rotas.
                </span>
              </div>
              <Button
                type="button"
                onClick={handleGetLocation}
                disabled={isLocating}
                className="bg-[#0038A8] hover:bg-[#002b80] text-white text-xs font-bold rounded-xl px-3 py-1.5 shrink-0 shadow-sm"
              >
                {isLocating ? "Localizando..." : "Ativar GPS"}
              </Button>
            </div>
          )}

          {/* Mensagem de Erro de GPS */}
          {geoError && (
            <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300">
              <div className="flex items-center gap-2">
                <WarningCircle size={18} weight="bold" className="shrink-0" />
                <span>{geoError}</span>
              </div>
              <button
                type="button"
                onClick={() => setGeoError(null)}
                className="p-1 text-red-700 hover:text-red-900"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar terminal, posto ou cidade de destino..."
              className="w-full h-11 pl-10 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038A8]/20 transition-all"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Limpar busca"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGetLocation}
                title="Usar minha localização atual"
                aria-label="Usar minha localização atual"
                className={cn(
                  "absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  userLocation
                    ? "bg-[#0038A8] text-white"
                    : "bg-slate-100 dark:bg-slate-700 text-[#0038A8] hover:bg-slate-200 dark:hover:bg-slate-600"
                )}
              >
                <Crosshair size={17} weight="bold" className={cn(isLocating && "animate-spin")} />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActiveFilter("todos")}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border",
                activeFilter === "todos"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              Todos os Pontos ({STOPS_DATA.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("terminais")}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border",
                activeFilter === "terminais"
                  ? "bg-[#0038A8] text-white border-[#0038A8] shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <Buildings size={14} weight="bold" /> Terminais
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("postos")}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border",
                activeFilter === "postos"
                  ? "bg-[#002060] text-white border-[#002060] shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <Bus size={14} weight="bold" /> Postos de Apoio
            </button>

            <button
              type="button"
              onClick={() => {
                if (userLocation) {
                  setActiveFilter("proximos")
                } else {
                  handleGetLocation()
                }
              }}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border",
                activeFilter === "proximos"
                  ? "bg-[#D62828] text-white border-[#D62828] font-bold shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              )}
            >
              <NavigationArrow size={14} weight="bold" className={cn(isLocating && "animate-spin")} />
              {userLocation ? "Mais Próximos de Mim" : "Ativar Localização"}
            </button>
          </div>
        </div>

        {/* Visualizador do Mapa */}
        <div className="h-[420px] sm:h-[480px] w-full relative z-0">
          <MapComponent
            userLocation={userLocation}
            stops={filteredStops}
            selectedStop={selectedStop}
            onMarkerClick={(stop) => setSelectedStop(stop)}
          />
        </div>

        {/* Detalhes do Terminal Selecionado & Traçado de Rota */}
        {selectedStop && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-in slide-in-from-bottom duration-300 relative z-20">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md tracking-wider flex items-center gap-1",
                    selectedStop.type === "terminal"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                      : "bg-blue-50 dark:bg-blue-950/40 text-[#0038A8] dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                  )}>
                    <ShieldCheck size={12} weight="bold" />
                    {selectedStop.type === "terminal" ? "Terminal Central ARSAL" : "Posto Autorizado"}
                  </span>

                  {/* Selo de Distância em Relação ao Usuário */}
                  {selectedStop.distanceKm !== undefined && (
                    <span className="font-mono text-[11px] font-bold bg-red-50 dark:bg-red-950/60 text-[#D62828] dark:text-red-400 px-2 py-0.5 rounded-md border border-red-200 dark:border-red-900 flex items-center gap-1">
                      <NavigationArrow size={12} weight="bold" />
                      {formatDistance(selectedStop.distanceKm)} de você
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-tight">
                  {selectedStop.name}
                </h4>

                {selectedStop.address && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <MapPin size={14} weight="bold" className="shrink-0 text-[#0038A8]" />
                    {selectedStop.address}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedStop(null)}
                aria-label="Fechar detalhes"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Destinos atendidos */}
            {selectedStop.cities && selectedStop.cities.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  Destinos atendidos a partir deste ponto:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                  {selectedStop.cities.map((city) => (
                    <span
                      key={city}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ação Principal: Traçar Rota */}
            <div className="flex flex-wrap gap-2.5 mt-4">
              <Button
                asChild
                className="flex-1 bg-[#0038A8] hover:bg-[#002b80] text-white font-bold rounded-xl text-xs sm:text-sm py-2.5 shadow-sm"
              >
                <a
                  href={getGoogleMapsRouteUrl(selectedStop)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Path size={16} weight="bold" />
                  <span>{userLocation ? "Como Chegar (Traçar Rota)" : "Abrir Rota no Google Maps"}</span>
                  <ArrowSquareOut size={14} />
                </a>
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}



