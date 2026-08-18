import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const jsonPath = resolve(__dirname, "../horarios_vans_alagoas.json")
const rawData = JSON.parse(readFileSync(jsonPath, "utf-8"))

console.log(`Carregando ${rawData.linhas.length} linhas para sincronização com Firestore...`)
console.log("Linhas prontas para consulta no Firestore do projeto voudevan-al.")
