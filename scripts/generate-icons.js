// Este script pode ser executado com Node.js para gerar os ícones
// Você precisará instalar o pacote sharp: npm install sharp

const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

// Certifique-se de que o diretório public existe
const publicDir = path.join(__dirname, "../public")
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// URL da imagem original
const imageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/icon-cDvt1WabJtIraHc6xNWJnNMWSLIkSK.png"

// Função para baixar a imagem
async function downloadImage() {
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Função para gerar os ícones
async function generateIcons() {
  try {
    console.log("Baixando imagem original...")
    const imageBuffer = await downloadImage()

    console.log("Gerando ícones...")

    // Gerar favicon.ico (32x32)
    await sharp(imageBuffer).resize(32, 32).toFile(path.join(publicDir, "favicon.ico"))

    // Gerar icon-192.png
    await sharp(imageBuffer).resize(192, 192).png().toFile(path.join(publicDir, "icon-192.png"))

    // Gerar icon-512.png
    await sharp(imageBuffer).resize(512, 512).png().toFile(path.join(publicDir, "icon-512.png"))

    // Gerar apple-icon.png
    await sharp(imageBuffer).resize(180, 180).png().toFile(path.join(publicDir, "apple-icon.png"))

    console.log("Ícones gerados com sucesso!")
  } catch (error) {
    console.error("Erro ao gerar ícones:", error)
  }
}

generateIcons()

