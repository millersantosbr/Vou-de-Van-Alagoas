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
  getDiaSemanaOffset,
  type HorarioFormatado,
  type FiltroDia,
} from "@/lib/bus-data"
import {
  Clock,
  MagnifyingGlass,
  ArrowsDownUp,
  ArrowsLeftRight,
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
  MoonStars,
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
import { dispatchFocusClosestStop } from "@/lib/route-events"

export default function HomeContent() {
  const isMobile = useIsMobile()
  const [origem, setOrigem] = useState<string>("Maceió")
  const [destinos, setDestinos] = useState<string[]>(() => getDestinosDisponiveis("Maceió"))
  const [destino, setDestino] = useState<string>("Arapiraca")
  const [viasDisponiveis, setViasDisponiveis] = useState<string[]>([])
  const [filtroVia, setFiltroVia] = useState<string>("todas")
  const [filtroDia, setFiltroDia] = useState<FiltroDia>("hoje")
  const [horariosFiltrados, setHorariosFiltrados] = useState<HorarioFormatado[]>([])
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [mostrarTodosHorarios, setMostrarTodosHorarios] = useState(false)

  const [openOrigem, setOpenOrigem] = useState(false)
  const [openDestino, setOpenDestino] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [mostrarViagensPassadas, setMostrarViagensPassadas] = useState(false)
  const [isLocatingStop, setIsLocatingStop] = useState(false)

  // Ação de localizar e focar o ponto de embarque mais próximo que REALMENTE atende a rota
  const handlePontoMaisProximo = () => {
    setIsLocatingStop(true)

    const finishWithCoords = (coords: [number, number] | null) => {
      setIsLocatingStop(false)
      dispatchFocusClosestStop({
        origem,
        destino,
        userCoords: coords,
      })
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          finishWithCoords([pos.coords.latitude, pos.coords.longitude])
        },
        () => {
          finishWithCoords(null)
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
      )
    } else {
      finishWithCoords(null)
    }
  }

  const diaHojeNome = useMemo(() => getDiaSemanaHoje(), [])
  const diaAmanhaNome = useMemo(() => getDiaSemanaOffset(1), [])

  // Relógio em tempo real atualizado a cada 30 segundos
  const [agora, setAgora] = useState(() => new Date())
  useEffect(() => {
    const interval = setInterval(() => setAgora(new Date()), 30000)
    return () => clearInterval(interval)
  }, [])

  // Obter hora atual formatada (HH:MM)
  const horaAtualString = useMemo(() => {
    const hh = String(agora.getHours()).padStart(2, "0")
    const mm = String(agora.getMinutes()).padStart(2, "0")
    return `${hh}:${mm}`
  }, [agora])

  // Resetar viagens passadas e expansores quando a rota ou dia mudam
  useEffect(() => {
    setMostrarViagensPassadas(false)
    setMostrarTodosHorarios(false)
  }, [origem, destino, filtroDia])

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

  const toggleCardExpansion = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Estrutura inteligente para identificar a próxima saída e status de hoje / amanhã
  const proximaSaidaInfo = useMemo(() => {
    if (!origem || !destino) return null

    // Quando o filtro for "amanha"
    if (filtroDia === "amanha") {
      if (horariosFiltrados.length === 0) return null
      const primeiro = horariosFiltrados[0]
      return {
        isHoje: false,
        isAmanha: true,
        isEncerradoHoje: false,
        diaBadge: `Primeira Saída • Amanhã (${diaAmanhaNome})`,
        diaNome: "Amanhã",
        diaSemanaNome: diaAmanhaNome,
        diaSubtitulo: `Saída programada do terminal às ${primeiro.horario}`,
        proximoHorario: primeiro,
        horariosSubsequentes: horariosFiltrados.filter((h) => h.id !== primeiro.id),
        totalHorarios: horariosFiltrados.length,
        alertaEncerramento: null,
      }
    }

    // Quando o filtro NÃO for "hoje" nem "amanha" (o usuário escolheu manualmente um dia ou "todos")
    if (filtroDia !== "hoje") {
      if (horariosFiltrados.length === 0) return null
      const primeiro = horariosFiltrados[0]
      const labelMap: Record<string, string> = {
        semana: "Seg a Sex",
        sabado: "Sábado",
        domingo: "Domingo",
        todos: "Todos os dias",
      }
      const labelFiltro = labelMap[filtroDia] || filtroDia

      return {
        isHoje: false,
        isAmanha: false,
        isEncerradoHoje: false,
        diaBadge: `Programado (${labelFiltro})`,
        diaNome: labelFiltro,
        diaSemanaNome: labelFiltro,
        diaSubtitulo: `Saída programada do terminal às ${primeiro.horario}`,
        proximoHorario: primeiro,
        horariosSubsequentes: horariosFiltrados.filter((h) => h.id !== primeiro.id),
        totalHorarios: horariosFiltrados.length,
        alertaEncerramento: null,
      }
    }

    // Quando o filtro É "hoje":
    // 1. Procurar se ainda há van hoje com horário >= hora atual
    const saidaRestanteHoje = horariosFiltrados.find((h) => h.horario >= horaAtualString)

    if (saidaRestanteHoje) {
      // ✅ AINDA HÁ VAN HOJE!
      const [h, m] = saidaRestanteHoje.horario.split(":").map(Number)
      const saida = new Date(agora)
      saida.setHours(h, m, 0, 0)
      const diffMs = saida.getTime() - agora.getTime()
      const diffMin = Math.round(diffMs / 60000)

      let tempoTexto = `Saída programada do terminal às ${saidaRestanteHoje.horario}`
      if (diffMin > 0 && diffMin <= 60) {
        tempoTexto = `Saída programada do terminal às ${saidaRestanteHoje.horario} • Em ${diffMin} min`
      } else if (diffMin > 60) {
        const horas = Math.floor(diffMin / 60)
        const mins = diffMin % 60
        tempoTexto = `Saída programada do terminal às ${saidaRestanteHoje.horario} • Em ${horas}h${mins > 0 ? ` ${mins}m` : ""}`
      }

      return {
        isHoje: true,
        isAmanha: false,
        isEncerradoHoje: false,
        diaBadge: `Próxima Saída • Hoje (${diaHojeNome})`,
        diaNome: "Hoje",
        diaSemanaNome: diaHojeNome,
        diaSubtitulo: tempoTexto,
        proximoHorario: saidaRestanteHoje,
        horariosSubsequentes: horariosFiltrados.filter((h) => h.id !== saidaRestanteHoje.id),
        totalHorarios: horariosFiltrados.length,
        alertaEncerramento: null,
      }
    }

    // 🌙 NÃO HÁ MAIS SAÍDAS HOJE (ou não opera hoje)!
    // Vamos buscar nos próximos dias (Amanhã offset=1, depois de amanhã offset=2, etc.)
    let offsetEncontrado = 1
    let proximoAmanha: HorarioFormatado | null = null
    let horariosDiaAmanha: HorarioFormatado[] = []
    let diaSemanaNome = ""

    for (let offset = 1; offset <= 7; offset++) {
      const diaNome = getDiaSemanaOffset(offset)
      const saidasProxDia = buscarHorariosRota(origem, destino, diaNome, filtroVia)
      if (saidasProxDia.length > 0) {
        offsetEncontrado = offset
        proximoAmanha = saidasProxDia[0]
        horariosDiaAmanha = saidasProxDia
        diaSemanaNome = diaNome
        break
      }
    }

    if (proximoAmanha) {
      const isAmanha = offsetEncontrado === 1
      const labelDia = isAmanha ? "Amanhã" : diaSemanaNome

      // Calcular tempo restante até a primeira saída do dia seguinte
      const [h, m] = proximoAmanha.horario.split(":").map(Number)
      const targetDate = new Date(agora)
      targetDate.setDate(targetDate.getDate() + offsetEncontrado)
      targetDate.setHours(h, m, 0, 0)
      const diffMs = targetDate.getTime() - agora.getTime()
      const diffMin = Math.max(0, Math.round(diffMs / 60000))
      const horas = Math.floor(diffMin / 60)
      const mins = diffMin % 60
      const tempoAteSaida = `Em ${horas}h${mins > 0 ? ` ${mins}m` : ""}`

      const mensagemAlerta = isAmanha
        ? `As viagens de hoje foram encerradas. A próxima van disponível sairá amanhã (${diaSemanaNome}) às ${proximoAmanha.horario}.`
        : `Não há partidas programadas para hoje nem amanhã. A próxima van disponível sairá na ${diaSemanaNome} às ${proximoAmanha.horario}.`

      return {
        isHoje: false,
        isAmanha,
        isEncerradoHoje: true,
        diaBadge: isAmanha ? `Próxima Saída • Amanhã (${diaSemanaNome})` : `Próxima Saída • ${diaSemanaNome}`,
        diaNome: labelDia,
        diaSemanaNome,
        diaSubtitulo: `Primeira saída amanhã às ${proximoAmanha.horario} • ${tempoAteSaida}`,
        proximoHorario: proximoAmanha,
        horariosSubsequentes: horariosDiaAmanha.filter((h) => h.id !== proximoAmanha?.id),
        totalHorarios: horariosDiaAmanha.length,
        alertaEncerramento: mensagemAlerta,
      }
    }

    // Fallback caso seja rota sem horários
    if (horariosFiltrados.length === 0) return null
    return {
      isHoje: false,
      isAmanha: false,
      isEncerradoHoje: true,
      diaBadge: "Horário Programado",
      diaNome: "Programado",
      diaSemanaNome: diaHojeNome,
      diaSubtitulo: "Partida programada",
      proximoHorario: horariosFiltrados[0],
      horariosSubsequentes: horariosFiltrados.slice(1),
      totalHorarios: horariosFiltrados.length,
      alertaEncerramento: "Viagens de hoje já finalizadas.",
    }
  }, [origem, destino, filtroDia, filtroVia, horariosFiltrados, horaAtualString, diaHojeNome, diaAmanhaNome, agora])

  const proximoHorario = proximaSaidaInfo?.proximoHorario || null
  const horariosSubsequentes = proximaSaidaInfo?.horariosSubsequentes || []

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
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-[0_12px_36px_-6px_rgba(0,56,168,0.12)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] border border-slate-200/90 dark:border-slate-800/90 p-3.5 sm:p-5 relative z-10">
          <div className="relative flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] md:items-center gap-2 sm:gap-3">
            
            {/* Origin Input Card (Azul Alagoas) */}
            <div className="w-full">
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
                    </div>

                    <div className="grow min-w-0">
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#0038A8] dark:text-blue-400 mb-0.5">
                        De onde? (Origem)
                      </span>
                      <p className={cn("text-lg sm:text-xl font-extrabold truncate", !origem ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100")}>
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
                      </div>

                      <div className="grow min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-wider text-[#0038A8] dark:text-blue-400 mb-0.5">
                          De onde? (Origem)
                        </span>
                        <p className={cn("text-lg sm:text-xl font-extrabold truncate", !origem ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100")}>
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
            </div>

            {/* Central Swap Button (Mobile stacked in center / Desktop between inputs) */}
            <div className="flex justify-center -my-2.5 md:my-0 z-20 shrink-0">
              <motion.button
                type="button"
                aria-label="Inverter Rota"
                onClick={handleInverterSentido}
                disabled={!origem && !destino}
                title="Inverter Sentido (Origem ↔ Destino)"
                whileTap={{ scale: 0.9, rotate: 180 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className={cn(
                  "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-full shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none hover:border-[#0038A8]/40 ring-2 ring-transparent hover:ring-[#0038A8]/20",
                  isSwapping && "border-[#0038A8]"
                )}
              >
                <ArrowsDownUp
                  size={18}
                  weight="bold"
                  className={cn(
                    "text-[#0038A8] dark:text-blue-400 transition-transform duration-300 md:hidden",
                    isSwapping && "rotate-180"
                  )}
                />
                <ArrowsLeftRight
                  size={20}
                  weight="bold"
                  className={cn(
                    "text-[#0038A8] dark:text-blue-400 transition-transform duration-300 hidden md:block",
                    isSwapping && "scale-x-[-1]"
                  )}
                />
              </motion.button>
            </div>

            {/* Destination Input Card (Vermelho Alagoas) */}
            <div className="w-full">
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
                      <span className="block text-xs font-bold uppercase tracking-wider text-[#D62828] dark:text-red-400 mb-0.5">
                        Para onde? (Destino)
                      </span>
                      <p className={cn("text-lg sm:text-xl font-extrabold truncate", !destino ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100")}>
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
                        <span className="block text-xs font-bold uppercase tracking-wider text-[#D62828] dark:text-red-400 mb-0.5">
                          Para onde? (Destino)
                        </span>
                        <p className={cn("text-lg sm:text-xl font-extrabold truncate", !destino ? "text-slate-500 dark:text-slate-400" : "text-slate-900 dark:text-slate-100")}>
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

          </div>
        </div>
      </section>

      {/* 🗓️ Filters & Day Selection */}
      {origem && destino && (
        <section className="space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center px-1">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarBlank size={18} weight="bold" className="text-[#0038A8]" />
              Dia da viagem
            </h2>
          </div>

          {/* Day Horizontal Scroll Selector */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x px-0.5">
            {[
              {
                id: "hoje",
                label: proximaSaidaInfo?.isEncerradoHoje ? `Hoje (${diaHojeNome}) • Encerrado` : `Hoje (${diaHojeNome})`,
              },
              {
                id: "amanha",
                label: `Amanhã (${diaAmanhaNome})`,
              },
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
                  "snap-start shrink-0 h-10 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 border flex items-center justify-center gap-1.5",
                  filtroDia === item.id
                    ? "bg-[#0038A8] text-white border-[#0038A8] shadow-sm shadow-[#0038A8]/20"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* 🔍 Route Type / Via Chips - Centralizadas */}
          {viasDisponiveis.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 px-0.5">
              <button
                type="button"
                onClick={() => setFiltroVia("todas")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5",
                  filtroVia === "todas"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 border-blue-300 dark:border-blue-800 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300"
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
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5",
                    filtroVia === via
                      ? "bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 border-blue-300 dark:border-blue-800 shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-300"
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
          (proximaSaidaInfo && proximaSaidaInfo.proximoHorario) || horariosFiltrados.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-400">
              
              {/* Header do Quadro */}
              <div className="flex items-center justify-between px-1">
                <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock size={20} weight="bold" className="text-[#0038A8]" />
                  {proximaSaidaInfo?.isEncerradoHoje
                    ? `Saídas para ${proximaSaidaInfo.diaNome} (${proximaSaidaInfo.diaSemanaNome})`
                    : "Saídas encontradas"}
                </h2>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {proximaSaidaInfo?.totalHorarios || horariosFiltrados.length}{" "}
                  {(proximaSaidaInfo?.totalHorarios || horariosFiltrados.length) === 1 ? "Horário" : "Horários"}
                </span>
              </div>

              {/* 🌙 Alerta em Destaque quando as viagens de HOJE já encerraram */}
              {proximaSaidaInfo?.isEncerradoHoje && (
                <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700/80 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 p-4 sm:p-5 shadow-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-700/50 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300 shadow-xs">
                      <MoonStars size={22} weight="fill" />
                    </div>
                    <div className="grow space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/80 text-amber-950 dark:text-amber-200">
                          Viagens de Hoje Encerradas
                        </span>
                        <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                          {diaHojeNome}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm sm:text-base text-amber-950 dark:text-amber-100">
                        Não há mais vans saindo hoje de {origem} para {destino}
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-medium leading-relaxed">
                        {proximaSaidaInfo.alertaEncerramento}
                      </p>
                    </div>
                  </div>

                  {/* Ações diretas recomendadas */}
                  <div className="flex flex-wrap gap-2 pt-1 sm:pl-[52px]">
                    <Button
                      type="button"
                      onClick={() => setFiltroDia("amanha")}
                      className="h-10 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                    >
                      <CalendarBlank size={15} className="mr-1.5" weight="bold" />
                      Ver saídas de amanhã ({diaAmanhaNome})
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleInverterSentido}
                      className="h-10 px-4 rounded-xl border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200 font-bold text-xs"
                    >
                      <ArrowsDownUp size={15} className="mr-1.5" weight="bold" />
                      Inverter rota ({destino} → {origem})
                    </Button>
                  </div>
                </div>
              )}

              {/* 🌟 Next Departure Featured Card (Hierarquia Estrita, Fundo Sólido Limpo) */}
              {proximoHorario && (
                <article
                  className={cn(
                    "bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-sm border overflow-hidden relative transition-all",
                    proximaSaidaInfo?.isEncerradoHoje
                      ? "border-amber-300 dark:border-amber-800/80 shadow-amber-500/5"
                      : "border-slate-200 dark:border-slate-800 hover:border-[#0038A8]/40"
                  )}
                >
                  {/* Subtle Top Accent Line */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 right-0 h-1.5",
                      proximaSaidaInfo?.isEncerradoHoje
                        ? "bg-amber-500"
                        : "bg-[#0038A8]"
                    )}
                  />

                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Departure Badge & Tabular Time */}
                    <div className="flex justify-between items-start gap-4">
                      {proximaSaidaInfo?.isEncerradoHoje ? (
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-3.5 py-1.5 rounded-full shadow-xs">
                          <MoonStars size={16} weight="fill" className="text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-extrabold uppercase tracking-wide">
                            {proximaSaidaInfo.diaBadge}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 px-3.5 py-1.5 rounded-full shadow-xs">
                          <Clock size={16} weight="bold" />
                          <span className="text-xs font-extrabold uppercase tracking-wide">
                            {proximaSaidaInfo?.diaBadge || "Próxima Saída"}
                          </span>
                        </div>
                      )}

                      <div className="text-right">
                        <div className="tabular-nums text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-normal leading-none">
                          {proximoHorario.horario}
                        </div>
                        <div
                          className={cn(
                            "text-xs sm:text-sm font-semibold mt-1.5 text-right leading-tight",
                            proximaSaidaInfo?.isEncerradoHoje
                              ? "text-amber-800 dark:text-amber-300"
                              : "text-slate-600 dark:text-slate-400"
                          )}
                        >
                          <span>{proximaSaidaInfo?.diaSubtitulo || `Saída programada às ${proximoHorario.horario}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="space-y-2">
                      {/* Trajeto Principal */}
                      <div className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-2.5 flex-wrap tracking-tight">
                        <span>{proximoHorario.origem}</span>
                        <ArrowRight size={22} weight="bold" className="text-[#0038A8] dark:text-blue-400 shrink-0" />
                        <span className="text-[#0038A8] dark:text-blue-400">{proximoHorario.destino}</span>
                      </div>

                      {/* Ponto de Embarque Context */}
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        <MapPin size={16} weight="fill" className="text-[#0038A8] dark:text-blue-400 shrink-0" />
                        <span>Ponto de Partida: <strong>{proximoHorario.origem === "Maceió" ? "Terminal Rodoviário e Pontos Autorizados" : `Terminal de ${proximoHorario.origem}`}</strong></span>
                      </div>

                      {/* Detalhes da Linha */}
                      <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm pt-0.5">
                        <span className="tabular-nums font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-md">
                          Linha {proximoHorario.codigoLinha}
                        </span>
                        {proximoHorario.via && (
                          <span className="font-bold text-[#0038A8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Path size={14} weight="bold" />
                            Via {proximoHorario.via}
                          </span>
                        )}
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <CalendarBlank size={15} />
                          {proximoHorario.dias.length === 7 ? "Circula Diariamente" : proximoHorario.dias.join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Actions Row (Altura h-12 para ergonomia de toque) */}
                    <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                      {/* Ação Principal: Ver Ponto de Embarque */}
                      <Button
                        type="button"
                        onClick={handlePontoMaisProximo}
                        disabled={isLocatingStop}
                        className="h-12 px-6 flex-1 bg-[#0038A8] hover:bg-[#002b80] text-white font-extrabold rounded-xl text-sm shadow-md shadow-[#0038A8]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                        <MapPin
                          size={18}
                          weight="fill"
                          className={cn(isLocatingStop ? "animate-spin text-white" : "text-white")}
                        />
                        <span>{isLocatingStop ? "Localizando Ponto..." : "Ver Ponto de Embarque"}</span>
                      </Button>

                      {/* Ação Secundária: Detalhes da Linha */}
                      <Button
                        asChild
                        variant="outline"
                        className="h-12 px-5 rounded-xl font-bold text-sm border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all active:scale-[0.98]"
                      >
                        <Link href={`/routes/${proximoHorario.codigoLinha}`}>
                          <Info size={18} className="mr-1.5" weight="bold" />
                          Detalhes da Linha
                        </Link>
                      </Button>
                    </div>

                  </div>
                </article>
              )}

              {/* 📋 Subsequent Departure Cards List (Com Expansor de Saídas) */}
              {horariosSubsequentes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={15} weight="bold" className="text-[#0038A8] dark:text-blue-400" />
                      {proximaSaidaInfo?.isEncerradoHoje
                        ? `Outras Saídas de ${proximaSaidaInfo.diaNome} (${proximaSaidaInfo.diaSemanaNome})`
                        : "Próximas Saídas"}
                    </h3>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {horariosSubsequentes.length} {horariosSubsequentes.length === 1 ? "saída" : "saídas"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {(mostrarTodosHorarios ? horariosSubsequentes : horariosSubsequentes.slice(0, 4)).map((item) => {
                      const isExpanded = !!expandedCards[item.id]

                      return (
                        <article
                          key={item.id}
                          className="bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 p-4 transition-all hover:border-[#0038A8]/40 dark:hover:border-slate-700"
                        >
                          <div className="flex items-center gap-4">
                            {/* Tabular Time Badge */}
                            <div className="shrink-0 text-center w-20 sm:w-24 border-r border-slate-200 dark:border-slate-800 pr-3">
                              <div className="tabular-nums text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-normal">
                                {item.horario}
                              </div>
                              <div
                                className={cn(
                                  "text-xs font-bold uppercase tracking-wider mt-0.5",
                                  proximaSaidaInfo?.isEncerradoHoje
                                    ? "text-amber-700 dark:text-amber-400 font-extrabold"
                                    : "text-slate-500 dark:text-slate-400"
                                )}
                              >
                                {proximaSaidaInfo?.isEncerradoHoje ? proximaSaidaInfo.diaNome : "Partida"}
                              </div>
                            </div>

                            {/* Center Info */}
                            <div className="grow min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                                  Linha {item.codigoLinha}
                                </span>
                                {item.via ? (
                                  <span className="text-xs font-bold text-[#0038A8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Path size={12} weight="bold" />
                                    Via {item.via}
                                  </span>
                                ) : (
                                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                    Direto
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                <CalendarBlank size={13} />
                                <span>{item.dias.length === 7 ? "Diariamente" : item.dias.slice(0, 3).join(", ")}</span>
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
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm space-y-2 animate-in fade-in duration-200">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-900 dark:text-slate-100">Trajeto: {item.origem} → {item.destino}</span>
                                <Link
                                  href={`/routes/${item.codigoLinha}`}
                                  className="text-[#0038A8] dark:text-blue-400 hover:underline font-bold text-xs inline-flex items-center gap-1"
                                >
                                  Página da Linha <ArrowSquareOut size={14} />
                                </Link>
                              </div>
                              {item.itinerario?.ida && (
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed"><strong className="text-slate-900 dark:text-slate-100">Itinerário:</strong> {item.itinerario.ida}</p>
                              )}
                            </div>
                          )}
                        </article>
                      )
                    })}
                  </div>

                  {/* Expander Button if more than 4 departures */}
                  {horariosSubsequentes.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setMostrarTodosHorarios((v) => !v)}
                      className="w-full h-12 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.99]"
                    >
                      {mostrarTodosHorarios ? (
                        <>
                          <CaretUp size={16} weight="bold" className="text-[#0038A8] dark:text-blue-400" />
                          <span>Mostrar menos saídas</span>
                        </>
                      ) : (
                        <>
                          <CaretDown size={16} weight="bold" className="text-[#0038A8] dark:text-blue-400" />
                          <span>Ver todos os horários ({horariosSubsequentes.length} saídas programadas)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* 🕒 Seção de Viagens de Hoje já realizadas */}
              {proximaSaidaInfo?.isEncerradoHoje && horariosFiltrados.length > 0 && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMostrarViagensPassadas((v) => !v)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      {mostrarViagensPassadas
                        ? `Ocultar viagens de hoje (${diaHojeNome}) já finalizadas`
                        : `Ver viagens de hoje (${diaHojeNome}) que já encerraram (${horariosFiltrados.length})`}
                    </span>
                    {mostrarViagensPassadas ? <CaretUp size={16} /> : <CaretDown size={16} />}
                  </button>

                  {mostrarViagensPassadas && (
                    <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                        Estes horários operaram mais cedo hoje ({diaHojeNome}) e já foram finalizados:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 opacity-75">
                        {horariosFiltrados.map((passado) => (
                          <div
                            key={`passado-${passado.id}`}
                            className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="tabular-nums font-extrabold text-sm text-slate-600 dark:text-slate-300">
                                {passado.horario}
                              </span>
                              <span className="text-slate-700 dark:text-slate-300 truncate max-w-[180px] font-medium">
                                <strong className="text-slate-900 dark:text-slate-100">{passado.origem} → {passado.destino}</strong> (Linha {passado.codigoLinha})
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase">
                              Encerrado
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Clock size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  Nenhum horário encontrado para este dia
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm">
                  Esta rota pode operar em outros dias ou com itinerários alternativos.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <Button
                  type="button"
                  onClick={() => setFiltroDia("todos")}
                  className="h-10 px-4 rounded-xl bg-[#0038A8] hover:bg-[#002b80] text-white font-bold text-xs"
                >
                  Ver todos os dias
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleInverterSentido}
                  className="h-10 px-4 rounded-xl font-bold text-xs"
                >
                  Inverter sentido ({destino} → {origem})
                </Button>
              </div>
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
