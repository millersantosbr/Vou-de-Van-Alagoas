"use client"

import { useState, useEffect, useMemo, useTransition } from "react"
import { Label } from "@/components/ui/label"
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
  MapPin,
  ArrowRight,
  Clock,
  Search,
  Check,
  ChevronsUpDown,
  ArrowUpDown,
  Calendar,
  Info,
  Route,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield,
  Filter,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export default function HomeContent() {
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

  // Obter hora atual formatada (HH:MM) para destacar próximas saídas
  const horaAtualString = useMemo(() => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, "0")
    const mm = String(now.getMinutes()).padStart(2, "0")
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
      setDestino("")
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

  // Inverter origem e destino (Swap)
  const handleInverterSentido = () => {
    if (!origem && !destino) return
    setIsSwapping(true)
    startTransition(() => {
      const antigaOrigem = origem
      const antigoDestino = destino

      setOrigem(antigoDestino)
      setDestino(antigaOrigem)
      setExpandedCards({})
      setTimeout(() => setIsSwapping(false), 400)
    })
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

  // Identificar o primeiro horário seguinte ao horário atual (se o filtro for "hoje")
  const proximoHorarioId = useMemo(() => {
    if (filtroDia !== "hoje" || horariosFiltrados.length === 0) return null
    const proximo = horariosFiltrados.find((h) => h.horario >= horaAtualString)
    return proximo ? proximo.id : null
  }, [filtroDia, horariosFiltrados, horaAtualString])

  return (
    <div className="space-y-8">
      {/* Searchable Selectors with Swap Feature */}
      <div className="grid grid-cols-1 gap-3 relative">
        {/* Origem */}
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-primary" />
            Saindo de (Origem)
          </Label>
          <Popover open={openOrigem} onOpenChange={(open) => startTransition(() => setOpenOrigem(open))}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openOrigem}
                className={cn(
                  "w-full h-16 px-4 bg-background/90 border-border/40 rounded-2xl shadow-sm hover:bg-background transition-all flex items-center justify-between",
                  isPending && "opacity-80"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-left truncate">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cidade de Partida</p>
                    <p className={cn("text-base font-black truncate", !origem && "text-muted-foreground")}>
                      {origem ? origem : "Selecione a origem..."}
                    </p>
                  </div>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden" align="start">
              <Command className="w-full">
                <CommandInput placeholder="Pesquisar cidade de origem..." className="h-12 border-none focus:ring-0 font-bold" />
                <CommandList className="max-h-[320px] overflow-y-auto scrollbar-hide">
                  <CommandEmpty className="py-6 text-center text-sm font-medium text-muted-foreground">Nenhuma cidade encontrada.</CommandEmpty>
                  <CommandGroup>
                    {listaCidades.map((cidade) => (
                      <CommandItem
                        key={cidade}
                        value={cidade}
                        onSelect={handleOrigemSelect}
                        className="py-3.5 px-4 text-base font-bold flex items-center justify-between cursor-pointer"
                      >
                        {cidade}
                        <Check
                          className={cn(
                            "h-4 w-4 text-primary",
                            origem === cidade ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Botão de Inverter Sentido (Swap) */}
        <div className="flex justify-center -my-2.5 z-20">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleInverterSentido}
            disabled={!origem && !destino}
            title="Inverter Origem e Destino"
            className={cn(
              "w-11 h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md border-4 border-background transition-transform active:scale-90",
              isSwapping && "rotate-180 duration-300"
            )}
          >
            <ArrowUpDown size={18} strokeWidth={2.5} />
          </Button>
        </div>

        {/* Destino */}
        <div className="space-y-2">
          <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/80 ml-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Indo para (Destino)
          </Label>
          <Popover open={openDestino} onOpenChange={(open) => startTransition(() => setOpenDestino(open))}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDestino}
                disabled={!origem}
                className={cn(
                  "w-full h-16 px-4 bg-background/90 border-border/40 rounded-2xl shadow-sm hover:bg-background transition-all flex items-center justify-between disabled:opacity-60",
                  isPending && "opacity-80"
                )}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-blue-500 rotate-180" size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-left truncate">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cidade de Chegada</p>
                    <p className={cn("text-base font-black truncate", !destino && "text-muted-foreground")}>
                      {destino ? destino : "Selecione o destino..."}
                    </p>
                  </div>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden" align="start">
              <Command className="w-full">
                <CommandInput placeholder="Pesquisar cidade de destino..." className="h-12 border-none focus:ring-0 font-bold" />
                <CommandList className="max-h-[320px] overflow-y-auto scrollbar-hide">
                  <CommandEmpty className="py-6 text-center text-sm font-medium text-muted-foreground">Nenhum destino encontrado a partir desta origem.</CommandEmpty>
                  <CommandGroup>
                    {destinos.map((cidade) => (
                      <CommandItem
                        key={cidade}
                        value={cidade}
                        onSelect={handleDestinoSelect}
                        className="py-3.5 px-4 text-base font-bold flex items-center justify-between cursor-pointer"
                      >
                        {cidade}
                        <Check
                          className={cn(
                            "h-4 w-4 text-primary",
                            destino === cidade ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 🗓️ Filtro por Dia da Semana */}
      {origem && destino && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              Dia da Viagem
            </Label>
            {filtroDia === "hoje" && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                Hoje é {diaHojeNome}
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { id: "hoje", label: "Hoje", subtitle: diaHojeNome },
              { id: "semana", label: "Seg a Sex", subtitle: "Dias Úteis" },
              { id: "sabado", label: "Sábado", subtitle: "Fim de Sem." },
              { id: "domingo", label: "Domingo", subtitle: "Fim de Sem." },
              { id: "todos", label: "Todos", subtitle: "Semana Toda" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFiltroDia(item.id as FiltroDia)}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-center transition-all border",
                  filtroDia === item.id
                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]"
                    : "bg-card border-border/50 text-foreground/80 hover:bg-muted/50 hover:border-border"
                )}
              >
                <span className="text-xs font-black">{item.label}</span>
                <span className={cn(
                  "text-[9px] font-semibold opacity-70",
                  filtroDia === item.id ? "text-primary-foreground" : "text-muted-foreground"
                )}>
                  {item.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔍 Filtro por Via / Cidades Intermediárias */}
      {origem && destino && viasDisponiveis.length > 0 && (
        <div className="space-y-2 pt-2">
          <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-1.5 px-1">
            <Route size={14} className="text-primary" />
            Filtrar por Percurso / Via
          </Label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFiltroVia("todas")}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                filtroVia === "todas"
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "bg-card text-muted-foreground border-border/50 hover:border-border"
              )}
            >
              Todas as Vias
            </button>
            {viasDisponiveis.map((via) => (
              <button
                key={via}
                type="button"
                onClick={() => setFiltroVia(via)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5",
                  filtroVia === via
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-foreground/80 border-border/50 hover:border-border"
                )}
              >
                <span>Via {via}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🗺️ Resultados / Cards de Horários */}
      <div className="relative pt-4">
        {origem && destino ? (
          horariosFiltrados.length > 0 ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Header do Painel */}
              <div className="flex items-center justify-between pb-3 border-b border-border/20 px-1">
                <div className="space-y-0.5">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <Clock size={13} className="text-primary" strokeWidth={3} />
                    Painel de Saídas ARSAL
                  </h3>
                  <p className="text-[11px] font-bold text-primary">
                    {horariosFiltrados.length} {horariosFiltrados.length === 1 ? "saída encontrada" : "saídas encontradas"}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest leading-none">ARSAL Oficial</span>
                </div>
              </div>

              {/* Lista de Cards */}
              <div className="grid grid-cols-1 gap-4">
                {horariosFiltrados.map((item) => {
                  const isProximo = item.id === proximoHorarioId
                  const isExpanded = !!expandedCards[item.id]

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "transition-all bg-card border rounded-[1.8rem] shadow-sm hover:shadow-md overflow-hidden",
                        isProximo
                          ? "border-primary/60 ring-2 ring-primary/20 bg-primary/[0.02]"
                          : "border-border/60 hover:border-primary/30"
                      )}
                    >
                      <div className="p-5 sm:p-6 space-y-4">
                        {/* Top Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                              <Shield size={10} /> Linha {item.codigoLinha}
                            </span>
                            {item.area && (
                              <span className="text-[10px] font-black bg-muted text-muted-foreground px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {item.area}
                              </span>
                            )}
                            {item.extensao && (
                              <span className="text-[10px] font-bold bg-muted/60 text-muted-foreground px-2.5 py-1 rounded-full">
                                📍 {item.extensao}
                              </span>
                            )}
                          </div>

                          {isProximo && (
                            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
                              <Sparkles size={11} />
                              <span className="text-[10px] font-black uppercase tracking-wider">Próxima Saída</span>
                            </div>
                          )}
                        </div>

                        {/* Rota & Via */}
                        <div className="py-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">
                            Trajeto Autorizado
                          </p>
                          <div className="flex items-center gap-2 overflow-hidden flex-wrap text-foreground">
                            <span className="text-base font-black truncate">{item.origem}</span>
                            <ArrowRight size={14} className="flex-shrink-0 text-primary" />
                            <span className="text-base font-bold text-muted-foreground truncate">{item.destino}</span>
                          </div>
                          {item.via && (
                            <p className="text-xs font-semibold text-primary/80 mt-1 flex items-center gap-1">
                              <Route size={12} className="flex-shrink-0" />
                              Via: <span className="underline decoration-primary/30">{item.via}</span>
                            </p>
                          )}
                        </div>

                        {/* Horário & Dias de Operação */}
                        <div className="pt-2 border-t border-border/10 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">
                              Horário de Saída
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-4xl sm:text-5xl font-black text-primary tracking-tighter leading-none">
                                {item.horario}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">
                              Frequência
                            </p>
                            <div className="flex flex-wrap justify-end gap-1 max-w-[170px]">
                              {item.dias.length === 7 ? (
                                <span className="text-[10px] font-bold bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-md">
                                  Diariamente
                                </span>
                              ) : (
                                item.dias.map((d) => (
                                  <span
                                    key={d}
                                    className={cn(
                                      "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                                      d === diaHojeNome
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {d.slice(0, 3)}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Botão de Detalhes Expansíveis */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => toggleCardExpansion(item.id)}
                            className="w-full py-2.5 px-3 rounded-xl bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground text-xs font-bold flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Info size={14} className="text-primary" />
                              {isExpanded ? "Ocultar Detalhes da Linha" : "Ver Itinerário e Regulamentação ARSAL"}
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>

                          {/* Conteúdo Expansível */}
                          {isExpanded && (
                            <div className="mt-3 p-4 rounded-2xl bg-muted/30 border border-border/40 text-xs space-y-3 animate-in fade-in duration-300">
                              <div>
                                <p className="font-black text-foreground uppercase tracking-wider text-[10px] mb-0.5">Nome Oficial da Linha:</p>
                                <p className="text-muted-foreground font-semibold">{item.nomeLinha}</p>
                              </div>

                              {item.itinerario?.ida && (
                                <div>
                                  <p className="font-black text-foreground uppercase tracking-wider text-[10px] mb-0.5">Itinerário de Ida:</p>
                                  <p className="text-muted-foreground leading-relaxed">{item.itinerario.ida}</p>
                                </div>
                              )}

                              {item.itinerario?.volta && (
                                <div>
                                  <p className="font-black text-foreground uppercase tracking-wider text-[10px] mb-0.5">Itinerário de Volta:</p>
                                  <p className="text-muted-foreground leading-relaxed">{item.itinerario.volta}</p>
                                </div>
                              )}

                              {item.itinerario?.seccionamentos && (
                                <div>
                                  <p className="font-black text-foreground uppercase tracking-wider text-[10px] mb-0.5">Seccionamentos / Paradas Intermediárias:</p>
                                  <p className="text-muted-foreground leading-relaxed">{item.itinerario.seccionamentos}</p>
                                </div>
                              )}

                              {item.itinerario?.observacoes && (
                                <div>
                                  <p className="font-black text-foreground uppercase tracking-wider text-[10px] mb-0.5">Observações / Portarias:</p>
                                  <p className="text-muted-foreground leading-relaxed">{item.itinerario.observacoes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 rounded-[2.5rem] bg-secondary/10 border-2 border-dashed border-border/30 text-center">
              <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-md mb-4 text-muted-foreground">
                <Clock size={28} strokeWidth={1.5} />
              </div>
              <h4 className="text-base font-bold text-foreground">Nenhum horário encontrado para este dia</h4>
              <p className="text-muted-foreground text-xs max-w-[280px] mt-1.5 leading-relaxed">
                Tente alterar o filtro de dia da semana ou selecionar outra via para conferir mais saídas.
              </p>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 rounded-[2.5rem] bg-secondary/5 border-2 border-dashed border-border/20 text-center">
            <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-md mb-4 text-primary/60">
              <Search size={28} strokeWidth={1.5} />
            </div>
            <h4 className="text-base font-bold text-foreground">Inicie sua consulta</h4>
            <p className="text-muted-foreground text-xs max-w-[240px] mt-1.5 leading-relaxed">
              Selecione a cidade de origem e destino para consultar todos os horários oficiais da ARSAL.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
