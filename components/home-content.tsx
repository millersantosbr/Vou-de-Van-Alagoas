"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { busSchedules } from "@/lib/bus-data"
import { MapPin, ArrowRight, Clock, Search } from "lucide-react"

export default function HomeContent() {
  const [origem, setOrigem] = useState<string>("")
  const [destino, setDestino] = useState<string>("")
  const [destinos, setDestinos] = useState<string[]>([])
  const [horariosFiltrados, setHorariosFiltrados] = useState<string[]>([])

  // Lista de cidades de origem
  const origens = Object.keys(busSchedules).sort()

  // Atualiza destinos quando a origem muda
  useEffect(() => {
    if (origem) {
      const destinosDisponiveis = Object.keys(busSchedules[origem] || {}).sort()
      setDestinos(destinosDisponiveis)
      setDestino(destinosDisponiveis[0] || "")
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
      {/* Mobile-optimized Selectors */}
      <div className="grid grid-cols-1 gap-4 relative">
        <div className="space-y-2">
          <Label htmlFor="origem" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">
            Saindo de
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
              <MapPin size={18} strokeWidth={2.5} />
            </div>
            <Select value={origem} onValueChange={setOrigem}>
              <SelectTrigger id="origem" className="h-16 pl-12 bg-background border-border/40 rounded-2xl shadow-sm focus:ring-primary/20 transition-all text-base font-bold">
                <SelectValue placeholder="Cidade de Origem" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 shadow-2xl max-h-[300px]">
                {origens.map((cidade) => (
                  <SelectItem key={cidade} value={cidade} className="py-4 text-base focus:bg-primary/5">
                    {cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center -my-2 z-10">
          <div className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-4 border-background">
            <ArrowRight size={20} className="rotate-90" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="destino" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 ml-1">
            Indo para
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10">
              <MapPin size={18} strokeWidth={2.5} className="rotate-180" />
            </div>
            <Select value={destino} onValueChange={setDestino} disabled={!origem}>
              <SelectTrigger id="destino" className="h-16 pl-12 bg-background border-border/40 rounded-2xl shadow-sm focus:ring-primary/20 transition-all text-base font-bold disabled:opacity-60">
                <SelectValue placeholder="Cidade de Destino" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 shadow-2xl max-h-[300px]">
                {destinos.map((cidade) => (
                  <SelectItem key={cidade} value={cidade} className="py-4 text-base focus:bg-primary/5">
                    {cidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
