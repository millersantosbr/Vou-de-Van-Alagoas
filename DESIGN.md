# Vou de Van - Alagoas Design System

## 1. Visão Geral e Identidade da Marca
O **Vou de Van - Alagoas** é a plataforma de consulta de horários e rotas de transporte complementar intermunicipal do estado de Alagoas, baseada em dados regulados pela ARSAL. A experiência visual é **mobile-first**, amigável, ultra-rápida e inspirada nas cores icônicas das águas e do clima alagoano (Azul Oceano Vibrante, Verde Tropical e Dourado Ensolarado).

---

## 2. Paleta de Cores (Design Tokens)

### Cores Principais
- **Primary / Azul Oceano**: `#0056D2` (HSL: `221 83% 53%` / Dark: `217 91% 60%`)
  - *Uso*: Botões principais, ícones de destaque, horários em evidência e identidade oficial.
- **Secondary / Verde Esmeralda Tropical**: `#00A389`
  - *Uso*: Badges de rotas ativas, selo de oficialidade ARSAL e confirmações.
- **Accent / Dourado Solar**: `#F59E0B`
  - *Uso*: Alerta de "Próxima Saída", contagens e chamadas de atenção.
- **Background Claro**: `#F8FAFC`
- **Background Escuro (Dark Mode)**: `#0B0F19`
- **Card Surface Claro**: `#FFFFFF` com bordas sutis em `rgba(226, 232, 240, 0.8)`
- **Card Surface Escuro**: `#111827` com bordas sutis em `rgba(31, 41, 55, 0.8)`

---

## 3. Tipografia
- **Títulos e Display**: `Outfit` (Moderno, geométrico, imponente e limpo).
- **Corpo e Textos**: `Inter` / `Source Sans 3` (Leitura fluida em dispositivos móveis).
- **Badges Técnicos & Horários**: `JetBrains Mono` / `Inter Black` (Para precisão de dígitos e códigos ARSAL).

---

## 4. Formatos e Ergonomia (Shapes & Spacing)
- **Raio de Borda (Corner Radius)**: `1.5rem` a `2rem` (24px - 32px) para cards e seletores.
- **Botões de Toque (Touch Targets)**: Altura mínima de 48px a 64px para conforto no uso com uma só mão.
- **Profundidade**: Glassmorphism suave com desfoque de fundo (`backdrop-blur-md`) e sombras leves difusas.

---

## 5. Telas Geradas no Stitch (Google Cloud)
- **Project ID**: `123300281637714776`
- **Design System Asset**: `assets/5493946063444212141`
- **Telas Criadas**:
  1. `73a7faf6eff646c8bcabe36ae12d31ed`: **Horários - Vou de Van** (Busca e Próximas Saídas)
  2. `f7bfc5e0272149c99c23794822025065`: **Mapa de Pontos e Terminais** (Mapa Interativo com Bottom Sheet)
  3. `24c506e8551f48ec8b1145228730082c`: **Info ARSAL - Regulamentação e Direitos** (Guia do Passageiro e Ouvidoria)
