import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../horarios_vans_alagoas.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('=== ANÁLISE DO DATASET DE HORÁRIOS DAS VANS DE ALAGOAS ===');
console.log(`Total de Linhas no Dataset: ${data.linhas.length}`);

// Coleta de origens e destinos brutos
const origensRaw = new Set();
const destinosRaw = new Set();
const cidadesRaw = new Set();

data.linhas.forEach((linha) => {
  if (linha.origem) {
    origensRaw.add(linha.origem);
    cidadesRaw.add(linha.origem);
  }
  if (linha.destino) {
    destinosRaw.add(linha.destino);
    cidadesRaw.add(linha.destino);
  }
});

console.log(`\nTotal de variações brutas de cidades encontradas: ${cidadesRaw.size}`);

// Identificação de duplicidades por normalização fonética / sem acento / espaços
const grupos = new Map();

for (const cidade of cidadesRaw) {
  // Chave normalizada: maiúscula, sem acentos, sem hífens pontuais, sem espaços extras
  const chave = cidade
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!grupos.has(chave)) {
    grupos.set(chave, []);
  }
  grupos.get(chave).push(cidade);
}

// Filtra apenas os grupos com variações/duplicidades
const duplicidades = [];
for (const [chave, variantes] of grupos.entries()) {
  if (variantes.length > 1) {
    duplicidades.push({ chave, variantes });
  }
}

console.log('\n--- 1. CIDADES COM GRAFIAS / VARIAÇÕES DUPLICADAS ---');
duplicidades.forEach((d, idx) => {
  console.log(`${idx + 1}. Chave: "${d.chave}" -> Variantes encontradas: [ ${d.variantes.map(v => `"${v}"`).join(', ')} ]`);
});

// Casos especiais identificados manualmente (typos e sufixos):
console.log('\n--- 2. CASOS ESPECIAIS (TYPOS E SUFIXOS DE EXTRAÇÃO) ---');
const casosEspeciais = [
  { problema: '"MACEÓ"', correto: '"Maceió"', motivo: 'Erro de digitação / extração (falta da letra "i") na Linha 113 (JUNQUEIRO - MACEÓ)' },
  { problema: '"MACEIÓ -"', correto: '"Maceió"', motivo: 'Hífen residual de OCR/extração na Linha 218 (SANTA LUZIA DO NORTE - MACEIÓ -)' },
  { problema: '"MACEIÓ METROPOLITANA"', correto: '"Maceió"', motivo: 'Sufixo na Linha 88 (ATALAIA - MACEIÓ METROPOLITANA)' },
  { problema: '"MAJOR ISIDORO" vs "MAJOR IZIDORO"', correto: '"Major Izidoro"', motivo: 'Grafia oficial com "Z" (IBGE)' },
  { problema: '"MATRIZ DO CAMARAGIBE"', correto: '"Matriz de Camaragibe"', motivo: 'Preposição correta "de" (IBGE)' },
  { problema: '"SÃO LUIZ DO QUITUNDE"', correto: '"São Luís do Quitunde"', motivo: 'Grafia oficial com "S" e acento (IBGE)' },
  { problema: '"SAO BRAS" / "SÃO BRAS"', correto: '"São Brás"', motivo: 'Acento agudo no "Á"' },
  { problema: '"PAO DE ACUCAR" / "PÃO DE AÇUCAR"', correto: '"Pão de Açúcar"', motivo: 'Acentos no "Ã" e "Ú"' },
  { problema: '"TEOTONIO VILELA"', correto: '"Teotônio Vilela"', motivo: 'Circunflexo no "Ô"' },
  { problema: '"LUZIAPOLIS"', correto: '"Luziápolis"', motivo: 'Distrito de Campo Alegre com acento' },
  { problema: '"FOLHA MÍUDA"', correto: '"Folha Miúda"', motivo: 'Povoado de Craíbas' }
];

casosEspeciais.forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.problema} -> ${c.correto} (${c.motivo})`);
});
