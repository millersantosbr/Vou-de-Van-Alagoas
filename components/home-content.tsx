"use client"

import { useState, useEffect, useMemo, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  listaCidades,
  getDestinosDisponiveis,
  getViasDisponiveis,
  buscarHorariosRota,
  getDiaSemanaHoje,
  type HorarioFormatado,
  type FiltroDia,
} from "@/lib/bus-data"
import {
  Clock,
  MagnifyingGlass,
  ArrowsDownUp,
  CalendarBlank,
  Path,
  CaretDown,
  CaretUp,
  ArrowRight,
  Check,
  Info,
  CaretUpDown,
  Circle,
  MapPin,
  ArrowSquareOut,
  Sparkle,
  Lightning,
} from "@phosphor-icons/react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/components/ui/use-mobile"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

// Rotas mais procuradas em Alagoas para acesso em 1 toque
const ROTAS_RAPIDAS = [
  { de: "Maceió", para: "Arapiraca" },
  { de: "Maceió", para: "Marechal Deodoro" },
  { de: "Maceió", para: "Maragogi" },
  { de: "Maceió", para: "Palmeira dos Índios" },
  { de: "Maceió", para: "União dos Palmares" },
]

export default function HomeContent() {
  const isMobile = useIsMobile()
  const [origem, setOrigem] = useState<string>("")
  const [destino, setDestino] = useState<string>("")
  const [destinos, setDestinos] = useState<string[]>([])
  const [viasDisponiveis, setViasDisponiveis] = useState<string[]>([])
  const [filtroVia, setFiltroVia] = useState<string>("todas")
  const [filtroDia, setFiltroDia] = useState<FiltroDia>("hoje")
  const [horariosFiltrados, setHorariosFiltrados] = useState<HorarioFormatado[]>([])
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const [openOrigem, setOpenOrigem] = useState(false)
  const [openDestino, setOpenDestino] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  const [isPending, startTransition] = useTransition()

  const diaHojeNome = useMemo(() => getDiaSemanaHoje(), [])

  // Obter hora atual formatada (HH:MM)
  const horaAtualDate = new Date()
  const horaAtualString = useMemo(() => {
    const hh = String(horaAtualDate.getHours()).padStart(2, "0")
    const mm = String(horaAtualDate.getMinutes()).padStart(2, "0")
    return `${hh}:${mm}`
  }, [])

  // Atualiza destinos e vias quando a origem muda
  useEffect(() => {
    if (origem) {
      const destinosDisp = getDestinosDisponiveis(origem)
      setDestinos(destinosDisp)

      if (destino && !destinosDisp.includes(destino)) {
        setDestino(destinosDisp[0] || "")
      }
    } else {
      setDestinos([])
    }
  }, [origem])

  // Atualiza vias e horários quando a origem ou destino mudam
  useEffect(() => {
    if (origem && destino) {
      const vias = getViasDisponiveis(origem, destino)
      setViasDisponiveis(vias)
      setFiltroVia("todas")
    } else {
      setViasDisponiveis([])
      setFiltroVia("todas")
    }
  }, [origem, destino])

  // Atualiza os horários filtrados
  useEffect(() => {
    if (origem && destino) {
      const resultados = buscarHorariosRota(origem, destino, filtroDia, filtroVia)
      setHorariosFiltrados(resultados)
    } else {
      setHorariosFiltrados([])
    }
  }, [origem, destino, filtroDia, filtroVia])

  // Inverter origem e destino (Troca tátil limpa com física suave)
  const handleInverterSentido = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!origem && !destino) return

    const antigaOrigem = origem
    const antigoDestino = destino
    const novaOrigem = antigoDestino
    const novoDestino = antigaOrigem

    setIsSwapping(true)

    startTransition(() => {
      setOrigem(novaOrigem)
      setDestino(novoDestino)
      if (novaOrigem) {
        setDestinos(getDestinosDisponiveis(novaOrigem))
      } else {
        setDestinos([])
      }
      setExpandedCards({})
    })

    setTimeout(() => {
      setIsSwapping(false)
    }, 400)
  }

  const handleOrigemSelect = (value: string) => {
    startTransition(() => {
      setOrigem(value)
      setOpenOrigem(false)
      setExpandedCards({})
    })
  }

  const handleDestinoSelect = (value: string) => {
    startTransition(() => {
      setDestino(value)
      setOpenDestino(false)
      setExpandedCards({})
    })
  }

  const selecionarRotaRapida = (de: string, para: string) => {
    startTransition(() => {
      setOrigem(de)
      setDestinos(getDestinosDisponiveis(de))
      setDestino(para)
      setExpandedCards({})
    })
  }

  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Identificar o primeiro horário seguinte ao horário atual (se o filtro for "hoje")
  const proximoHorario = useMemo(() => {
    if (horariosFiltrados.length === 0) return null
    if (filtroDia === "hoje") {
      const proximo = horariosFiltrados.find((h) => h.horario >= horaAtualString)
      return proximo || horariosFiltrados[0]
    }
    return horariosFiltrados[0]
  }, [filtroDia, horariosFiltrados, horaAtualString])

  // Calcular tempo restante para a próxima saída em minutos
  const getMinutosRestantes = (horarioStr: string) => {
    try {
      const [h, m] = horarioStr.split(":").map(Number)
      const now = new Date()
      const saida = new Date()
      saida.setHours(h, m, 0, 0)
      const diffMs = saida.getTime() - now.getTime()
      const diffMin = Math.round(diffMs / 60000)
      if (diffMin > 0 && diffMin <= 120) {
        return `Em ${diffMin} min`
      } else if (diffMin > 120) {
        const horas = Math.floor(diffMin / 60)
        const mins = diffMin % 60
        return `Em ${horas}h${mins > 0 ? ` ${mins}m` : ""}`
      }
      return "Partida programada"
    } catch {
      return "Hoje"
    }
  }

  // Horários subsequentes
  const horariosSubsequentes = useMemo(() => {
    if (!proximoHorario) return []
    return horariosFiltrados.filter((h) => h.id !== proximoHorario.id)
  }, [horariosFiltrados, proximoHorario])

  // Conteúdo do Seletor de Origem
  const renderOrigemList = () => (
    <Command className="w-full">
      <CommandInput placeholder="Pesquisar cidade de origem..." className="h-12 border-none focus:ring-0 font-medium text-base" />
      <CommandList className={cn("overflow-y-auto scrollbar-hide p-1", isMobile ? "max-h-[50dvh]" : "max-h-[280px]")}>
        <CommandEmpty className="py-6 text-center text-sm font-medium text-slate-500">Nenhuma cidade encontrada.</CommandEmpty>
        <CommandGroup>
          {listaCidades.map((cidade) => (
            <CommandItem
              key={cidade}
              value={cidade}
              onSelect={handleOrigemSelect}
              className="py-3 px-4 text-sm sm:text-base font-semibold flex items-center justify-between cursor-pointer rounded-xl"
            >
              {cidade}
              <Check
                size={18}
                weight="bold"
                className={cn(
                  "text-[#0038A8]",
                  origem === cidade ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  // Conteúdo do Seletor de Destino
  const renderDestinoList = () => (
    <Command className="w-full">
      <CommandInput placeholder="Pesquisar cidade de destino..." className="h-12 border-none focus:ring-0 font-medium text-base" />
      <CommandList className={cn("overflow-y-auto scrollbar-hide p-1", isMobile ? "max-h-[50dvh]" : "max-h-[280px]")}>
        <CommandEmpty className="py-6 text-center text-sm font-medium text-slate-500">
          {origem ? `Nenhum destino cadastrado a partir de ${origem}.` : "Selecione a cidade de origem primeiro."}
        </CommandEmpty>
        <CommandGroup>
          {destinos.map((cidade) => (
            <CommandItem
              key={cidade}
              value={cidade}
              onSelect={handleDestinoSelect}
              className="py-3 px-4 text-sm sm:text-base font-semibold flex items-center justify-between cursor-pointer rounded-xl"
            >
              {cidade}
              <Check
                size={18}
                weight="bold"
                className={cn(
                  "text-[#D62828]",
                  destino === cidade ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return (
    <div className="space-y-6">
      {/* 🚀 Search Card - Cores de Alagoas (Azul e Vermelho) com Uilora Aesthetics */}
      <section className="relative">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_12px_36px_-6px_rgba(0,56,168,0.12)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-4 relative z-10">
          <div className="relative flex flex-col gap-2">
            
            {/* Origin Input Card (Azul Alagoas) */}
            {isMobile ? (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenOrigem(true)}
                  className={cn(
                    "relative bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer border border-transparent hover:border-[#0038A8]/30",
                    isPending && "opacity-80"
                  )}
                >
                  <div className="flex flex-col items-center justify-center relative shrink-0">
                    <Circle size={18} weight="bold" className="text-[#0038A8] z-10" />
                    <div className="w-0.5 h-8 bg-gradient-to-b from-[#0038A8] to-[#D62828] opacity-30 absolute top-4 left-1/2 -translate-x-1/2" />
                  </div>

                  <div className="grow min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0038A8] dark:text-blue-400 mb-0.5">
                      Saindo de (Origem)
                    </span>
                    <p className={cn("text-base sm:text-lg font-bold truncate", !origem ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100")}>
                      {origem ? origem : "Selecione a cidade de partida..."}
                    </p>
                  </div>

                  <CaretUpDown size={18} className="shrink-0 opacity-40 text-slate-500" />
                </div>

                <Drawer open={openOrigem} onOpenChange={setOpenOrigem}>
                  <DrawerContent className="max-h-[85dvh] p-0 z-50">
                    <DrawerHeader className="border-b border-slate-200 dark:border-slate-800 pb-3 pt-3 px-4 text-left">
                      <DrawerTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Circle size={16} weight="bold" className="text-[#0038A8]" />
                        Selecione a cidade de origem
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-2 pb-6">
                      {renderOrigemList()}
                    </div>
                  </DrawerContent>
                </Drawer>
              </>
            ) : (
              <Popover open={openOrigem} onOpenChange={(open) => startTransition(() => setOpenOrigem(open))}>
                <PopoverTrigger asChild>
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "relative bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/50 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer border border-transparent hover:border-[#0038A8]/30",
                      isPending && "opacity-80"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center relative shrink-0">
                      <Circle size={18} weight="bold" className="text-[#0038A8] z-10" />
                      <div className="w-0.5 h-8 bg-gradient-to-b from-[#0038A8] to-[#D62828] opacity-30 absolute top-4 left-1/2 -translate-x-1/2" />
                    </div>

                    <div className="grow min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#0038A8] dark:text-blue-400 mb-0.5">
                        Saindo de (Origem)
                      </span>
                      <p className={cn("text-base sm:text-lg font-bold truncate", !origem ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100")}>
                        {origem ? origem : "Selecione a cidade de partida..."}
                      </p>
                    </div>

                    <CaretUpDown size={18} className="shrink-0 opacity-40 text-slate-500" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50" align="start" side="bottom" sideOffset={6}>
                  {renderOrigemList()}
                </PopoverContent>
              </Popover>
            )}

            {/* Floating Swap Button com Física de Mola Uilora */}
            <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30">
              <motion.button
                type="button"
                aria-label="Inverter Rota"
                onClick={handleInverterSentido}
                disabled={!origem && !destino}
                title="Inverter Sentido (Origem ↔ Destino)"
                whileTap={{ scale: 0.9, rotate: 180 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className={cn(
                  "w-11 h-11 sm:w-12 sm:h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none ring-2 ring-transparent hover:ring-[#0038A8]/20",
                  isSwapping && "border-[#0038A8]"
                )}
              >
                <ArrowsDownUp
                  size={20}
                  weight="bold"
                  className={cn(
                    "text-[#0038A8] dark:text-blue-400 transition-transform duration-300",
                    isSwapping && "rotate-180"
                  )}
                />
              </motion.button>
            </div>

            {/* Destination Input Card (Vermelho Alagoas) */}
            {isMobile ? (
              <>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (origem) setOpenDestino(true)
                  }}
                  className={cn(
                    "relative bg-slate-50 dark:bg-slate-800/70 hover:bg-red-50/50 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer border border-transparent hover:border-[#D62828]/30",
                    !origem && "opacity-60 cursor-not-allowed",
                    isPending && "opacity-80"
                  )}
                >
                  <div className="flex flex-col items-center justify-center relative shrink-0">
                    <MapPin size={18} weight="fill" className="text-[#D62828] z-10" />
                  </div>

                  <div className="grow min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D62828] dark:text-red-400 mb-0.5">
                      Indo para (Destino)
                    </span>
                    <p className={cn("text-base sm:text-lg font-bold truncate", !destino ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100")}>
                      {destino ? destino : "Selecione a cidade de destino..."}
                    </p>
                  </div>

                  <CaretUpDown size={18} className="shrink-0 opacity-40 text-slate-500" />
                </div>

                <Drawer open={openDestino} onOpenChange={setOpenDestino}>
                  <DrawerContent className="max-h-[85dvh] p-0 z-50">
                    <DrawerHeader className="border-b border-slate-200 dark:border-slate-800 pb-3 pt-3 px-4 text-left">
                      <DrawerTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <MapPin size={16} weight="fill" className="text-[#D62828]" />
                        Selecione a cidade de destino
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-2 pb-6">
                      {renderDestinoList()}
                    </div>
                  </DrawerContent>
                </Drawer>
              </>
            ) : (
              <Popover open={openDestino} onOpenChange={(open) => startTransition(() => setOpenDestino(open))}>
                <PopoverTrigger asChild>
                  <div
                    role="button"
                    tabIndex={0}
                    className={cn(
                      "relative bg-slate-50 dark:bg-slate-800/70 hover:bg-red-50/50 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all cursor-pointer border border-transparent hover:border-[#D62828]/30",
                      !origem && "opacity-60 cursor-not-allowed",
                      isPending && "opacity-80"
                    )}
                  >
                    <div className="flex flex-col items-center justify-center relative shrink-0">
                      <MapPin size={18} weight="fill" className="text-[#D62828] z-10" />
                    </div>

                    <div className="grow min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-[#D62828] dark:text-red-400 mb-0.5">
                        Indo para (Destino)
                      </span>
                      <p className={cn("text-base sm:text-lg font-bold truncate", !destino ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100")}>
                        {destino ? destino : "Selecione a cidade de destino..."}
                      </p>
                    </div>

                    <CaretUpDown size={18} className="shrink-0 opacity-40 text-slate-500" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden z-50" align="start" side="bottom" sideOffset={6}>
                  {renderDestinoList()}
                </PopoverContent>
              </Popover>
            )}

          </div>

          {/* ⚡ Quick Route Pills (Uilora Modern Button Style) */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-1.5 mb-2 px-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <Lightning size={14} weight="fill" className="text-[#0038A8] dark:text-blue-400" />
              Rotas mais procuradas:
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {ROTAS_RAPIDAS.map((r) => {
                const isSelected = origem === r.de && destino === r.para
                return (
                  <button
                    key={`${r.de}-${r.para}`}
                    type="button"
                    onClick={() => selecionarRotaRapida(r.de, r.para)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 active:scale-95 border",
                      isSelected
                        ? "bg-[#0038A8] text-white border-[#0038A8] shadow-[0_2px_8px_rgba(0,56,168,0.3)]"
                        : "bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#0038A8]"
                    )}
                  >
                    <span>{r.de}</span>
                    <span className="text-[#D62828] font-bold">⇄</span>
                    <span>{r.para}</span>
                  </button>
                )
              })}
            </div>
          </div>

        </div>
      </section>

      {/* 🗓️ Filters & Day Selection */}
      {origem && destino && (
        <section className="space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarBlank size={18} weight="bold" className="text-[#0038A8]" />
              Dia da viagem
            </h2>
            {filtroDia === "hoje" && (
              <span className="text-[11px] font-bold text-[#0038A8] bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-900/60">
                Hoje é {diaHojeNome}
              </span>
            )}
          </div>

          {/* Day Horizontal Scroll Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x px-0.5">
            {[
              { id: "hoje", label: "Hoje" },
              { id: "semana", label: "Seg a Sex" },
              { id: "sabado", label: "Sábado" },
              { id: "domingo", label: "Domingo" },
              { id: "todos", label: "Todos os dias" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFiltroDia(item.id as FiltroDia)}
                className={cn(
                  "snap-start shrink-0 px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 border",
                  filtroDia === item.id
                    ? "bg-[#0038A8] text-white border-[#0038A8] shadow-md shadow-[#0038A8]/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 🔍 Route Type / Via Chips */}
          {viasDisponiveis.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 px-0.5">
              <button
                type="button"
                onClick={() => setFiltroVia("todas")}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5",
                  filtroVia === "todas"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 border-blue-300 dark:border-blue-800 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                )}
              >
                <Path size={14} weight="bold" /> Todas as Vias
              </button>
              {viasDisponiveis.map((via) => (
                <button
                  key={via}
                  type="button"
                  onClick={() => setFiltroVia(via)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5",
                    filtroVia === via
                      ? "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 border-blue-300 dark:border-blue-800 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                  )}
                >
                  <span>Via {via}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 📋 Quadro de Saídas */}
      <section className="space-y-4">
        {origem && destino ? (
          horariosFiltrados.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
              
              {/* Header do Quadro */}
              <div className="flex items-center justify-between px-1">
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock size={20} weight="bold" className="text-[#0038A8]" />
                  Saídas encontradas
                </h2>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {horariosFiltrados.length} {horariosFiltrados.length === 1 ? "Horário" : "Horários"}
                </span>
              </div>

              {/* 🌟 Next Departure Featured Card (Inspirado no Card Dynamic do Uilora) */}
              {proximoHorario && (
                <article className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-[0_8px_30px_rgba(214,40,40,0.12)] border-2 border-[#D62828]/60 dark:border-[#D62828]/40 overflow-hidden relative group">
                  {/* Subtle Top Red Accent Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D62828] via-[#FF4D4D] to-[#D62828]" />

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Live Radar Indicator & Monospaced Time */}
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/60 text-[#D62828] dark:text-red-400 border border-red-200 dark:border-red-900/70 px-3 py-1.5 rounded-full shadow-xs">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D62828] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D62828]" />
                        </span>
                        <span className="text-xs font-extrabold uppercase tracking-wide">Próxima Saída</span>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-none">
                          {proximoHorario.horario}
                        </div>
                        <div className="text-xs font-extrabold text-[#D62828] dark:text-red-400 mt-1.5">
                          {getMinutosRestantes(proximoHorario.horario)}
                        </div>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2">
                      <div className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold bg-[#0038A8] text-white px-2.5 py-0.5 rounded-md shadow-xs">
                          Linha {proximoHorario.codigoLinha}
                        </span>
                        <span className="font-extrabold">{proximoHorario.nomeLinha}</span>
                      </div>

                      <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-200">{proximoHorario.origem}</span>
                        <ArrowRight size={14} className="text-[#0038A8]" />
                        <span className="font-bold text-slate-900 dark:text-slate-200">{proximoHorario.destino}</span>
                        {proximoHorario.extensao && (
                          <span className="text-slate-400 dark:text-slate-500">({proximoHorario.extensao})</span>
                        )}
                      </div>

                      {proximoHorario.via && (
                        <p className="text-xs font-bold text-[#0038A8] dark:text-blue-400 flex items-center gap-1.5">
                          <Path size={14} weight="bold" />
                          Via {proximoHorario.via}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <CalendarBlank size={15} />
                        <span>
                          {proximoHorario.dias.length === 7 ? "Circula Diariamente" : proximoHorario.dias.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <Button
                        asChild
                        className="flex-1 bg-[#0038A8] hover:bg-[#002b80] text-white font-bold rounded-xl py-2.5 text-xs sm:text-sm shadow-md shadow-[#0038A8]/25 transition-all active:scale-95"
                      >
                        <Link href={`/routes/${proximoHorario.codigoLinha}`}>
                          <Info size={16} className="mr-1.5" weight="bold" />
                          Ver Detalhes da Linha
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => toggleCardExpansion(proximoHorario.id)}
                        className="rounded-xl font-bold text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {expandedCards[proximoHorario.id] ? "Ocultar Itinerário" : "Ver Itinerário ARSAL"}
                        {expandedCards[proximoHorario.id] ? <CaretUp size={14} className="ml-1" /> : <CaretDown size={14} className="ml-1" />}
                      </Button>
                    </div>

                    {/* Expanded Regulatory Details */}
                    {expandedCards[proximoHorario.id] && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs space-y-2 animate-in fade-in duration-200">
                        {proximoHorario.itinerario?.ida && (
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">Itinerário Ida:</p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{proximoHorario.itinerario.ida}</p>
                          </div>
                        )}
                        {proximoHorario.itinerario?.volta && (
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">Itinerário Volta:</p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{proximoHorario.itinerario.volta}</p>
                          </div>
                        )}
                        {proximoHorario.itinerario?.seccionamentos && (
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-[11px]">Paradas autorizadas:</p>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{proximoHorario.itinerario.seccionamentos}</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </article>
              )}

              {/* 📋 Subsequent Departure Cards List */}
              {horariosSubsequentes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                    Próximas Saídas
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {horariosSubsequentes.map((item) => {
                      const isExpanded = !!expandedCards[item.id]

                      return (
                        <article
                          key={item.id}
                          className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-[#0038A8]/40 dark:hover:border-slate-700"
                        >
                          <div className="flex items-center gap-4">
                            {/* Monospaced Time Badge */}
                            <div className="shrink-0 text-center w-20 border-r border-slate-200 dark:border-slate-800 pr-3">
                              <div className="font-mono text-2xl font-black text-slate-900 dark:text-slate-100">
                                {item.horario}
                              </div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                                Partida
                              </div>
                            </div>

                            {/* Center Info */}
                            <div className="grow min-w-0">
                              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                                Linha {item.codigoLinha} • {item.nomeLinha}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {item.via ? `Via ${item.via}` : `${item.origem} para ${item.destino}`}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-semibold">
                                  {item.dias.length === 7 ? "Diariamente" : item.dias.slice(0, 3).join(", ")}
                                </span>
                              </div>
                            </div>

                            {/* Details Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleCardExpansion(item.id)}
                              aria-label="Ver detalhes do horário"
                              className="shrink-0 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors"
                            >
                              {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
                            </button>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2 animate-in fade-in duration-200">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">Trajeto: {item.origem} → {item.destino}</span>
                                <Link
                                  href={`/routes/${item.codigoLinha}`}
                                  className="text-[#0038A8] dark:text-blue-400 hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                                >
                                  Página da Linha <ArrowSquareOut size={13} />
                                </Link>
                              </div>
                              {item.itinerario?.ida && (
                                <p className="text-slate-600 dark:text-slate-400"><strong className="text-slate-900 dark:text-slate-100">Itinerário:</strong> {item.itinerario.ida}</p>
                              )}
                            </div>
                          )}
                        </article>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-500">
                <Clock size={22} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Nenhum horário encontrado para este dia</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mt-1 leading-relaxed">
                Tente alterar o dia da viagem ou selecionar outra via para ver mais saídas.
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 flex items-center justify-center mb-3">
              <MagnifyingGlass size={22} weight="bold" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Consulte os horários</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mt-1 leading-relaxed">
              Selecione a cidade de origem e destino acima para ver os horários oficiais ARSAL.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
