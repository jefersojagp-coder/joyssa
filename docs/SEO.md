# SEO local do Joy Sushi Bar

## O que foi implementado

- Título: **Joy Sushi Bar | Restaurante japonês em Alphaville, Salvador**.
- Descrição: **Sushis, sashimis, temakis e combinados no Alpha Mall, em Alphaville, Salvador. Veja o cardápio do Joy e peça por WhatsApp, iFood ou 99Food.**
- Textos identificam o restaurante, a cozinha japonesa e Alphaville em Salvador, evitando confusão com estabelecimentos de outras cidades.
- A assinatura visual VOCÊ MERECE JOY! foi preservada. Títulos de seções, descrição de abertura e textos do cardápio explicam o serviço de forma natural.
- Perguntas e respostas visíveis sobre endereço, pedidos, cardápio e salão; links para as seções correspondentes.
- Todos os 141 itens continuam no HTML e podem ser consultados sem JavaScript. Quando o script carrega, a navegação por categorias é ativada.
- Dados estruturados JSON-LD com Restaurant, WebSite e WebPage; nome, endereço, telefone, cozinha, fotos, cardápio e Instagram correspondem ao conteúdo visível.
- Canonical, Open Graph e Twitter Card com fotografia real do Joy. Imagens mantêm descrições, dimensões e carregamento adiado abaixo da abertura; a primeira foto mantém prioridade alta.
- Exportação de produção inclui sitemap XML com a única página real. As seções com # são âncoras, não páginas independentes.

## Prévia e domínio oficial

A prévia no Sites continua restrita ao proprietário, com noindex e robots.txt bloqueando rastreamento. Essas regras não substituem a proteção de acesso. Nenhum ajuste de permissão foi realizado.

`npm run seo:preview` atualiza os metadados da prévia em dist.
`npm run seo:production` copia o site para work/joy-production e prepara canonical, compartilhamento, dados estruturados, robots e sitemap para https://joyrestaurante.com/. Não altera a prévia.

A exportação é uma referência estática para implementação; não é um tema WordPress nem um pacote de importação do Elementor. O domínio oficial ainda não recebeu estas alterações. Seus arquivos de imagem apontam para /assets/ na exportação; ao subir imagens à biblioteca do WordPress, substituir esses endereços também nos metadados e no JSON-LD.

## Aplicação no WordPress

1. Fazer backup e implementar a página em homologação, preservando a assinatura, fotos e textos aprovados. Confirmar preços, horários e disponibilidade antes da publicação oficial.
2. Aplicar o título e a descrição acima no mecanismo de SEO já usado pelo WordPress. Manter um único responsável por canonical, Open Graph e schema para evitar duplicações entre tema e plugins.
3. Copiar o conteúdo visível e os dados estruturados adaptando todas as URLs de imagens à biblioteca de mídia. Validar o JSON-LD com o Rich Results Test. Não adicionar estrelas, notas, CEP, coordenadas, horários ou prêmios sem confirmação.
4. Na publicação pública definitiva, remover noindex da página e verificar a opção “Desencorajar os mecanismos de busca de indexar este site”, em Configurações > Leitura. Verificar também cabeçalhos X-Robots-Tag e bloqueios de login, hospedagem ou firewall.
5. Preservar URLs úteis do site antigo. Se alguma página mudar, fazer redirecionamento 301 para a equivalente, sem redirecionar indiscriminadamente todas para a home.
6. Usar o sitemap do próprio WordPress ou do plugin de SEO instalado, mantendo um único sitemap principal. O robots.txt estático fornecido é apenas referência: não substituir cegamente regras existentes do WordPress. Confirmar a URL pública do sitemap antes de informá-la no Search Console.
7. Conferir HTTP 200, canonical https://joyrestaurante.com/, imagens públicas, funcionamento do cardápio, pedidos, celular e navegação por teclado.
8. No Google Search Console, inspecionar a página publicada, enviar o sitemap e acompanhar consultas e páginas indexadas. No Perfil da Empresa, manter nome, endereço, telefone, categoria, cardápio, horários e links coerentes com o site. Esses painéis não foram acessados nesta entrega.

## Buscadores e recomendações de IA

A página responde diretamente onde fica o restaurante, o que serve e como pedir, com informações em texto e links verificáveis. Esse trabalho facilita a interpretação do conteúdo; não compra posição nem garante citações ou recomendações.

O Google informa que suas experiências de IA seguem os fundamentos usuais de SEO. Não é necessário um arquivo especial para IA ou um schema exclusivo. Por isso, não foi incluído llms.txt como promessa de posicionamento. A elegibilidade depende de a versão pública poder ser rastreada e indexada, além de relevância e outros critérios dos sistemas.

## Dados e limites

O endereço e telefone vêm do site original utilizado neste projeto; o Instagram @joysushibarssa e os links iFood/99Food foram corrigidos ou fornecidos pelo cliente. Os horários já presentes no layout foram preservados, mas não reforçados no schema até reconfirmação. Não foram publicados depoimentos fictícios, áreas de entrega presumidas nem a alegação de “melhor restaurante”. O tour continua indicado como “Em breve”.

A validação local verifica metadados, consistência das URLs, isolamento da prévia, JSON-LD, sitemap e cardápio sem JavaScript. Não equivale a uma aprovação do Google, a um relatório real de Core Web Vitals ou à execução do Rich Results Test contra a página pública.

## Fontes consultadas

- [Google: recursos de IA e o site](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: dados estruturados de negócios locais](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [WordPress: configurações de leitura e visibilidade](https://wordpress.org/documentation/article/settings-reading-screen/)
