"use client"

import {
  ShieldCheck,
  Phone,
  GraduationCap,
  Suitcase,
  IdentificationBadge,
  Tag,
  Car,
  ChatCircleDots,
  ArrowSquareOut,
  Wheelchair,
  PawPrint,
  ClockAfternoon,
} from "@phosphor-icons/react"

export function InfoArsal() {
  return (
    <section id="info-arsal" className="space-y-6 scroll-mt-20">
      
      {/* 📖 Header da Seção com Respiro Visual */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-xs font-semibold text-[#0038A8] dark:text-blue-400">
          <ShieldCheck size={14} weight="bold" />
          <span>Regulamentação Oficial</span>
        </div>
        
        <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
          Guia do Passageiro ARSAL
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Regras essenciais e direitos garantidos para a sua viagem em Alagoas.
        </p>
      </div>

      {/* Bento Grid Clean e Minimalista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Gratuidade e Meia-Passagem */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
              <GraduationCap size={20} weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Gratuidade e Meia-Passagem
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Benefícios garantidos por lei estadual</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-bold text-[#0038A8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md shrink-0">
                60+
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Idosos:</strong> 2 vagas 100% gratuitas por van ou 50% de desconto com documento oficial com foto.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="text-xs font-bold text-[#0038A8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md shrink-0">
                50%
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Estudantes:</strong> Meia-passagem garantida mediante apresentação da carteira estudantil válida.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <Wheelchair size={18} weight="bold" className="text-[#0038A8] dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">PcD:</strong> Gratuidade integral assegurada com a carteira Passe Livre ARSAL.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Bagagens & Animais */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/40 text-[#D62828] dark:text-red-400 flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/40">
              <Suitcase size={20} weight="bold" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Bagagens e Animais
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Limites e condições de embarque</p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <Suitcase size={18} weight="bold" className="text-[#D62828] dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Bagagens:</strong> Até 20 kg no bagageiro e 5 kg de mão (acomodada no colo).
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <PawPrint size={18} weight="bold" className="text-[#D62828] dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Animais domésticos:</strong> Permitidos em caixa de transporte com carteira de vacinação em dia.
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <ShieldCheck size={18} weight="bold" className="text-[#D62828] dark:text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Cão-Guia:</strong> Embarque livre e 100% gratuito garantido por lei federal.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Como Identificar Van Oficial (Segurança) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-4 md:col-span-2 shadow-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} weight="fill" className="text-[#0038A8] dark:text-blue-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                Identificação da Van Autorizada
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              3 Itens Obrigatórios
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 flex items-center justify-center shrink-0">
                <Tag size={16} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Selo ARSAL Visível
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Adesivo oficial com ano vigente no para-brisa.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 flex items-center justify-center shrink-0">
                <IdentificationBadge size={16} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Crachá do Motorista
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Identificação profissional autorizada com foto.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#D62828] dark:text-red-400 flex items-center justify-center shrink-0">
                <Car size={16} weight="bold" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Placa Comercial
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Placa vermelha de aluguel ou Mercosul comercial.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Canais Oficiais ARSAL (Atendimento & Ouvidoria) */}
        <div className="bg-slate-50 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-3.5 md:col-span-2 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Phone size={18} weight="bold" className="text-[#0038A8] dark:text-blue-400" />
                <span>Ouvidoria e Fiscalização ARSAL</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Para reclamações sobre descumprimento de horários ou transporte irregular:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href="tel:08002840429"
              className="flex items-center gap-3 bg-white dark:bg-slate-800/90 hover:bg-blue-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-3.5 rounded-2xl transition-all active:scale-98 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0038A8] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone size={18} weight="bold" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Ligação Gratuita
                </span>
                <span className="font-mono font-bold text-base text-slate-900 dark:text-slate-100">
                  0800 284 0429
                </span>
              </div>
            </a>

            <a
              href="https://wa.me/5582988339480"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-slate-800/90 hover:bg-emerald-50/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-3.5 rounded-2xl transition-all active:scale-98 group shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ChatCircleDots size={18} weight="bold" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  WhatsApp ARSAL
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  Atendimento Online <ArrowSquareOut size={13} className="text-slate-400" />
                </span>
              </div>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}

