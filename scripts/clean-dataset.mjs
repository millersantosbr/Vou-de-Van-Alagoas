import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../horarios_vans_alagoas.json');
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Dicionário completo de normalização para os nomes oficiais e canônicos
export const CITY_CANONICAL_MAP = {
  // Variações de Maceió
  'MACEIO': 'Maceió',
  'MACEIÓ': 'Maceió',
  'MACEIÓ -': 'Maceió',
  'MACEIÓ METROPOLITANA': 'Maceió',
  'MACEÓ': 'Maceió',

  // Variações com/sem acento e ortografia oficial (IBGE / ARSAL)
  'AGUA BRANCA': 'Água Branca',
  'ÁGUA BRANCA': 'Água Branca',
  'ANADIA': 'Anadia',
  'ARAPIRACA': 'Arapiraca',
  'ATALAIA': 'Atalaia',
  'BARRA DE SANTO ANTONIO': 'Barra de Santo Antônio',
  'BARRA DE SANTO ANTÔNIO': 'Barra de Santo Antônio',
  'BARRA DE SÃO MIGUEL': 'Barra de São Miguel',
  'BATALHA': 'Batalha',
  'BELÉM': 'Belém',
  'BELO MONTE': 'Belo Monte',
  'BOCA DA MATA': 'Boca da Mata',
  'BRANQUINHA': 'Branquinha',
  'CACIMBINHAS': 'Cacimbinhas',
  'CAJUEIRO': 'Cajueiro',
  'CAMPO ALEGRE': 'Campo Alegre',
  'CANAPI': 'Canapi',
  'CAPELA': 'Capela',
  'CARNEIROS': 'Carneiros',
  'CHÃ PRETA': 'Chã Preta',
  'COLÔNIA LEOPOLDINA': 'Colônia Leopoldina',
  'COQUEIRO SECO': 'Coqueiro Seco',
  'CORURIPE': 'Coruripe',
  'CRAÍBAS': 'Craíbas',
  'CRUZEIRO DO SUL': 'Cruzeiro do Sul',
  'DELMIRO GOUVEIA': 'Delmiro Gouveia',
  'DENISSON AMORIM': 'Denisson Amorim',
  'DOIS RIACHOS': 'Dois Riachos',
  'ESTRELA DE ALAGOAS': 'Estrela de Alagoas',
  'FEIRA GRANDE': 'Feira Grande',
  'FELIZ DESERTO': 'Feliz Deserto',
  'FLEXEIRAS': 'Flexeiras',
  'FOLHA MÍUDA': 'Folha Miúda',
  'GIRAU DO PONCIANO': 'Girau do Ponciano',
  'IBATEGUARA': 'Ibateguara',
  'IGACI': 'Igaci',
  'IGREJA NOVA': 'Igreja Nova',
  'INHAPI': 'Inhapi',
  'JEQUIÁ DA PRAIA': 'Jequiá da Praia',
  'JOAQUIM GOMES': 'Joaquim Gomes',
  'JUNQUEIRO': 'Junqueiro',
  'LAGOA DA CANOA': 'Lagoa da Canoa',
  'LIMOEIRO DE ANADIA': 'Limoeiro de Anadia',
  'LUZIAPOLIS': 'Luziápolis',
  'MAJOR ISIDORO': 'Major Izidoro',
  'MAJOR IZIDORO': 'Major Izidoro',
  'MARAGOGI': 'Maragogi',
  'MARAVILHA': 'Maravilha',
  'MARIBONDO': 'Maribondo',
  'MASSAGUEIRA': 'Massagueira',
  'MATA GRANDE': 'Mata Grande',
  'MATRIZ DO CAMARAGIBE': 'Matriz de Camaragibe',
  'MATRIZ DE CAMARAGIBE': 'Matriz de Camaragibe',
  'MESSIAS': 'Messias',
  'MINADOR DO NEGRAO': 'Minador do Negrão',
  'MINADOR DO NEGRÃO': 'Minador do Negrão',
  'MURICI': 'Murici',
  'NOVO LINO': 'Novo Lino',
  "OLHO D'ÁGUA DAS FLORES": "Olho d'Água das Flores",
  "OLHO D'ÁGUA GRANDE": "Olho d'Água Grande",
  'OLIVENÇA': 'Olivença',
  'OURO BRANCO': 'Ouro Branco',
  'PALESTINA': 'Palestina',
  'PALMEIRA DOS ÍNDIOS': 'Palmeira dos Índios',
  'PAO DE ACUCAR': 'Pão de Açúcar',
  'PÃO DE AÇUCAR': 'Pão de Açúcar',
  'PÃO DE AÇÚCAR': 'Pão de Açúcar',
  'PARICONHA': 'Pariconha',
  'PAULO JACINTO': 'Paulo Jacinto',
  'PENEDO': 'Penedo',
  'PIAÇABUÇU': 'Piaçabuçu',
  'PILAR': 'Pilar',
  'PIRANHAS': 'Piranhas',
  'PORTO CALVO': 'Porto Calvo',
  'PORTO DE PEDRAS': 'Porto de Pedras',
  'PORTO REAL DO COLÉGIO': 'Porto Real do Colégio',
  'POÇO DAS TRINCHEIRAS': 'Poço das Trincheiras',
  'QUEBRANGULO': 'Quebrangulo',
  'RIO LARGO': 'Rio Largo',
  'ROTEIRO': 'Roteiro',
  'SANTA CRUZ DO DESERTO': 'Santa Cruz do Deserto',
  'SANTA LUZIA DO NORTE': 'Santa Luzia do Norte',
  'SANTANA DO IPANEMA': 'Santana do Ipanema',
  'SANTANA DO MUNDAÚ': 'Santana do Mundaú',
  'SAO BRAS': 'São Brás',
  'SÃO BRAS': 'São Brás',
  'SÃO BRÁS': 'São Brás',
  'SAO JOSE DA TAPERA': 'São José da Tapera',
  'SÃO JOSÉ DA LAJE': 'São José da Laje',
  'SÃO JOSÉ DA TAPERA': 'São José da Tapera',
  'SÃO LUIZ DO QUITUNDE': 'São Luís do Quitunde',
  'SÃO LUÍS DO QUITUNDE': 'São Luís do Quitunde',
  'SÃO MIGUEL DOS CAMPOS': 'São Miguel dos Campos',
  'SÃO SEBASTIÃO': 'São Sebastião',
  'SENADOR RUI PALMEIRA': 'Senador Rui Palmeira',
  "TANQUE D'ARCA": "Tanque d'Arca",
  'TEOTONIO VILELA': 'Teotônio Vilela',
  'TEOTÔNIO VILELA': 'Teotônio Vilela',
  'TRAIPU': 'Traipu',
  'UNIÃO DOS PALMARES': 'União dos Palmares',
  'VIÇOSA': 'Viçosa'
};

export function normalizeCity(name) {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (CITY_CANONICAL_MAP[trimmed]) {
    return CITY_CANONICAL_MAP[trimmed];
  }
  // Fallback: se não estiver no mapa direto, tenta encontrar por chave sem acento
  const chave = trimmed
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const [k, v] of Object.entries(CITY_CANONICAL_MAP)) {
    const kChave = k
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (kChave === chave) return v;
  }

  return trimmed;
}

// Limpeza das linhas
let alteracoes = 0;
const novasLinhas = rawData.linhas.map((linha) => {
  let { codigo, nome_linha, origem, destino, via, itinerario } = linha;

  // Correção das 3 linhas que tinham campos vazios
  if (codigo === '31' && (!origem || !destino)) {
    origem = 'Arapiraca';
    destino = 'Maceió';
    nome_linha = 'ARAPIRACA - MACEIÓ';
  } else if (codigo === '8' && (!origem || !destino)) {
    origem = 'Marechal Deodoro';
    destino = 'Maceió';
    nome_linha = 'MARECHAL DEODORO - MACEIÓ (VIA POEIRA / TUCANDUBA)';
  } else if (codigo === '7' && (!origem || !destino)) {
    origem = 'Rio Largo';
    destino = 'Maceió';
    nome_linha = 'RIO LARGO - MACEIÓ (VIA BR-104)';
  }

  const novaOrigem = normalizeCity(origem);
  const novoDestino = normalizeCity(destino);

  if (novaOrigem !== linha.origem || novoDestino !== linha.destino) {
    alteracoes++;
  }

  // Ajuste do nome da linha se tiver typo
  let novoNome = nome_linha || `${novaOrigem.toUpperCase()} - ${novoDestino.toUpperCase()}`;
  if (novoNome.includes('MACEÓ')) {
    novoNome = novoNome.replace('MACEÓ', 'MACEIÓ');
  }
  if (novoNome.includes('MACEIÓ - (')) {
    novoNome = novoNome.replace('MACEIÓ - (', 'MACEIÓ (');
  }
  if (novoNome.includes('MACEIÓ -')) {
    novoNome = novoNome.replace(/MACEIÓ\s*-\s*$/, 'MACEIÓ');
  }

  return {
    ...linha,
    codigo,
    nome_linha: novoNome,
    origem: novaOrigem,
    destino: novoDestino,
    via: via ? via.trim() : null
  };
});

// Verificação de cidades resultantes
const cidadesLimpas = new Set();
novasLinhas.forEach(l => {
  if (l.origem) cidadesLimpas.add(l.origem);
  if (l.destino) cidadesLimpas.add(l.destino);
});

const listaOrdenada = Array.from(cidadesLimpas).sort((a, b) => a.localeCompare(b, 'pt-BR'));

console.log(`\nLinhas com correções de cidade aplicadas: ${alteracoes}`);
console.log(`Total de cidades únicas após limpeza: ${listaOrdenada.length} (antes eram 102)`);
console.log('\n--- Lista Consolidada e Limpa das Cidades (Sem Duplicidades) ---');
console.log(listaOrdenada.join(', '));

// Exporta o novo JSON limpo se executado diretamente com argumento --apply
if (process.argv.includes('--apply')) {
  // Backup do arquivo original
  const backupPath = path.resolve(__dirname, '../horarios_vans_alagoas.json.bak');
  fs.writeFileSync(backupPath, JSON.stringify(rawData, null, 2), 'utf8');
  console.log(`\nBackup criado em: ${backupPath}`);

  // Grava novo arquivo JSON limpo
  const cleanedData = {
    ...rawData,
    metadata: {
      ...rawData.metadata,
      descricao: 'Dataset higienizado e normalizado das linhas de transporte complementar intermunicipal reguladas pela ARSAL/AL.',
      data_limpeza: new Date().toISOString()
    },
    linhas: novasLinhas
  };

  fs.writeFileSync(jsonPath, JSON.stringify(cleanedData, null, 2), 'utf8');
  console.log(`Arquivo ${jsonPath} atualizado com sucesso!`);
}
