# Joy Sushi Bar — proposta de site

Página inicial responsiva redesenhada com composição editorial, abertura imersiva, fotografias reais fornecidas pelo cliente, galeria com transições suaves e controle de pausa, cardápio de 141 itens, contato e delivery. Inclui entrada suave das seções, cabeçalho transparente com logo centralizada, fotografias sem sobreposição, preferência por movimento reduzido e fontes locais.

## Identidade
- Vermelho: #d52e2d
- Preto: #141313
- Branco: #ffffff
- Gang of Three na assinatura VOCÊ MERECE JOY!, Cormorant Garamond nos demais títulos, Fahkwang nos detalhes de marca e Mona Sans no texto.
- Fotografias reais provenientes do acervo do Joy utilizado no projeto do cardápio.

## Aplicação no WordPress
O diretório dist contém a referência navegável em HTML, CSS e JavaScript, com imagens e fontes locais. Esta versão é uma prévia de design; não é um tema nem um arquivo de importação de Elementor.

Reproduzir no editor instalado as seções: cabeçalho sobreposto, abertura com galeria, experiência Joy, galeria expansível de pratos, cardápio com categorias laterais, delivery, localização com foto do Alpha Mall, espaço para tour virtual, galeria do Instagram e rodapé. Aplicar a paleta e tipografia globais, subir os arquivos de assets à biblioteca de mídia e substituir seus caminhos. Reconstruir os blocos como elementos editáveis do editor para facilitar atualizações futuras. O CSS responsivo serve como referência exata das proporções.

O cardápio vem da versão 13 do projeto anterior. Antes da publicação no domínio oficial, confirmar preços, horários e disponibilidade com o restaurante. O PDF para download é o JOY-cardapio-v15-WhatsApp.pdf indicado pelo cliente em 14/09/2026, com 14 páginas, publicado como enviado. O domínio oficial não foi alterado.

## Prévia local
Servir dist com um servidor HTTP estático. Nenhuma instalação de dependências é necessária.

## Canais de delivery
Os botões levam diretamente ao WhatsApp do Joy e às lojas no iFood e 99Food fornecidas pelo cliente.

## Fontes de identidade e ícones
- Logo transparente: joyrestaurante.com, arquivo público da marca.
- WhatsApp: Bootstrap Icons 1.11.3 (MIT).
- iFood: Simple Icons v13 (CC0).
- 99Food: repositório oficial de materiais para restaurantes, restaurantes.99app.com/repositorio/.

## Ajuste de fotografia e assinatura
Assinatura: VOCÊ MERECE JOY!
A seção Conheça o Joy alterna três fotos do acervo FOTOS PRATOS JOY a cada cinco segundos enquanto visível, com seleção manual e pausa. A galeria do Instagram usa quatro fotografias com pratos centralizados e enquadramentos individuais em CSS. As imagens originais foram preservadas. O fundo do delivery usa o vermelho #d52e2d da identidade.

## Atualização de identidade e movimento
Instagram oficial: https://www.instagram.com/joysushibarssa/. O e-mail foi retirado. As entradas das seções se repetem ao retornar pelo topo ou pela base da tela, respeitando o controle de pausa e a preferência por movimento reduzido.

A assinatura usa Gang of Three, de Vic Fieger: https://www.1001fonts.com/gang-of-three-font.html. Licença de uso comercial e incorporação: https://www.1001fonts.com/licenses/ffc.html. Arquivo original preservado, sem alteração dos glifos.

## Tour virtual
A seção #tour-virtual está reservada, com indicação Em breve. Quando o tour estiver disponível, substituir o conteúdo do elemento data-tour-embed pelo iframe do fornecedor, com título acessível. A área já possui dimensões responsivas; não há integração ativa nem link fictício.

## Qualidade e manutenção

Inclui testes Vitest, Playwright, Stryker, ArchContract, Biome, Commitlint e Knip; workflow GitHub Actions e integração opcional com Sentry e Codecov. Consulte docs/QUALITY.md para escopo, comandos, resultados e serviços que ainda precisam ser conectados. As nove Issues estão em https://github.com/jefersojagp-coder/joyssa/issues; seus critérios também estão documentados em docs/issues.

## SEO local e publicação no domínio oficial

Textos, metadados e dados estruturados preparados para buscas por restaurante japonês e delivery em Alphaville, Salvador. Consulte docs/SEO.md para a aplicação ao WordPress e os limites da prévia de apresentação. `npm run seo:production` gera uma exportação estática em work/joy-production, sem alterar o acesso do Sites.

## Repositório informado

Destino: https://github.com/jefersojagp-coder/joyssa. O acesso de escrita foi autorizado pelo proprietário. O workflow manual “Create project issues” permite republicar o backlog, verificando títulos existentes antes de criar. O envio desta pasta deve excluir .openai, .git, work, outputs, arquivos .env e node_modules.

## Atualização de fotos e PDF

A fachada usa a nova imagem Alpha Mall enviada em 13/09/2026. A categoria Quentes & doces usa a fotografia real de yakisoba RBS09772.jpg, do acervo do Joy, com enquadramento preservado e arquivo otimizado para web. O PDF WhatsApp v15 substitui a versão anterior apenas no download; os 141 itens do cardápio navegável foram preservados.
