import rawData from "@/horarios_vans_alagoas.json"

export interface Saida {
  horario: string
  dias: string[]
}

export interface Itinerario {
  ida: string
  volta: string
  seccionamentos: string
  observacoes: string
}

export interface LinhaVan {
  codigo: string
  nome_linha: string
  origem: string
  destino: string
  via: string | null
  area: string
  servico: string
  extensao: string
  viagens_semana: number | null
  itinerario: Itinerario
  saidas_origem: Saida[]
  saidas_destino: Saida[]
}

export interface HorarioFormatado {
  id: string
  horario: string
  codigoLinha: string
  nomeLinha: string
  origem: string
  destino: string
  via: string | null
  area: string
  servico: string
  extensao: string
  dias: string[]
  itinerario: Itinerario
  sentido: "ida" | "volta"
  isIntermediaria?: boolean
}

export type FiltroDia = "hoje" | "amanha" | "todos" | "semana" | "sabado" | "domingo" | "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo"

export const dataset = rawData as {
  metadata: {
    estado: string
    orgao_emissor: string
    descricao: string
    total_linhas: number
    total_paginas_pdf: number
    data_extracao: string
  }
  linhas: LinhaVan[]
}

export const todasAsLinhas: LinhaVan[] = dataset.linhas || []

export const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"] as const
export type DiaSemana = (typeof DIAS_SEMANA)[number]

// Retorna o dia da semana atual no padrão do dataset
export function getDiaSemanaHoje(): DiaSemana {
  const diaIndex = new Date().getDay()
  return DIAS_SEMANA[diaIndex]
}

// Retorna o dia da semana relativo com deslocamento de dias (+1 = amanhã, +2 = depois de amanhã...)
export function getDiaSemanaOffset(offsetDays: number = 0): DiaSemana {
  const target = new Date()
  target.setDate(target.getDate() + offsetDays)
  return DIAS_SEMANA[target.getDay()]
}

// Normaliza strings para comparação (sem acento, maiúsculo, sem espaços extras)
export function normalizarTexto(texto: string = ""): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim()
}

// Obter lista de todas as cidades (origens e destinos únicos formatados)
const mapaCidades = new Map<string, string>()

todasAsLinhas.forEach((linha) => {
  if (linha.origem) {
    const limpa = linha.origem.trim()
    mapaCidades.set(normalizarTexto(limpa), limpa)
  }
  if (linha.destino) {
    const limpa = linha.destino.trim()
    mapaCidades.set(normalizarTexto(limpa), limpa)
  }
})

export const listaCidades: string[] = Array.from(mapaCidades.values()).sort((a, b) =>
  a.localeCompare(b, "pt-BR")
)

// Obter destinos disponíveis para uma cidade de origem selecionada
export function getDestinosDisponiveis(origem: string): string[] {
  if (!origem) return []
  const normOrigem = normalizarTexto(origem)
  const destinosSet = new Set<string>()

  todasAsLinhas.forEach((linha) => {
    const normLinhaOrigem = normalizarTexto(linha.origem)
    const normLinhaDestino = normalizarTexto(linha.destino)

    // Se a linha sai da origem e tem saídas de origem cadastradas
    if (normLinhaOrigem === normOrigem && linha.saidas_origem && linha.saidas_origem.length > 0) {
      destinosSet.add(linha.destino.trim())
    }

    // Se a linha tem a origem como destino e tem saídas de volta
    if (normLinhaDestino === normOrigem && linha.saidas_destino && linha.saidas_destino.length > 0) {
      destinosSet.add(linha.origem.trim())
    }

    // Verificação de vias intermediárias
    if (linha.via) {
      const normVia = normalizarTexto(linha.via)
      if (normVia.includes(normOrigem)) {
        if (normLinhaOrigem !== normOrigem) destinosSet.add(linha.origem.trim())
        if (normLinhaDestino !== normOrigem) destinosSet.add(linha.destino.trim())
      }
    }
  })

  return Array.from(destinosSet).sort((a, b) => a.localeCompare(b, "pt-BR"))
}

// Obter vias disponíveis entre uma origem e destino
export function getViasDisponiveis(origem: string, destino: string): string[] {
  if (!origem || !destino) return []
  const normOrigem = normalizarTexto(origem)
  const normDestino = normalizarTexto(destino)
  const viasSet = new Set<string>()

  todasAsLinhas.forEach((linha) => {
    const normLinhaOrigem = normalizarTexto(linha.origem)
    const normLinhaDestino = normalizarTexto(linha.destino)

    const isMatch =
      (normLinhaOrigem === normOrigem && normLinhaDestino === normDestino) ||
      (normLinhaDestino === normOrigem && normLinhaOrigem === normDestino)

    if (isMatch && linha.via && linha.via.trim() !== "") {
      viasSet.add(linha.via.trim())
    }
  })

  return Array.from(viasSet).sort((a, b) => a.localeCompare(b, "pt-BR"))
}

// Filtra saídas pelo filtro de dia selecionado
export function verificarDia(diasSaida: string[], filtro: FiltroDia): boolean {
  if (!diasSaida || diasSaida.length === 0) return true
  if (filtro === "todos") return true

  if (filtro === "hoje") {
    const hoje = getDiaSemanaHoje()
    return diasSaida.includes(hoje)
  }

  if (filtro === "amanha") {
    const amanha = getDiaSemanaOffset(1)
    return diasSaida.includes(amanha)
  }

  if (filtro === "semana") {
    const diasUteis = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
    return diasSaida.some((d) => diasUteis.includes(d))
  }

  if (filtro === "sabado") {
    return diasSaida.includes("Sábado")
  }

  if (filtro === "domingo") {
    return diasSaida.includes("Domingo")
  }

  return diasSaida.includes(filtro)
}

// Buscar todos os horários e informações de linhas para uma rota
export function buscarHorariosRota(
  origem: string,
  destino: string,
  filtroDia: FiltroDia = "hoje",
  filtroVia?: string
): HorarioFormatado[] {
  if (!origem || !destino) return []

  const normOrigem = normalizarTexto(origem)
  const normDestino = normalizarTexto(destino)
  const resultados: HorarioFormatado[] = []

  todasAsLinhas.forEach((linha) => {
    const normLinhaOrigem = normalizarTexto(linha.origem)
    const normLinhaDestino = normalizarTexto(linha.destino)

    // Filtro por via específica se fornecido
    if (filtroVia && filtroVia !== "todas") {
      if (!linha.via || normalizarTexto(linha.via) !== normalizarTexto(filtroVia)) {
        return
      }
    }

    // Sentido IDA: origem -> destino
    if (normLinhaOrigem === normOrigem && normLinhaDestino === normDestino) {
      linha.saidas_origem.forEach((saida, idx) => {
        if (verificarDia(saida.dias, filtroDia)) {
          resultados.push({
            id: `${linha.codigo}-origem-${saida.horario}-${idx}`,
            horario: saida.horario,
            codigoLinha: linha.codigo,
            nomeLinha: linha.nome_linha,
            origem: linha.origem,
            destino: linha.destino,
            via: linha.via,
            area: linha.area,
            servico: linha.servico,
            extensao: linha.extensao,
            dias: saida.dias,
            itinerario: linha.itinerario,
            sentido: "ida",
          })
        }
      })
    }

    // Sentido VOLTA: quando o usuário busca da cidade destino para a cidade origem
    if (normLinhaDestino === normOrigem && normLinhaOrigem === normDestino) {
      linha.saidas_destino.forEach((saida, idx) => {
        if (verificarDia(saida.dias, filtroDia)) {
          resultados.push({
            id: `${linha.codigo}-destino-${saida.horario}-${idx}`,
            horario: saida.horario,
            codigoLinha: linha.codigo,
            nomeLinha: linha.nome_linha,
            origem: linha.destino,
            destino: linha.origem,
            via: linha.via,
            area: linha.area,
            servico: linha.servico,
            extensao: linha.extensao,
            dias: saida.dias,
            itinerario: linha.itinerario,
            sentido: "volta",
          })
        }
      })
    }
  })

  // Ordenar horários cronologicamente (05:00, 05:30, ...)
  return resultados.sort((a, b) => a.horario.localeCompare(b.horario))
}

// Helper para compatibilidade legada se algum componente ainda importar `busSchedules`
export const busSchedules: Record<string, Record<string, string[]>> = {}

todasAsLinhas.forEach((linha) => {
  const o = normalizarTexto(linha.origem)
  const d = normalizarTexto(linha.destino)

  if (!busSchedules[o]) busSchedules[o] = {}
  if (!busSchedules[o][d]) busSchedules[o][d] = []

  linha.saidas_origem.forEach((s) => {
    if (!busSchedules[o][d].includes(s.horario)) {
      busSchedules[o][d].push(s.horario)
    }
  })

  // Volta
  if (!busSchedules[d]) busSchedules[d] = {}
  if (!busSchedules[d][o]) busSchedules[d][o] = []
  linha.saidas_destino.forEach((s) => {
    if (!busSchedules[d][o].includes(s.horario)) {
      busSchedules[d][o].push(s.horario)
    }
  })
})
