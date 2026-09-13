# Qualidade e operação do Joy

O site permanece estático e compatível com a adaptação ao WordPress. Ferramentas de desenvolvimento não são carregadas pelo visitante. O repositório informado é `jefersojagp-coder/joyssa`, público na consulta de 13/09/2026. GitHub Actions está preparado; as regras da branch principal devem revisar os jobs quality e browser.

## Ferramentas adotadas

- ArchContract: verifica as dependências entre interface, recursos e configuração. Um contrato adicional protege as 141 opções do cardápio, os três canais de delivery e os arquivos publicados.
- Biome: padronização e análise do JavaScript e das configurações. O CSS legado permanece fora dessa primeira etapa para preservar o visual; não significa que todo o CSS foi auditado.
- Commitlint: convenção das mensagens dos novos commits em pull requests. Interpretação do nome “Comilint” informado na solicitação.
- Knip: detecta arquivos, exports e dependências sem uso; o SDK compilado é tratado como material de terceiro.
- Vitest: testes unitários e integração com o HTML real, com cobertura de código.
- Playwright: navegação no Chromium em desktop e celular, teclado, movimento reduzido, imagens indisponíveis, cardápio e links de pedidos.
- Stryker: testes de mutação dos módulos de movimento e observabilidade; executados sob demanda, não a cada pequena alteração visual. Interpretação do nome “Stryke”.
- Codecov: envio preparado no workflow, desativado até configurar a conta, CODECOV_TOKEN e a variável CODECOV_ENABLED=true. Os relatórios locais funcionam independentemente dele.

## Monitoramento

O site coleta localmente um máximo de 50 diagnósticos de falhas e desempenho em memória. Não persiste identificadores, textos de erros, dados digitados nem URLs dos visitantes. Não é um painel de observabilidade remoto nem substitui alertas.

Escolha inicial: Sentry. O SDK oficial está incorporado como um módulo carregado somente quando `dist/monitoring-config.js` contém enabled=true e o DSN público de um projeto válido. Sem essa configuração, nenhum SDK é baixado pelo visitante e nenhum evento sai do navegador. API tokens privados não podem entrar nesse arquivo. Validar um evento real no painel antes de considerar os alertas operacionais.

Datadog e New Relic são alternativas para uma operação que já use esses serviços. OpenTelemetry deve ser adotado quando houver backend próprio/WordPress com collector e destino definidos. Não foram ativados agentes fictícios nem múltiplos serviços redundantes. O backlog registra critérios para essas decisões.

## Movimento

Skill aplicada: [Design Motion Principles](https://github.com/kylezantos/design-motion-principles/blob/main/skills/design-motion-principles/SKILL.md), revisão 4a9ca879f24a361f4dca4174fe2da0f67b5ddee3. Contexto: site de restaurante, Jakub Krehel como referência principal de refinamento e Emil Kowalski na navegação frequente. Entradas de seção com 420ms; menu com entrada de 240ms e saída de 140ms; categorias com 220ms. Teclado e movimento reduzido recebem estados imediatos. Fotos abaixo da abertura usam lazy loading; placeholders desaparecem ao carregar ou falhar. O progresso superior mede rolagem, não simula progresso de download.

## Executar

Node 24 e npm: `npm ci`, `npm run check`, `npx playwright install chromium`, `npm run test:e2e`, `npm run test:mutation`. `npm run dev` serve a prévia. `npm run build:monitoring` recompila o SDK do Sentry a partir do lockfile. O site continua publicado pelo Sites; nenhuma credencial desse serviço deve ser copiada para GitHub.

## Dependências externas pendentes

GitHub autenticado pelo proprietário; as nove Issues estão publicadas em https://github.com/jefersojagp-coder/joyssa/issues. Sentry e Codecov ainda precisam das respectivas contas e configurações. Os testes locais não equivalem a uma execução do GitHub Actions.

## Validação desta entrega

19 testes unitários e de integração passaram; cobertura de linhas de 86,15%, incluindo verificações de SEO e exportação pública isolada. Stryker analisou 209 mutações, com pontuação de 80,86%. ArchContract, contratos do cardápio, Biome e Knip passaram. A auditoria das dependências não encontrou vulnerabilidades conhecidas na versão instalada. Os oito cenários Playwright passaram no GitHub Actions, em desktop e celular, após corrigir a sobreposição que bloqueava o botão de pausa no desktop. Os 19 testes unitários e de integração e as verificações de código também passaram. Execução: https://github.com/jefersojagp-coder/joyssa/actions/runs/34746037181.

O SDK Sentry compilado é uma exceção explícita do Knip, pois seu import está no gerador do bundle. Vite foi fixado em uma versão compatível com o executor de testes.
