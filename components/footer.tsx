"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 container mx-auto px-4 sm:px-6 text-center border-t border-border/20 pt-12 pb-24 space-y-6">
      <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="relative w-40 h-10 sm:w-48 sm:h-12 transition-transform hover:scale-105 duration-300">
          <Image
            src="/logonome.webp"
            alt="Vou de Van Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* 1. Fonte dos Dados */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Todas as informações e horários exibidos no site foram extraídos do{" "}
          <a
            href="https://www.arsal.al.gov.br/documentos?task=download.send&id=882&catid=64&m=0"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            <span>documento oficial emitido pela ARSAL Alagoas</span>
            <ExternalLink size={13} />
          </a>.
        </p>

        {/* 2. Disclaimer de Projeto Independente */}
        <p className="text-[11px] sm:text-xs text-muted-foreground/80 leading-relaxed bg-muted/30 dark:bg-slate-900/40 p-3 sm:p-4 rounded-2xl border border-border/40">
          Este é um projeto independente de utilidade pública, criado de forma autônoma e voluntária. Não possui qualquer vínculo institucional, apoio ou patrocínio de órgãos públicos ou empresas privadas.
        </p>

        {/* Selo das Cores de Alagoas */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="w-3 h-2 rounded-xs bg-[#D62828]" title="Vermelho Alagoas" />
          <span className="w-3 h-2 rounded-xs bg-white border border-slate-300 dark:border-slate-700" title="Branco Alagoas" />
          <span className="w-3 h-2 rounded-xs bg-[#0038A8]" title="Azul Alagoas" />
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-1">
            Orgulho de Alagoas • Maceió e Interior
          </span>
        </div>

        {/* 3. Marca do Autor & Direitos */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs text-muted-foreground">
          <p className="text-xs text-foreground font-black uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} Vou de Van - Alagoas
          </p>

          <span className="hidden sm:inline text-muted-foreground/40">•</span>

          <a
            href="https://github.com/millersantosbr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>Desenvolvido por</span>
            <span className="font-bold text-foreground underline underline-offset-2 group-hover:text-primary transition-colors">
              millersantosbr
            </span>
            <svg
              className="w-4 h-4 text-foreground/80 group-hover:text-foreground transition-colors"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
