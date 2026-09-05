# 🚐 Vou de Van Alagoas

> **A plataforma definitiva de horários, rotas e terminais do transporte intermunicipal complementar de Alagoas.**  
> Acesse agora em produção: [voudevan-al.web.app](https://voudevan-al.web.app)

---

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-orange?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 💡 A História por Trás do Projeto

### 🚀 Meu Primeiro Projeto VIBE CODE
Este projeto marca um momento especial na minha jornada como criador e desenvolvedor: **este é o meu primeiro projeto 100% desenvolvido no conceito de Vibe Coding** — uma abordagem moderna onde a visão de produto, regras de negócio e refinamento visual guiam a inteligência artificial para construir uma aplicação completa, robusta e pronta para produção em tempo recorde.

### 🏛️ A Apresentação de 2023 ao Governo
Em **2023**, após vivenciar repetidamente o caos que é tentar descobrir os horários das vans intermunicipais no estado, desenvolvi uma primeira versão embrionária do aplicativo (bem mais simples e rústica que a atual) e **apresentei formalmente a proposta ao governo estadual**.

A resposta que recebi na época foi desanimadora: disseram que *"não tinham interesse pois já existia uma solução desse tipo em funcionamento"*. 

**A grande verdade? Até hoje essa solução prometida não existe.** A população alagoana continuava sem um meio digital confiável, rápido e acessível para consultar quando a próxima van iria passar ou onde ficavam os pontos de embarque autorizados.

### 🎯 Propósito e Impacto Social
**Eu também ando de van.** Senti na pele a incerteza de ficar no ponto debaixo de sol ou chuva sem saber se o transporte já tinha passado ou quanto tempo faltava para a próxima viagem. 

Meu propósito com o **Vou de Van Alagoas** é provar a minha capacidade técnica de **desenvolver soluções reais e extremamente úteis para a sociedade**. Quando o poder público não atende a uma dor primária do cidadão, a tecnologia independente pode e deve fazer a diferença.

---

## ✨ Funcionalidades Principais

- ⏰ **Cálculo da Próxima Saída em Tempo Real**: Identifica automaticamente qual é a próxima van a sair com contador regressivo (`Em 15 min`, etc.).
- 📋 **Quadro de Horários Inteligente**: Separação clara entre as saídas que ainda vão acontecer hoje e os horários que já passaram.
- 🗺️ **Mapa Interativo de Embarque**: Geolocalização dos terminais e pontos de apoio autorizados por linha, com trava anti-scroll para evitar arraste acidental no mobile e botão integrado para traçar rota no app nativo de mapas do celular (Apple Maps no iOS / Google Maps no Android).
- 📲 **Progressive Web App (PWA) de Alto Padrão**: Instalável diretamente na tela inicial do celular ou desktop, funcionando offline com cache inteligente dos dados da malha rodoviária.
- 💬 **Compartilhamento no WhatsApp**: Envio dos horários e itinerários direto para amigos ou familiares com formatação limpa e link de acesso.
- 🛡️ **Guia de Direitos do Passageiro (ARSAL)**: Consulta rápida às normas regulatórias de gratuidades (idosos, PCDs, estudantes), limites de bagagem, transporte de animais e contato direto da Ouvidoria da ARSAL.
- 🌓 **Tema Dark / Light Nativo**: Adaptação automática à preferência do sistema operacional, com transições suaves e contraste otimizado.
- 💻 **Layout Otimizado para Desktop & Mobile**: Experiência pensada tanto para a tela do smartphone na rua quanto para visualização em duas colunas no computador.

---

## 📸 Galeria de Telas

### 💻 Visualização no Computador (Desktop)

| Seção | Prévia |
| :--- | :--- |
| **Hero & Busca de Linhas** | ![Hero Desktop](App%20Screenshots/desktop_01_hero_busca.png) |
| **Quadro de Horários (Duas Colunas)** | ![Quadro de Horários Desktop](App%20Screenshots/desktop_02_quadro_horarios.png) |
| **Mapa Interativo de Terminais** | ![Mapa Desktop](App%20Screenshots/desktop_03_mapa_pontos.png) |
| **Direitos do Passageiro (ARSAL)** | ![Guia ARSAL Desktop](App%20Screenshots/desktop_04_direitos_ajuda.png) |
| **Instalação PWA & Rodapé** | ![Rodapé Desktop](App%20Screenshots/desktop_05_instalacao_pwa_rodape.png) |

---

### 📱 Visualização no Celular (Mobile)

| Hero (Modo Escuro) | Hero (Modo Claro) | Próximas Saídas |
| :---: | :---: | :---: |
| <img src="App%20Screenshots/mobile_01_hero_busca_dark.png" width="260" alt="Mobile Dark" /> | <img src="App%20Screenshots/mobile_02_hero_busca_light.png" width="260" alt="Mobile Light" /> | <img src="App%20Screenshots/mobile_03_proxima_saida_horarios.png" width="260" alt="Mobile Horários" /> |

| Mapa de Rotas e Pontos | Direitos do Passageiro | Instalação PWA & Rodapé |
| :---: | :---: | :---: |
| <img src="App%20Screenshots/mobile_04_mapa_rotas_embarque.png" width="260" alt="Mobile Mapa" /> | <img src="App%20Screenshots/mobile_05_direitos_ajuda.png" width="260" alt="Mobile Ajuda" /> | <img src="App%20Screenshots/mobile_06_instalacao_pwa_rodape.png" width="260" alt="Mobile PWA" /> |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias Utilizadas |
| :--- | :--- |
| **Framework Web** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, SSR/SSG) |
| **Linguagem & Tipagem** | [TypeScript 5](https://www.typescriptlang.org/) com tipagem estrita de rotas e dados |
| **Estilização & UI** | [Tailwind CSS 3.4](https://tailwindcss.com/), Radix UI Primitives, Lucide Icons, Phosphor Icons |
| **Animações** | [Framer Motion](https://www.framer.com/motion/) para microinterações fluidas |
| **Mapas & Geodados** | [Leaflet](https://leafletjs.com/) e OpenStreetMap com marcadores interativos |
| **Progressive Web App** | Service Workers, Web App Manifest, Cache API para suporte offline completo |
| **Deploy & Infraestrutura** | [Firebase Hosting](https://firebase.google.com/), Regras de Segurança Firestore (OWASP compliant) |

---

## 🔒 Segurança e Confiabilidade

O projeto passou por rigorosa **auditoria de segurança técnica** cobrindo:
- **Isolamento e Regras de Segurança**: Regras estritas no Firestore impedindo escritas não autorizadas (`allow write: if false`).
- **Headers HTTP Defensivos**: Content-Security-Policy (CSP), X-Content-Type-Options (`nosniff`), X-Frame-Options (`DENY`), Referrer-Policy e Permissions-Policy configurados no Firebase Hosting.
- **Sanitização de Entradas**: Validação rigorosa dos parâmetros de busca e filtros de linha.
- **Isenção Institucional Clara**: Identificação transparente como iniciativa independente da sociedade civil com dados baseados na ARSAL.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js 18.x ou superior
- npm ou yarn instalado

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/millersantosbr/Vou-de-Van-Alagoas.git
   cd Vou-de-Van-Alagoas
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o app funcionando.

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 🤝 Como Colaborar

O **Vou de Van Alagoas** é um projeto **Open Source** feito pela e para a comunidade! Toda contribuição é bem-vinda, seja você programador ou não:

- 🚌 **É passageiro ou motorista?** [Sugira novos horários ou pontos de embarque](https://github.com/millersantosbr/Vou-de-Van-Alagoas/issues/new?template=01_atualizacao_rota_horario.yml) que você conhece na sua cidade.
- 🐛 **Encontrou um erro ou bug?** [Abra um relato de bug](https://github.com/millersantosbr/Vou-de-Van-Alagoas/issues/new?template=02_relato_bug.yml) informando o modelo do seu celular ou navegador.
- 💡 **Tem uma sugestão de recurso?** [Envie sua ideia de melhoria](https://github.com/millersantosbr/Vou-de-Van-Alagoas/issues/new?template=03_sugestao_recurso.yml).
- 💻 **Quer codar?** Leia nosso [Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md) para saber como configurar o ambiente, seguir os padrões de código e enviar um Pull Request.

Consulte também nosso [Código de Conduta](CODE_OF_CONDUCT.md), a [Política de Segurança](SECURITY.md) e a [Licença MIT](LICENSE).

---

## 👤 Autor

Desenvolvido com dedicação por **Miller Santos**.

- GitHub: [@millersantosbr](https://github.com/millersantosbr)
- Projeto online: [voudevan-al.web.app](https://voudevan-al.web.app)

---

<p align="center">
  <b>Vou de Van Alagoas</b> — Tecnologia a serviço da mobilidade e do povo alagoano. 🚐🌴
</p>
