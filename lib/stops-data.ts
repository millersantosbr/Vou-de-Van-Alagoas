import { normalizarTexto } from "./bus-data"

export interface MapStop {
  id: string
  name: string
  type: "terminal" | "posto" | "ponto"
  address?: string
  lat: number
  lng: number
  city: string // Cidade sede do terminal/ponto
  cities: string[] // Cidades com vans atendidas
  description?: string
  distanceKm?: number
}

// Cidades intermunicipais atendidas pela Rodoviária de Maceió (Terminal Central)
const CIDADES_RODOVIARIA_MACEIO: string[] = [
  "Água Branca", "Anadia", "Arapiraca", "Atalaia", "Barra de Santo Antônio", "Barra de São Miguel",
  "Batalha", "Boca da Mata", "Cajueiro", "Campo Alegre", "Canapi", "Capela", "Carneiros",
  "Chã Preta", "Colônia Leopoldina", "Coruripe", "Cruzeiro do Sul", "Delmiro Gouveia",
  "Flexeiras", "Girau do Ponciano", "Ibateguara", "Igreja Nova", "Inhapi", "Joaquim Gomes",
  "Junqueiro", "Luziápolis", "Major Izidoro", "Maragogi", "Marechal Deodoro", "Mata Grande",
  "Matriz de Camaragibe", "Messias", "Murici", "Novo Lino", "Olivença", "Ouro Branco",
  "Palmeira dos Índios", "Paulo Jacinto", "Penedo", "Pilar", "Piranhas", "Porto Calvo",
  "Porto Real do Colégio", "Porto de Pedras", "Pão de Açúcar", "Quebrangulo", "Rio Largo",
  "Santa Cruz do Deserto", "Santana do Ipanema", "São José da Laje", "São José da Tapera",
  "São Luís do Quitunde", "São Miguel dos Campos", "Teotônio Vilela", "União dos Palmares", "Viçosa"
]

export const STOPS_DATA: MapStop[] = [
  // ==========================================
  // PONTOS ESTRATÉGICOS DE MACEIÓ
  // ==========================================
  {
    id: "mcz-patio",
    name: "Ponto das Vans Shopping Pátio (Via Expressa)",
    type: "ponto",
    address: "Av. Menino Marcelo, s/n - Cidade Universitária (Em frente ao Shopping Pátio), Maceió - AL",
    lat: -9.5587494,
    lng: -35.747199,
    city: "Maceió",
    description: "Principal ponto de embarque da parte alta de Maceió para o Norte e Zona da Mata via BR-101.",
    cities: [
      "Flexeiras",
      "Joaquim Gomes",
      "Novo Lino",
      "Colônia Leopoldina",
      "Murici",
      "Branquinha",
      "União dos Palmares",
      "Messias"
    ],
  },
  {
    id: "mcz-rodoviaria",
    name: "Terminal Rodoviário João Paulo II",
    type: "terminal",
    address: "Av. Leste-Oeste, s/n - Feitosa, Maceió - AL",
    lat: -9.645625,
    lng: -35.726496,
    city: "Maceió",
    description: "Terminal central oficial de Maceió para todas as linhas complementares e intermunicipais de Alagoas.",
    cities: CIDADES_RODOVIARIA_MACEIO,
  },
  {
    id: "mcz-mangabeiras",
    name: "Ponto Mangabeiras / Posto Pichilau (Litoral Norte)",
    type: "ponto",
    address: "Av. Comendador Gustavo Paiva (Próx. ao Maceió Shopping / Posto Pichilau), Maceió - AL",
    lat: -9.6385,
    lng: -35.7065,
    city: "Maceió",
    description: "Ponto tradicional de embarque para linhas que sobem pela rodovia AL-101 Norte.",
    cities: [
      "Maragogi",
      "Paripueira",
      "Barra de Santo Antônio",
      "São Luís do Quitunde",
      "Matriz de Camaragibe",
      "Porto Calvo",
      "Porto de Pedras",
      "Japaratinga",
      "Passo de Camaragibe",
      "São Miguel dos Milagres"
    ],
  },
  {
    id: "mcz-tabuleiro",
    name: "Ponto de Apoio Tabuleiro do Martins (Trevo da PRF)",
    type: "posto",
    address: "Av. Durval de Góes Monteiro (Trevo da PRF), Maceió - AL",
    lat: -9.565,
    lng: -35.7834,
    city: "Maceió",
    description: "Posto de parada e fiscalização para o corredor da rodovia BR-104. Não atende Flexeiras.",
    cities: [
      "Rio Largo",
      "Messias",
      "Murici",
      "Branquinha",
      "União dos Palmares",
      "São José da Laje",
      "Ibateguara",
      "Cruzeiro do Sul"
    ],
  },
  {
    id: "mcz-makro",
    name: "Ponto Makro / Atacadão (Durval de Góes Monteiro)",
    type: "ponto",
    address: "Av. Durval de Góes Monteiro, 1100 - Tabuleiro do Martins, Maceió - AL",
    lat: -9.578,
    lng: -35.772,
    city: "Maceió",
    description: "Ponto de embarque chave para passageiros da parte alta em direção ao Agreste e Sertão.",
    cities: [
      "Arapiraca",
      "Palmeira dos Índios",
      "Santana do Ipanema",
      "Delmiro Gouveia",
      "Batalha",
      "Major Izidoro",
      "Pão de Açúcar",
      "Olivença",
      "São Miguel dos Campos",
      "Campo Alegre",
      "Teotônio Vilela"
    ],
  },
  {
    id: "mcz-centro",
    name: "Ponto Central ARSAL - Levada",
    type: "posto",
    address: "Próximo ao Mercado da Produção - Levada, Maceió - AL",
    lat: -9.6612,
    lng: -35.7485,
    city: "Maceió",
    description: "Ponto oficial para as vans da Bacia Lagunar e Litoral Sul.",
    cities: [
      "Marechal Deodoro",
      "Barra de São Miguel",
      "Pilar",
      "Coqueiro Seco",
      "Santa Luzia do Norte",
      "Satuba",
      "Massagueira",
      "Denisson Amorim"
    ],
  },
  {
    id: "mcz-cepa",
    name: "Ponto do CEPA / Farol",
    type: "ponto",
    address: "Av. Fernandes Lima (Altura do CEPA) - Farol, Maceió - AL",
    lat: -9.634,
    lng: -35.732,
    city: "Maceió",
    description: "Parada de embarque e desembarque no principal corredor da Av. Fernandes Lima.",
    cities: [
      "Rio Largo",
      "Messias",
      "Murici",
      "Branquinha",
      "União dos Palmares",
      "São José da Laje",
      "Cruzeiro do Sul",
      "Satuba",
      "Santa Luzia do Norte",
      "Coqueiro Seco"
    ],
  },

  // ==========================================
  // TERMINAIS E PONTOS DO INTERIOR DE ALAGOAS
  // ==========================================
  {
    id: "arapiraca-terminal",
    name: "Terminal Rodoviário Deputado Nezinho",
    type: "terminal",
    address: "R. Prof. Domingos Correia, s/n - Centro, Arapiraca - AL",
    lat: -9.7554,
    lng: -36.6612,
    city: "Arapiraca",
    description: "Principal centro integrador do Agreste e Sertão de Alagoas.",
    cities: [
      "Maceió", "Palmeira dos Índios", "Santana do Ipanema", "Penedo", "São Sebastião",
      "Girau do Ponciano", "Craíbas", "Lagoa da Canoa", "Delmiro Gouveia", "Batalha",
      "Pão de Açúcar", "Major Izidoro", "Coruripe", "Campo Alegre", "Teotônio Vilela",
      "Anadia", "Boca da Mata", "Junqueiro", "Limoeiro de Anadia", "Feira Grande", "Traipu",
      "Igaci", "Cacimbinhas", "Dois Riachos", "Olho d'Água das Flores", "Água Branca"
    ],
  },
  {
    id: "palmeira-terminal",
    name: "Terminal Rodoviário de Palmeira dos Índios",
    type: "terminal",
    address: "Av. Alagoas, s/n - São Cristóvão, Palmeira dos Índios - AL",
    lat: -9.4082,
    lng: -36.6268,
    city: "Palmeira dos Índios",
    cities: [
      "Maceió", "Arapiraca", "Santana do Ipanema", "Estrela de Alagoas", "Igaci",
      "Quebrangulo", "Cacimbinhas", "Canapi", "Major Izidoro", "Minador do Negrão", "Belém"
    ],
  },
  {
    id: "penedo-terminal",
    name: "Terminal Rodoviário de Penedo",
    type: "terminal",
    address: "Av. Wanderley, s/n - Santa Luzia, Penedo - AL",
    lat: -10.2882,
    lng: -36.5815,
    city: "Penedo",
    cities: [
      "Maceió", "Arapiraca", "Piaçabuçu", "Igreja Nova", "São Sebastião", "Coruripe", "Porto Real do Colégio"
    ],
  },
  {
    id: "delmiro-terminal",
    name: "Terminal Rodoviário de Delmiro Gouveia",
    type: "terminal",
    address: "Av. Juscelino Kubitschek - Centro, Delmiro Gouveia - AL",
    lat: -9.3875,
    lng: -37.9989,
    city: "Delmiro Gouveia",
    cities: [
      "Maceió", "Arapiraca", "Santana do Ipanema", "Piranhas", "Olho d'Água do Casado",
      "Água Branca", "Pariconha", "Inhapi", "Canapi"
    ],
  },
  {
    id: "santana-terminal",
    name: "Terminal Rodoviário de Santana do Ipanema",
    type: "terminal",
    address: "R. Delmiro Gouveia, s/n - Camoxinga, Santana do Ipanema - AL",
    lat: -9.3625,
    lng: -37.2415,
    city: "Santana do Ipanema",
    cities: [
      "Maceió", "Arapiraca", "Delmiro Gouveia", "Dois Riachos", "Cacimbinhas",
      "Olho d'Água das Flores", "Major Izidoro", "Ouro Branco", "Poço das Trincheiras", "Maravilha"
    ],
  },
  {
    id: "maragogi-ponto",
    name: "Ponto Central de Embarque Maragogi",
    type: "posto",
    address: "Rodovia AL-101 Norte - Centro, Maragogi - AL",
    lat: -9.0125,
    lng: -35.2215,
    city: "Maragogi",
    cities: [
      "Maceió", "Japaratinga", "Porto de Pedras", "Passo de Camaragibe", "São Miguel dos Milagres", "Porto Calvo"
    ],
  },
  {
    id: "uniao-terminal",
    name: "Terminal Rodoviário de União dos Palmares",
    type: "terminal",
    address: "BR-104 - Centro, União dos Palmares - AL",
    lat: -9.1625,
    lng: -36.0315,
    city: "União dos Palmares",
    cities: [
      "Maceió", "São José da Laje", "Murici", "Ibateguara", "Branquinha", "Santana do Mundaú"
    ],
  },
  {
    id: "sao-miguel-terminal",
    name: "Terminal Rodoviário de São Miguel dos Campos",
    type: "terminal",
    address: "BR-101 - Centro, São Miguel dos Campos - AL",
    lat: -9.7812,
    lng: -36.0915,
    city: "São Miguel dos Campos",
    cities: [
      "Maceió", "Arapiraca", "Anadia", "Campo Alegre", "Teotônio Vilela", "Coruripe", "Boca da Mata", "Roteiro"
    ],
  },
]

// Fórmula de Haversine para cálculo da distância esférica em quilômetros
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistance(distanceKm?: number): string | null {
  if (distanceKm === undefined || isNaN(distanceKm)) return null
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`
  }
  return `${distanceKm.toFixed(1).replace(".", ",")} km`
}

// Verifica se um ponto atende a cidade de destino (cruzamento com normalização de texto)
export function isStopServingDestination(stop: MapStop, destino: string): boolean {
  if (!stop || !destino) return false
  const normDest = normalizarTexto(destino)
  return (
    stop.cities?.some((c) => {
      const normC = normalizarTexto(c)
      return normC === normDest || normC.includes(normDest) || normDest.includes(normC)
    }) || false
  )
}

// Retorna todos os pontos de embarque para uma rota (Origem -> Destino)
export function getStopsForRoute(origem: string, destino: string): MapStop[] {
  if (!origem || !destino) return STOPS_DATA
  const normOrigem = normalizarTexto(origem)

  // 1. Prioriza pontos localizados na cidade de origem que atendem o destino
  const stopsNaOrigem = STOPS_DATA.filter((stop) => {
    const isNaOrigem = normalizarTexto(stop.city) === normOrigem
    const atendeDestino = isStopServingDestination(stop, destino)
    return isNaOrigem && atendeDestino
  })

  if (stopsNaOrigem.length > 0) {
    return stopsNaOrigem
  }

  // 2. Se não houver ponto cadastrado na cidade de origem, busca pontos que atendem esse destino
  const stopsQueAtendem = STOPS_DATA.filter((stop) => isStopServingDestination(stop, destino))
  if (stopsQueAtendem.length > 0) {
    return stopsQueAtendem
  }

  // 3. Fallback: pontos na cidade de origem
  const fallbackOrigem = STOPS_DATA.filter((stop) => normalizarTexto(stop.city) === normOrigem)
  if (fallbackOrigem.length > 0) return fallbackOrigem

  return STOPS_DATA
}

// Retorna o ponto mais próximo do usuário que REALMENTE atende o destino escolhido
export function getClosestStopForRoute(
  userLocation: [number, number] | null,
  origem: string,
  destino: string,
  stopsList: MapStop[] = STOPS_DATA
): MapStop | null {
  // Filtra primeiro os pontos que atendem a rota
  const stopsValidos = getStopsForRoute(origem, destino)
  if (stopsValidos.length === 0) return null

  // Se temos a localização do usuário, calcula as distâncias e pega o menor
  if (userLocation) {
    const comDistancias = stopsValidos
      .map((stop) => ({
        ...stop,
        distanceKm: calculateDistance(userLocation[0], userLocation[1], stop.lat, stop.lng),
      }))
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))

    return comDistancias[0] || null
  }

  // Se não temos GPS, prioriza terminais oficiais ou o primeiro ponto estratégico
  const terminalOficial = stopsValidos.find((s) => s.type === "terminal")
  return terminalOficial || stopsValidos[0] || null
}
