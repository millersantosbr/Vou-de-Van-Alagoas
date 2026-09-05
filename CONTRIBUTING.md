# 🤝 Guia de Contribuição — Vou de Van Alagoas

Primeiramente, **muito obrigado pelo seu interesse em colaborar!** 🎉

O **Vou de Van Alagoas** nasceu da vontade de resolver um problema real da nossa terra. É uma iniciativa independente, aberta e feita para o povo alagoano. Toda ajuda — seja ajustando um horário de van, corrigindo um ponto de embarque no mapa ou escrevendo código — é extremamente bem-vinda!

---

## 🧭 Como Você Pode Ajudar?

Você **não precisa ser programador** para contribuir! Escolha a forma que melhor se encaixa com você:

### 1. 🕒 Sou Passageiro, Motorista ou Morador e Quero Atualizar Horários/Rotas
Se você notou que uma linha mudou de horário, que uma nova rota foi criada pela ARSAL/cooperativas ou que um ponto de embarque mudou de lugar:
- Acesse a aba de **[Issues](https://github.com/millersantosbr/Vou-de-Van-Alagoas/issues)**.
- Clique em **New Issue** e escolha o modelo **"🚌 Atualização de Linha / Horário / Ponto"**.
- Preencha os detalhes (cidade de origem, destino, novos horários ou localização do ponto). Nossa equipe atualizará a base de dados do app!

### 2. 🐛 Encontrou um Problema ou Bug?
Se algo não funcionou como esperado no celular ou computador:
- Abra uma issue usando o modelo **"🐛 Relato de Erro / Bug"**.
- Inclua o dispositivo (ex: iPhone 13 / Android Galaxy S21 / PC Chrome), o que você estava tentando fazer e, se possível, uma captura de tela.

### 3. 💡 Tem uma Ideia de Funcionalidade?
Sugestões de melhorias de interface, novos recursos ou integrações são sempre bem-vindas! Use o modelo **"💡 Sugestão de Funcionalidade"**.

### 4. 💻 Quero Desenvolver Código
Se você é desenvolvedor(a) e quer colocar a mão no código:
- Dê uma olhada nas [Issues abertas](https://github.com/millersantosbr/Vou-de-Van-Alagoas/issues) marcadas com `good first issue` ou `help wanted`.
- Siga o passo a passo abaixo para configurar o ambiente e enviar seu Pull Request.

---

## 🛠️ Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- **Node.js**: versão 18.18+ (recomendado 20.x ou superior)
- **Git** instalado na sua máquina
- Gerenciador de pacotes **npm**

### Passo a Passo

1. **Faça um Fork** deste repositório para o seu perfil no GitHub.
2. **Clone** o seu fork localmente:
   ```bash
   git clone https://github.com/SEU-USUARIO/Vou-de-Van-Alagoas.git
   cd Vou-de-Van-Alagoas
   ```
3. **Crie uma branch** descritiva para a sua alteração:
   ```bash
   git checkout -b feat/minha-melhoria
   # ou
   git checkout -b fix/correcao-horario
   ```
4. **Instale as dependências:**
   ```bash
   npm install
   ```
5. **Execute o servidor local:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📐 Padrões e Boas Práticas

- **Mobile-First**: A maioria dos usuários consulta o app diretamente no celular, no ponto de van. Qualquer alteração de UI deve ser testada em telas pequenas (360px - 428px) antes de telas grandes.
- **Tipagem Estrita com TypeScript**: Evite usar `any`. Mantenha as tipagens dos modelos de rota e horários consistentes.
- **Tailwind CSS**: Utilizamos classes utilitárias do Tailwind e tokens do nosso design system (definidos em `DESIGN.md`).
- **Validação de Build**: Antes de abrir seu Pull Request, certifique-se de que o projeto compila sem erros:
   ```bash
   npm run build
   ```

---

## 📦 Como Atualizar os Dados de Rotas

Os dados das vans estão localizados em:
- `horarios_vans_alagoas.json`: Dataset principal com as linhas, códigos ARSAL, origens, destinos e horários estruturados.
- `lib/stops-data.ts`: Mapeamento de coordenadas geográficas dos terminais e pontos de embarque autorizados.

Se você estiver atualizando rotas, verifique se os nomes das cidades seguem a ortografia oficial canônica (definida em `scripts/clean-dataset.mjs`).

---

## 🚀 Enviando seu Pull Request (PR)

1. Faça commit das suas alterações seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` nova funcionalidade
   - `fix:` correção de bug ou horário
   - `docs:` documentação
   - `style:` formatação e ajustes visuais sem alteração de lógica
   - `refactor:` refatoração de código
2. Faça o push para a sua branch:
   ```bash
   git push origin feat/minha-melhoria
   ```
3. Acesse o repositório no GitHub e clique em **Compare & pull request**.
4. Preencha o template de Pull Request explicando o que foi alterado e como foi testado.
5. Aguarde o review! Faremos o possível para responder com rapidez e carinho.

---

## 📜 Código de Conduta

Ao participar deste projeto, você concorda em seguir o nosso [Código de Conduta](CODE_OF_CONDUCT.md), tratando todos os colaboradores com empatia, respeito e civilidade.

Juntos fazemos o transporte em Alagoas melhor para todo mundo! 🚐🌴
