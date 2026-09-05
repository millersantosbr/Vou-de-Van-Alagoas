import Link from "next/link"
import { ArrowLeft, MapPin, Shield, Route as RouteIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimetableHeader } from "@/components/timetable-header"
import { todasAsLinhas, type LinhaVan } from "@/lib/bus-data"
import { Footer } from "@/components/footer"

interface RoutePageProps {
  params: Promise<{ id: string }> | { id: string }
}

export async function generateStaticParams() {
  return todasAsLinhas.map((linha) => ({
    id: linha.codigo,
  }))
}

export default async function RoutePage({ params }: RoutePageProps) {
  const resolvedParams = await params
  const id = decodeURIComponent(resolvedParams.id)

  const linha: LinhaVan | undefined = todasAsLinhas.find(
    (l) => l.codigo === id || l.nome_linha.toLowerCase() === id.toLowerCase()
  )

  if (!linha) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TimetableHeader />
        <main className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
            <RouteIcon size={32} />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Linha não encontrada</h1>
          <p className="text-muted-foreground text-sm max-w-md mb-6">
            Não encontramos a linha informada ({id}). Verifique o código e tente novamente.
          </p>
          <Button asChild className="rounded-xl font-bold">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TimetableHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="rounded-xl font-bold">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-primary" />
                <span>Voltar à busca</span>
              </Link>
            </Button>
          </div>

          {/* Hero Banner da Linha */}
          <div className="bg-card border border-border/60 p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black bg-primary text-primary-foreground px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    <Shield size={12} /> Linha {linha.codigo}
                  </span>
                  {linha.area && (
                    <span className="text-xs font-black bg-muted text-muted-foreground px-3 py-1 rounded-full uppercase tracking-wider">
                      {linha.area}
                    </span>
                  )}
                  {linha.extensao && (
                    <span className="text-xs font-bold bg-muted/60 text-muted-foreground px-3 py-1 rounded-full">
                      📍 {linha.extensao}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
                  {linha.nome_linha}
                </h1>

                {linha.via && (
                  <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <RouteIcon size={16} />
                    Via {linha.via}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end justify-center bg-muted/30 p-4 rounded-2xl border border-border/30">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tipo de Serviço</span>
                <span className="text-xs font-black text-foreground">{linha.servico || "Transporte Complementar"}</span>
                {linha.viagens_semana && (
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {linha.viagens_semana} viagens semanais autorizadas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs com Horários e Itinerário */}
          <Tabs defaultValue="horarios" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1.5 rounded-2xl bg-muted/50 border border-border/40 mb-6">
              <TabsTrigger value="horarios" className="rounded-xl font-bold text-xs md:text-sm py-2.5">
                Quadro de Horários
              </TabsTrigger>
              <TabsTrigger value="itinerario" className="rounded-xl font-bold text-xs md:text-sm py-2.5">
                Itinerário & Regulamentação
              </TabsTrigger>
            </TabsList>

            {/* TAB HORÁRIOS */}
            <TabsContent value="horarios" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Saídas da Origem */}
                <div className="bg-card border border-border/60 p-6 rounded-[2rem] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border/20">
                    <MapPin className="text-primary" size={18} />
                    <div>
                      <h3 className="font-black text-base text-foreground">Saídas de {linha.origem}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sentido {linha.destino}</p>
                    </div>
                  </div>

                  {linha.saidas_origem && linha.saidas_origem.length > 0 ? (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {linha.saidas_origem.map((saida, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/60 transition-colors"
                        >
                          <span className="text-2xl font-black text-primary tracking-tight">
                            {saida.horario}
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                            {saida.dias.length === 7 ? (
                              <span className="text-[10px] font-bold bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-md">
                                Diariamente
                              </span>
                            ) : (
                              saida.dias.map((d) => (
                                <span key={d} className="text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                                  {d.slice(0, 3)}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-6 text-center">Nenhum horário cadastrado</p>
                  )}
                </div>

                {/* Saídas do Destino (Volta) */}
                <div className="bg-card border border-border/60 p-6 rounded-[2rem] shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-border/20">
                    <MapPin className="text-[#D62828] dark:text-red-400 rotate-180" size={18} />
                    <div>
                      <h3 className="font-black text-base text-foreground">Saídas de {linha.destino}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sentido {linha.origem}</p>
                    </div>
                  </div>

                  {linha.saidas_destino && linha.saidas_destino.length > 0 ? (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {linha.saidas_destino.map((saida, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/60 transition-colors"
                        >
                          <span className="text-2xl font-black text-[#D62828] dark:text-red-400 tracking-tight">
                            {saida.horario}
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                            {saida.dias.length === 7 ? (
                              <span className="text-[10px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">
                                Diariamente
                              </span>
                            ) : (
                              saida.dias.map((d) => (
                                <span key={d} className="text-[9px] font-bold bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md">
                                  {d.slice(0, 3)}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-6 text-center">Nenhum horário cadastrado</p>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* TAB ITINERÁRIO */}
            <TabsContent value="itinerario" className="space-y-6">
              <div className="bg-card border border-border/60 p-6 md:p-8 rounded-[2rem] shadow-sm space-y-6">
                {linha.itinerario?.ida && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <RouteIcon size={14} className="text-primary" />
                      Itinerário de Ida
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {linha.itinerario.ida}
                    </p>
                  </div>
                )}

                {linha.itinerario?.volta && (
                  <div className="space-y-1.5 pt-4 border-t border-border/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <RouteIcon size={14} className="text-[#D62828] dark:text-red-400" />
                      Itinerário de Volta
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {linha.itinerario.volta}
                    </p>
                  </div>
                )}

                {linha.itinerario?.seccionamentos && (
                  <div className="space-y-1.5 pt-4 border-t border-border/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                      <MapPin size={14} className="text-[#0038A8] dark:text-blue-400" />
                      Seccionamentos / Paradas
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                      {linha.itinerario.seccionamentos}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
