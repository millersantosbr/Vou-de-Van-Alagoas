"use client"

import { useState, useMemo, useEffect } from "react"
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
  WarningCircle,
  CheckCircle,
} from "@phosphor-icons/react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  STOPS_DATA,
  calculateDistance,
  formatDistance,
  isStopServingDestination,
  getStopsForRoute,
  getClosestStopForRoute,
  type MapStop,
} from "@/lib/stops-data"
import { subscribeFocusClosestStop } from "@/lib/route-events"

const MapComponent = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-400 gap-2.5">
      <Compass size={28} className="animate-spin text-[#0038A8]" />
      <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400">
        Carregando mapa interativo...
      </span>
    </div>
  ),
})

export function NearbyStopsMap() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"todos" | "terminais" | "postos" | "pontos" | "proximos">("todos")
  const [selectedStop, setSelectedStop] = useState<MapStop | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)

  // Filtro de rota ativo disparado pela busca ou pelo botão "Ponto Mais Próximo"
  const [routeFilter, setRouteFilter] = useState<{ origem: string; destino: string } | null>(null)

  // Escuta evento do botão "Ponto Mais Próximo" disparado no card de próxima saída
  useEffect(() => {
    return subscribeFocusClosestStop((detail) => {
      setRouteFilter({ origem: detail.origem, destino: detail.destino })
      
      const coords = detail.userCoords || userLocation
      if (detail.userCoords) {
        setUserLocation(detail.userCoords)
      }

      // Valida e seleciona o ponto que REALMENTE atende essa rota
      const closest = getClosestStopForRoute(coords, detail.origem, detail.destino)
      if (closest) {
        setSelectedStop(closest)
      }

      if (coords) {
        setActiveFilter("proximos")
      } else {
        setActiveFilter("todos")
      }
    })
  }, [userLocation])

  // Disparar permissão de geolocalização do navegador
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocalização não suportada.")
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

        // Se houver rota ativa, seleciona o ponto mais próximo que atende a rota
        if (routeFilter) {
          const closest = getClosestStopForRoute(coords, routeFilter.origem, routeFilter.destino)
          if (closest) {
            setSelectedStop(closest)
            return
          }
        }

        // Caso contrário, seleciona o ponto mais próximo geral
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
          setGeoError("Permissão negada. Ative a localização no seu navegador.")
        } else {
          setGeoError("Não foi possível obter sua localização.")
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  // Pontos com distâncias calculadas dinamicamente
  const stopsWithDistances = useMemo(() => {
    return STOPS_DATA.map((stop) => {
      if (!userLocation) return stop
      return {
        ...stop,
        distanceKm: calculateDistance(userLocation[0], userLocation[1], stop.lat, stop.lng),
      }
    })
  }, [userLocation])

  // Filtrar e ordenar pontos considerando a rota ativa
  const filteredStops = useMemo(() => {
    let result = stopsWithDistances.filter((stop) => {
      // Se houver filtro de rota ativo, exibe apenas os pontos válidos para o destino
      if (routeFilter) {
        if (!isStopServingDestination(stop, routeFilter.destino)) {
          return false
        }
      }

      if (activeFilter === "terminais" && stop.type !== "terminal") return false
      if (activeFilter === "postos" && stop.type !== "posto") return false
      if (activeFilter === "pontos" && stop.type !== "ponto") return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesName = stop.name.toLowerCase().includes(query)
        const matchesAddress = stop.address?.toLowerCase().includes(query)
        const matchesCity = stop.city?.toLowerCase().includes(query)
        const matchesCities = stop.cities?.some((c) => c.toLowerCase().includes(query))
        return matchesName || matchesAddress || matchesCity || matchesCities
      }

      return true
    })

    if (userLocation && activeFilter === "proximos") {
      result = [...result].sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    }

    return result
  }, [stopsWithDistances, searchQuery, activeFilter, userLocation, routeFilter])

  // Link de rota para o Google Maps
  const getGoogleMapsRouteUrl = (stop: MapStop) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${stop.lat},${stop.lng}&travelmode=driving`
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`
  }

  // Obter tipo formatado do ponto
  const getStopTypeBadge = (type: MapStop["type"]) => {
    switch (type) {
      case "terminal":
        return { label: "Terminal Rodoviário", color: "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400" }
      case "posto":
        return { label: "Posto Autorizado", color: "bg-indigo-50 dark:bg-indigo-950/60 text-[#002060] dark:text-indigo-400" }
      case "ponto":
      default:
        return { label: "Ponto Estratégico", color: "bg-red-50 dark:bg-red-950/60 text-[#D62828] dark:text-red-400" }
    }
  }

  // Verifica se o ponto selecionado atende a rota ativa
  const selectedStopServesRoute = useMemo(() => {
    if (!selectedStop || !routeFilter) return true
    return isStopServingDestination(selectedStop, routeFilter.destino)
  }, [selectedStop, routeFilter])

  // Pontos válidos para a rota ativa
  const validStopsForRoute = useMemo(() => {
    if (!routeFilter) return []
    return getStopsForRoute(routeFilter.origem, routeFilter.destino)
  }, [routeFilter])

  return (
    <div className="space-y-3">
      {/* Container Principal do Mapa com Design Clean */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden relative">
        
        {/* Barra de Controle Unificada: Busca & Filtros */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md space-y-2.5 relative z-20">
          
          {/* Alerta de Rota Selecionada Ativa */}
          {routeFilter && (
            <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/80 text-xs sm:text-sm animate-in fade-in duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0038A8] dark:bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0038A8] dark:bg-blue-400" />
                </span>
                <div className="min-w-0 truncate">
                  <span className="font-extrabold text-[#0038A8] dark:text-blue-300 mr-1.5">
                    Pontos para {routeFilter.destino}:
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    Exibindo apenas pontos validados onde passam vans de {routeFilter.origem} para {routeFilter.destino}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRouteFilter(null)}
                className="px-2.5 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 border border-slate-200/90 dark:border-slate-700 transition-colors shadow-xs"
              >
                Ver Todos
              </button>
            </div>
          )}

          {/* Mensagem de Erro de GPS (Discreta) */}
          {geoError && (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
              <div className="flex items-center gap-2">
                <WarningCircle size={16} weight="bold" className="shrink-0" />
                <span>{geoError}</span>
              </div>
              <button
                type="button"
                onClick={() => setGeoError(null)}
                className="p-0.5 text-red-600 hover:text-red-800"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Campo de Busca com Botão de GPS Integrado */}
          <div className="relative">
            <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ponto (ex: Shopping Pátio, Rodoviária, Tabuleiro)..."
              className="w-full h-11 pl-10 pr-24 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0038A8]/20 focus:border-[#0038A8] transition-all"
            />
            
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Limpar busca"
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
                >
                  <X size={15} />
                </button>
              )}

              <button
                type="button"
                onClick={handleGetLocation}
                title={userLocation ? "Localização Ativa" : "Usar meu GPS"}
                className={cn(
                  "h-7 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95",
                  userLocation
                    ? "bg-[#0038A8] text-white shadow-xs"
                    : "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 hover:bg-blue-100/80 border border-blue-200/60 dark:border-blue-900/60"
                )}
              >
                <Crosshair size={14} weight="bold" className={cn(isLocating && "animate-spin")} />
                <span className="hidden sm:inline">{isLocating ? "Buscando..." : userLocation ? "GPS Ativo" : "Perto de mim"}</span>
              </button>
            </div>
          </div>

          {/* Filtros em Pílulas Minimalistas */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <button
              type="button"
              onClick={() => setActiveFilter("todos")}
              className={cn(
                "shrink-0 px-3 py-1 rounded-xl text-xs font-medium transition-all",
                activeFilter === "todos"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
              )}
            >
              Todos ({filteredStops.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("terminais")}
              className={cn(
                "shrink-0 px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1",
                activeFilter === "terminais"
                  ? "bg-[#0038A8] text-white font-semibold shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
              )}
            >
              <Buildings size={13} weight="bold" />
              <span>Terminais</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("postos")}
              className={cn(
                "shrink-0 px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1",
                activeFilter === "postos"
                  ? "bg-[#002060] text-white font-semibold shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
              )}
            >
              <Bus size={13} weight="bold" />
              <span>Postos Autorizados</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter("pontos")}
              className={cn(
                "shrink-0 px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1",
                activeFilter === "pontos"
                  ? "bg-[#D62828] text-white font-semibold shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
              )}
            >
              <MapPin size={13} weight="bold" />
              <span>Pontos Estratégicos</span>
            </button>

            {userLocation && (
              <button
                type="button"
                onClick={() => setActiveFilter("proximos")}
                className={cn(
                  "shrink-0 px-3 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1",
                  activeFilter === "proximos"
                    ? "bg-[#D62828] text-white font-semibold shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70"
                )}
              >
                <NavigationArrow size={13} weight="bold" />
                <span>Mais Próximos</span>
              </button>
            )}
          </div>
        </div>

        {/* Mapa Interativo */}
        <div className="h-[380px] sm:h-[440px] w-full relative z-0">
          <MapComponent
            userLocation={userLocation}
            stops={filteredStops}
            selectedStop={selectedStop}
            onMarkerClick={(stop) => setSelectedStop(stop)}
          />
        </div>

        {/* Card Flutuante / Ficha Limpa do Ponto Selecionado */}
        {selectedStop && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200 relative z-20 space-y-3">
            
            {/* Aviso dinâmico quando o ponto selecionado NÃO passa vans da rota ativa */}
            {routeFilter && !selectedStopServesRoute && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in duration-200">
                <WarningCircle size={18} weight="bold" className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Atenção: Não passa van para {routeFilter.destino} neste ponto.</strong>
                  <span>
                    Para viajar de {routeFilter.origem} para <strong>{routeFilter.destino}</strong>, utilize um dos pontos válidos:{" "}
                    <strong>
                      {validStopsForRoute.length > 0
                        ? validStopsForRoute.map((p) => p.name).join(" ou ")
                        : "o terminal oficial correspondente"}
                    </strong>.
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={cn(
                    "text-xs font-bold uppercase px-2.5 py-0.5 rounded-md tracking-wider inline-flex items-center gap-1",
                    getStopTypeBadge(selectedStop.type).color
                  )}>
                    <ShieldCheck size={13} weight="bold" />
                    {getStopTypeBadge(selectedStop.type).label}
                  </span>

                  {/* Badge de validação positiva para a rota ativa */}
                  {routeFilter && selectedStopServesRoute && (
                    <span className="text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                      <CheckCircle size={13} weight="bold" />
                      Atende vans para {routeFilter.destino}
                    </span>
                  )}

                  {selectedStop.distanceKm !== undefined && (
                    <span className="text-xs font-bold bg-red-50 dark:bg-red-950/60 text-[#D62828] dark:text-red-400 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                      <NavigationArrow size={12} weight="bold" />
                      {formatDistance(selectedStop.distanceKm)} de você
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug truncate">
                  {selectedStop.name}
                </h4>

                {selectedStop.address && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5 truncate">
                    <MapPin size={14} weight="bold" className="shrink-0 text-[#0038A8]" />
                    <span className="truncate">{selectedStop.address}</span>
                  </p>
                )}

                {selectedStop.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {selectedStop.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedStop(null)}
                aria-label="Fechar detalhes"
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Cidades principais atendidas */}
            {selectedStop.cities && selectedStop.cities.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">Rotas:</span>
                {selectedStop.cities.slice(0, 8).map((city) => (
                  <span
                    key={city}
                    className={cn(
                      "shrink-0 px-2.5 py-0.5 rounded-lg text-xs font-semibold",
                      routeFilter && isStopServingDestination({ cities: [city] } as any, routeFilter.destino)
                        ? "bg-[#0038A8] text-white font-bold"
                        : "bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200"
                    )}
                  >
                    {city}
                  </span>
                ))}
                {selectedStop.cities.length > 8 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold shrink-0">
                    +{selectedStop.cities.length - 8}
                  </span>
                )}
              </div>
            )}

            {/* Ação Direta: Traçar Rota */}
            <Button
              asChild
              className="w-full bg-[#0038A8] hover:bg-[#002b80] text-white font-bold rounded-xl text-xs sm:text-sm h-10 shadow-xs"
            >
              <a
                href={getGoogleMapsRouteUrl(selectedStop)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <Path size={16} weight="bold" />
                <span>{userLocation ? "Traçar Rota no Google Maps" : "Abrir Localização no Mapa"}</span>
                <ArrowSquareOut size={14} />
              </a>
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}
