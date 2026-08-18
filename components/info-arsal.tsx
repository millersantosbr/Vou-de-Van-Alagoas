"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  Phone,
  CheckCircle2,
  Users,
  GraduationCap,
  Briefcase,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Bus,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function InfoArsal() {
  return (
    <section id="info-arsal" className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Header da Seção */}
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
          <Shield size={14} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            Regulamentação Oficial
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground">
          Direitos & Info ARSAL
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed opacity-80">
          Tudo o que você precisa saber para viajar com segurança e exercer seus direitos no transporte intermunicipal.
        </p>
      </div>

      {/* Estatísticas Institucionais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/60 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 text-primary">
            <Bus size={24} />
          </div>
          <span className="text-3xl font-black text-foreground">182</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Linhas Oficiais</span>
          <p className="text-[11px] text-muted-foreground/80 mt-1">Rotas homologadas em todo o estado</p>
        </div>

        <div className="bg-card border border-border/60 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3 text-blue-500">
            <MapPin size={24} />
          </div>
          <span className="text-3xl font-black text-foreground">102</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Municípios</span>
          <p className="text-[11px] text-muted-foreground/80 mt-1">Cobertura em Alagoas de ponta a ponta</p>
        </div>

        <div className="bg-card border border-border/60 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-3 text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-3xl font-black text-foreground">100%</span>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Fiscalizado</span>
          <p className="text-[11px] text-muted-foreground/80 mt-1">Vistorias periódicas de segurança</p>
        </div>
      </div>

      {/* Cards de Direitos e Regras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gratuidade e Meia-Passagem */}
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2.5 text-foreground">
              <GraduationCap className="text-primary" size={22} />
              Gratuidade & Meia-Passagem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Estudantes (Meia-Passagem)
              </p>
              <p className="pl-3">Desconto de 50% garantido mediante apresentação da carteira de estudante válida da linha cadastrada.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Idosos (60+ anos)
              </p>
              <p className="pl-3">Reserva de 2 vagas gratuitas por veículo com antecedência mínima, ou 50% de desconto caso as vagas estejam ocupadas.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Pessoas com Deficiência (Passe Livre)
              </p>
              <p className="pl-3">Direito à gratuidade integral e ao acompanhante quando comprovada a necessidade médica legal.</p>
            </div>
          </CardContent>
        </Card>

        {/* Como Identificar Van Oficial */}
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="bg-green-500/5 pb-4">
            <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2.5 text-foreground">
              <Shield className="text-green-600" size={22} />
              Como Identificar a Van Oficial
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-600" />
                Selo de Vistoria ARSAL
              </p>
              <p className="pl-6">Adesivo holográfico oficial afixado no para-brisa dianteiro com o ano vigente.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-600" />
                Placa Comercial (Vermelha / Mercosul)
              </p>
              <p className="pl-6">Veículos autorizados possuem placa de categoria comercial de aluguel.</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-green-600" />
                Número de Registro e Linha Visíveis
              </p>
              <p className="pl-6">Identificação da cooperativa e itinerário legível nas laterais e no vidro frontal.</p>
            </div>
          </CardContent>
        </Card>

        {/* Bagagens e Animais */}
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="bg-amber-500/5 pb-4">
            <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2.5 text-foreground">
              <Briefcase className="text-amber-500" size={22} />
              Bagagens & Volumes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <p>
              • Cada passageiro tem direito ao transporte gratuito de até <strong>1 volume</strong> de bagagem no bagageiro ou sob o assento.
            </p>
            <p>
              • É proibido o transporte de substâncias inflamáveis, corrosivas ou perigosas no compartimento de passageiros.
            </p>
            <p>
              • Cães-guia têm embarque livre garantido por lei federal ao lado do tutor.
            </p>
          </CardContent>
        </Card>

        {/* Ouvidoria e Contato ARSAL */}
        <Card className="glass border-border/50 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2.5 text-foreground">
              <Phone className="text-primary" size={22} />
              Ouvidoria e Denúncias ARSAL
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
            <p>
              Para registrar elogios, reclamações sobre descumprimento de horários ou denunciar transporte clandestino:
            </p>
            <div className="bg-muted/40 p-4 rounded-2xl border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">Disque Ouvidoria:</span>
                <span className="font-black text-primary text-sm">0800 284 0429</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Atendimento:</span>
                <span>Segunda a Sexta, das 8h às 14h</span>
              </div>
            </div>
            <div className="pt-1">
              <Button variant="outline" size="sm" asChild className="w-full rounded-xl font-bold">
                <a
                  href="https://arsal.al.gov.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Acessar Portal Oficial da ARSAL</span>
                  <ExternalLink size={14} />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
