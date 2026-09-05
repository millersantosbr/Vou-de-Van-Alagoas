"use client"

import {
  Shield,
  Phone,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  ExternalLink,
  MessageSquare,
  BadgeCheck,
  Tag,
  IdCard,
} from "lucide-react"

export function InfoArsal() {
  return (
    <section id="info-arsal" className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* 📖 Guia do Passageiro Header */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="h-1 w-12 bg-[#D62828] rounded-full" />
        <h3 className="font-bold text-2xl sm:text-4xl text-slate-900 dark:text-slate-100">Guia do Passageiro</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md">Conheça seus direitos e as regras essenciais para a sua viagem em Alagoas.</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card: Gratuidade e Meia-Passagem */}
        <article className="bg-card dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl shadow-sm border border-border/80 p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#0038A8]/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#0038A8] dark:text-blue-400">
              <div className="w-10 h-10 rounded-xl bg-[#0038A8]/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap size={20} />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">Gratuidade e Meia-Passagem</h4>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#0038A8] dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-slate-100">Idosos (60+):</strong> 2 vagas gratuitas por veículo ou 50% de desconto mediante documento oficial com foto.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#0038A8] dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-slate-100">Estudantes:</strong> Meia-passagem garantida apresentando a carteira de estudante da linha cadastrada.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#0038A8] dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-slate-100">PcD:</strong> Gratuidade integral assegurada com a apresentação do Passe Livre ARSAL.</span>
              </li>
            </ul>
          </div>
        </article>

        {/* Card: Bagagens & Animais */}
        <article className="bg-card dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl shadow-sm border border-border/80 p-5 sm:p-6 flex flex-col justify-between space-y-4 hover:border-[#D62828]/40 transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-[#D62828] dark:text-red-400">
              <div className="w-10 h-10 rounded-xl bg-[#D62828]/10 flex items-center justify-center flex-shrink-0">
                <Briefcase size={20} />
              </div>
              <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100">Bagagens & Animais</h4>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Conheça os limites e regras para viajar com seus pertences e animais:</p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D62828] dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-slate-100">Bagagem:</strong> Limite de até 20kg no bagageiro e 5kg de bagagem de mão (no colo).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D62828] dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-slate-100">Animais domésticos:</strong> Permitidos em caixas de transporte adequadas e com atestado de vacinação.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-[#D62828] dark:text-red-400 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 dark:text-slate-100">Cão-Guia:</strong> Embarque livre e gratuito garantido por lei federal ao lado do tutor.</span>
              </li>
            </ul>
          </div>
        </article>

        {/* Card: Como Identificar uma Van Oficial */}
        <article className="bg-card dark:bg-slate-900/90 rounded-2xl sm:rounded-3xl shadow-sm border border-border/80 p-5 sm:p-6 space-y-4 md:col-span-2">
          <div>
            <h4 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="text-[#0038A8] dark:text-blue-400" size={20} />
              Como Identificar uma Van Oficial ARSAL
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Sempre verifique estes 3 itens obrigatórios antes de embarcar:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl flex flex-col items-center text-center border border-border/40 hover:border-[#0038A8]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#0038A8]/10 text-[#0038A8] dark:text-blue-400 flex items-center justify-center mb-2 shadow-xs">
                <Tag size={22} />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Selo ARSAL Visível</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Adesivo oficial com o ano vigente no para-brisa dianteiro.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl flex flex-col items-center text-center border border-border/40 hover:border-[#0038A8]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#0038A8]/10 text-[#0038A8] dark:text-blue-400 flex items-center justify-center mb-2 shadow-xs">
                <IdCard size={22} />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Crachá do Motorista</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Identificação profissional com foto autorizada pela ARSAL.</p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl flex flex-col items-center text-center border border-border/40 hover:border-[#D62828]/30 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-[#D62828]/10 text-[#D62828] dark:text-red-400 flex items-center justify-center mb-2 shadow-xs">
                <BadgeCheck size={22} />
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Placa Comercial</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Placa vermelha de aluguel ou padrão Mercosul comercial.</p>
            </div>
          </div>
        </article>

        {/* Card: Canais de Atendimento & Ouvidoria ARSAL */}
        <article className="bg-gradient-to-br from-[#001845] to-[#002855] text-white rounded-2xl sm:rounded-3xl shadow-xl p-6 md:col-span-2 relative overflow-hidden border border-white/10">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-6 translate-y-6">
            <Phone size={180} />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="space-y-1">
              <h4 className="font-bold text-lg sm:text-xl text-white">Canais de Atendimento & Ouvidoria ARSAL</h4>
              <p className="text-xs sm:text-sm text-slate-200">
                Dúvidas, reclamações sobre descumprimento de horários ou denúncias de transporte irregular:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="tel:08002840429"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/15 p-3.5 rounded-2xl transition-all active:scale-95 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0038A8] flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Ligação Gratuita</div>
                  <div className="font-mono font-bold text-base sm:text-lg text-white">0800 284 0429</div>
                </div>
              </a>

              <a
                href="https://wa.me/5582988339480"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/15 p-3.5 rounded-2xl transition-all active:scale-95 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 text-white shadow-xs">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">WhatsApp ARSAL</div>
                  <div className="font-bold text-sm sm:text-base text-white flex items-center gap-1">
                    Atendimento Online <ExternalLink size={14} />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </article>

      </div>
    </section>
  )
}
