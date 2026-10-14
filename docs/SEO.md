# SEO do Joy Sushi Bar — domínio definitivo

Preparado em 14/10/2026 para **https://joysushibar.com.br/**. O domínio ainda não foi comprado nem ativado; esta entrega não registra o domínio nem configura DNS, Search Console ou Perfil da Empresa.

## Implementação

- Título: Joy Sushi Bar | Restaurante japonês em Alphaville, Salvador.
- Descrição: Joy Sushi Bar no Alpha Mall, Alphaville, Salvador. Conheça os sushis, barcas e menu executivo. Peça delivery pelo WhatsApp, iFood ou 99Food.
- Canonical, URLs de compartilhamento e identificadores de dados estruturados preparados para HTTPS, domínio em minúsculas, sem www e com barra final.
- Dados Restaurant, WebSite, WebPage e Menu: endereço, telefone, cozinha japonesa, Instagram, fotos reais, categorias e os dois PDFs finais. Horários confirmados pelo cliente em 14/10/2026: segunda a sábado, 11h–23h; domingo, 15h–23h.
- Conteúdo local em texto: Alphaville, Salvador, Shopping Alpha Mall, como chegar, sushi, temaki, barcas, delivery e menu executivo. A assinatura visual “VOCÊ MERECE JOY!” foi preservada.
- Perguntas visíveis sobre frescor, localização, delivery, cardápio, menu executivo e salão. Não há promessa de resultado enriquecido de FAQ para restaurante.
- Os 141 itens do cardápio e os 33 do executivo permanecem no HTML. Sem JavaScript, os cardápios são legíveis; com JavaScript, continuam fechados até o visitante escolher uma opção.
- Títulos, descrição, canonical e dados estruturados são gerados antes da publicação, sem depender de execução no navegador.
- PDFs finais preservados: principal v17 e executivo v4. Os preços do HTML não foram reextraídos dos PDFs nesta entrega; conferir a concordância dos preços antes do lançamento.
- Fontes locais convertidas para WOFF2: de 730.620 para 184.900 bytes (aproximadamente 75% menos), sem alterar o desenho das letras. Mantêm font-display: swap, prioridade alta na imagem de abertura, dimensões explícitas e carregamento adiado das fotos abaixo da abertura.
- Sitemap XML apenas com a página real do site, incluindo imagens. Âncoras de seções não são apresentadas como páginas independentes.
- Nenhuma nota, avaliação, prêmio, coordenada, CEP, área de entrega ou promoção foi inventada. Schema não substitui conteúdo e não garante destaque nos resultados.

## Duas versões, sem confundir publicação com indexação

**Prévia de apresentação (Sites):** mantém meta noindex, nofollow. O robots permite rastrear o HTML para que o Google possa ler noindex; bloqueia o rastreamento dos PDFs da prévia. Não há sitemap da prévia. Essas regras não são controle de acesso e não garantem remoção imediata de uma URL eventualmente conhecida pelo Google.

**Versão definitiva (StayCloud):** `npm run seo:production` gera `work/joy-production/` com canonical em joysushibar.com.br, indexação liberada e sitemap. Não altera o domínio nem o acesso da prévia. O ZIP de entrega contém os arquivos estáticos na raiz; não é um tema WordPress.

Para atualizar: editar a fonte em `dist/`, executar `npm run seo:preview`, validar com `npm run check` e gerar novamente a versão de produção. Não subir a pasta dist de apresentação como se fosse a versão definitiva: ela contém noindex.

## Ativação após comprar o domínio

1. Registrar joysushibar.com.br em conta controlada pelo cliente. Definir renovação e responsável. Ainda não foi verificada a disponibilidade atual do registro.
2. Publicar o conteúdo do ZIP **JOY-site-joysushibar.com.br.zip** na hospedagem StayCloud. Configurar DNS conforme os destinos fornecidos pela hospedagem, nunca com IP presumido.
3. Ativar certificado HTTPS válido para joysushibar.com.br e www.joysushibar.com.br. Definir redirecionamento permanente de HTTP e www para https://joysushibar.com.br/ na hospedagem, preservando caminhos e parâmetros. Testar ausência de loops, inclusive quando houver proxy/CDN.
4. Conferir HTTP 200 na home, robots.txt, sitemap.xml, imagens e PDFs. URLs inexistentes devem retornar 404 real, sem servir a home com status 200. Configurar Brotli/gzip, MIME corretos (inclusive font/woff2) e cache na plataforma: HTML com revalidação; arquivos alterados precisam de versionamento ou limpeza de cache.
5. Confirmar que o HTML definitivo não contém noindex e que não existe X-Robots-Tag: noindex vindo da plataforma. Remover proteções de homologação/login e verificar se firewall/CDN permite Googlebot e recursos públicos.
6. Criar propriedade de domínio **joysushibar.com.br** no Google Search Console, verificar pelo TXT DNS que o Google fornecer e enviar **https://joysushibar.com.br/sitemap.xml**. Não existe token de verificação genérico para preparar antecipadamente.
7. Executar Inspeção de URL e teste ao vivo no Search Console; solicitar indexação da home. Validar os dados com Rich Results Test. Medir no PageSpeed Insights mobile e desktop; acompanhar Core Web Vitals reais quando houver dados de tráfego. Testes locais não substituem essas medições.
8. Atualizar o Perfil da Empresa no Google com o novo site, endereço, telefone, horários, cardápio, fotos e categorias coerentes. Usar o nome comercial real, sem adicionar palavras-chave ao nome. Confirmar horários em feriados e atualizar quando mudarem.
9. Atualizar links do Instagram, WhatsApp Business, iFood, 99Food e demais perfis controlados pelo restaurante para o domínio definitivo. Solicitar avaliações autênticas a clientes, sem compra, incentivo ou seleção só de avaliações positivas.
10. Conferir com o restaurante preços, disponibilidade e consistência entre cardápio HTML e os dois PDFs antes de anunciar o lançamento.

## Migração do domínio antigo

Se o cliente ainda controla joyrestaurante.com, preservar o acesso até concluir a migração. Levantar URLs indexadas, links importantes e sitemap do WordPress antigo antes de removê-lo. Não apagar o WordPress ou mudar DNS nesta etapa.

Criar redirecionamentos permanentes de cada URL antiga para uma equivalente real do novo site; não encaminhar todas indiscriminadamente para a home. A raiz antiga pode apontar para a nova raiz. Para URLs de PDF antigas, encaminhar à versão atual correspondente. Manter os redirecionamentos por pelo menos um ano e, se possível, por mais tempo. Verificar as duas propriedades no Search Console e usar a ferramenta de mudança de endereço quando aplicável. A implantação desses redirecionamentos depende do acesso à hospedagem antiga.

## Busca local e recomendações de IA

Foco principal: restaurante japonês em Alphaville, Salvador. Consultas relacionadas atendidas pelo conteúdo: sushi no Alpha Mall, cardápio Joy Sushi Bar, delivery Joy Salvador e menu executivo japonês em Alphaville. Não criar páginas repetidas para bairros nem textos com repetição artificial de palavras-chave.

Conteúdo factual em HTML, identificação clara do negócio, dados estruturados coerentes e páginas rastreáveis ajudam buscadores e sistemas de IA a interpretar a empresa. O Google não exige um arquivo especial llms.txt ou um schema de IA. Não há garantia de primeira posição, indexação ou citação por assistentes.

## Acompanhamento após lançamento

Usar Search Console para impressões, cliques, consultas, páginas indexadas e erros; usar Perfil da Empresa para contatos, rotas e visitas ao site. Comparar períodos de 28 dias, separando buscas pela marca das buscas genéricas locais. Corrigir problemas de rastreamento primeiro; depois melhorar conteúdos com base em buscas reais e manter fotos, horários e cardápios atualizados. Nenhum serviço de acompanhamento recorrente foi ativado nesta entrega.

## Fontes oficiais

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/appearance/ai-features
- https://support.google.com/business/answer/7091?hl=pt-BR
