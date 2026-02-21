"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { busSchedules } from "@/lib/bus-data"
import { MapPin, ArrowRight, Clock, Search, Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

export default function HomeContent() {
  const [origem, setOrigem] = useState<string>("")
  const [destino, setDestino] = useState<string>("")
  const [destinos, setDestinos] = useState<string[]>([])
  const [horariosFiltrados, setHorariosFiltrados] = useState<string[]>([])

  const [openOrigem, setOpenOrigem] = useState(false)
  const [openDestino, setOpenDestino] = useState(false)

  // Lista de cidades de origem
  const origens = Object.keys(busSchedules).sort()

  // Atualiza destinos quando a origem muda
  useEffect(() => {
    if (origem) {
      const destinosDisponiveis = Object.keys(busSchedules[origem] || {}).sort()
      setDestinos(destinosDisponiveis)
      // Se o destino atual não estiver na nova lista, reseta para o primeiro
      if (!destinosDisponiveis.includes(destino)) {
        setDestino(destinosDisponiveis[0] || "")
      }
    } else {
      setDestinos([])
      setDestino("")
    }
  }, [origem])

  // Atualiza horários quando o destino muda
  useEffect(() => {
    if (origem && destino && busSchedules[origem] && busSchedules[origem][destino]) {
      setHorariosFiltrados(busSchedules[origem][destino])
    } else {
      setHorariosFiltrados([])
    }
  }, [origem, destino])

  return (
    <div className="space-y-8">
      {/* Mobile-optimized Searchable Selectors */}
      <div className="grid grid-cols-1 gap-4 relative">
        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">
            Saindo de
          </Label>
          <Popover open={openOrigem} onOpenChange={setOpenOrigem}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openOrigem}
                className="w-full h-16 px-4 bg-background border-border/40 rounded-2xl shadow-sm hover:bg-background/80 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <MapPin className="text-primary flex-shrink-0" size={18} strokeWidth={2.5} />
                  <span className={cn("text-base font-bold truncate", !origem && "text-muted-foreground")}>
                    {origem ? origem : "Cidade de Origem"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden" align="start">
              <Command className="w-full">
                <CommandInput placeholder="Pesquisar cidade..." className="h-12 border-none focus:ring-0 font-bold" />
                <CommandList className="max-h-[300px] overflow-y-auto scrollbar-hide">
                  <CommandEmpty className="py-6 text-center text-sm font-medium text-muted-foreground">Cidade não encontrada.</CommandEmpty>
                  <CommandGroup>
                    {origens.map((cidade) => (
                      <CommandItem
                        key={cidade}
                        value={cidade}
                        onSelect={(currentValue) => {
                          setOrigem(currentValue === origem ? "" : currentValue)
                          setOpenOrigem(false)
                        }}
                        className="py-4 px-4 text-base font-bold flex items-center justify-between cursor-pointer"
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

        <div className="flex justify-center -my-2 z-10">
          <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-4 border-background">
            <ArrowRight size={20} className="rotate-90" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">
            Indo para
          </Label>
          <Popover open={openDestino} onOpenChange={setOpenDestino}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDestino}
                disabled={!origem}
                className="w-full h-16 px-4 bg-background border-border/40 rounded-2xl shadow-sm hover:bg-background/80 transition-all flex items-center justify-between disabled:opacity-60"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <MapPin className="text-primary flex-shrink-0 rotate-180" size={18} strokeWidth={2.5} />
                  <span className={cn("text-base font-bold truncate", !destino && "text-muted-foreground")}>
                    {destino ? destino : "Cidade de Destino"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl border-border/50 shadow-2xl overflow-hidden" align="start">
              <Command className="w-full">
                <CommandInput placeholder="Pesquisar destino..." className="h-12 border-none focus:ring-0 font-bold" />
                <CommandList className="max-h-[300px] overflow-y-auto scrollbar-hide">
                  <CommandEmpty className="py-6 text-center text-sm font-medium text-muted-foreground">Destino não encontrado.</CommandEmpty>
                  <CommandGroup>
                    {destinos.map((cidade) => (
                      <CommandItem
                        key={cidade}
                        value={cidade}
                        onSelect={(currentValue) => {
                          setDestino(currentValue === destino ? "" : currentValue)
                          setOpenDestino(false)
                        }}
                        className="py-4 px-4 text-base font-bold flex items-center justify-between cursor-pointer"
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

      {/* Results Section - Card List for Mobile First */}
      <div className="relative pt-6 md:pt-10">
        {horariosFiltrados.length > 0 ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between pb-4 border-b border-border/20 px-2">
              <div className="space-y-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Clock size={12} className="text-primary" strokeWidth={3} />
                  Painel de Embarque
                </h3>
                <p className="text-[11px] font-bold text-primary/60">Próximas saídas confirmadas</p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-green-600 uppercase tracking-widest leading-none">Em Operação</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {horariosFiltrados.map((horario, index) => (
                <div
                  key={index}
                  className="active:scale-[0.98] transition-all bg-card border border-border/50 p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:border-primary/20"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-wider">Cooperativa</span>
                        <span className="text-[10px] font-black bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider">Regional</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-50">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Ativo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-foreground py-2 border-y border-border/5">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1">Rota</p>
                        <div className="flex items-center gap-2 overflow-hidden">
                          <p className="text-base font-black truncate">{origem}</p>
                          <ArrowRight size={14} className="flex-shrink-0 text-primary/40" />
                          <p className="text-sm font-semibold text-muted-foreground truncate">{destino}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em] mb-2">Previsão de Saída</p>
                      <div className="flex items-baseline gap-2">
                        <p className={horario.length > 8
                          ? "text-xl md:text-2xl font-black text-primary tracking-tight leading-tight"
                          : "text-4xl font-black text-primary tracking-tighter leading-none"
                        }>
                          {horario}
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-60">
                          Horário local
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-8 rounded-[2.5rem] bg-secondary/5 border-2 border-dashed border-border/20">
            <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center shadow-lg mb-6 text-primary/40">
              <Search size={32} strokeWidth={1.5} />
            </div>
            <h4 className="text-base font-bold text-foreground">Inicie sua busca</h4>
            <p className="text-muted-foreground text-center text-xs max-w-[200px] mt-2 leading-relaxed">
              Selecione as cidades para ver todos os horários disponíveis.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
