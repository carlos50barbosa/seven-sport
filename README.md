# Seven Sport — site institucional

Site institucional de página única (mais três rotas de apoio) para a **Seven Sport — Artigos Esportivos**, em Taboão da Serra/SP.

**Categorias, na ordem definida pelo dono:**

| Categoria | Como aparece no site |
|---|---|
| **Uniformes esportivos** (nicho principal): camisa, shorts, meião | Sob medida — `/uniformes` |
| **Agasalhos esportivos** | Sob medida — `/uniformes` |
| **Bermudas de passeio** | Sob medida — `/uniformes` |
| **Uniformes corporativos para empresas** | Categoria à parte — `/uniformes#corporativo` |
| **Bolas de futebol, chuteiras e tênis** | Pronta entrega — `/produtos` |

O vocabulário do site usa **shorts** (palavra do dono); "calção" aparece uma vez em `/uniformes` e nas keywords, porque o público busca pelos dois termos.

**Pedido mínimo: 10 unidades por produto personalizado** (`site.comercial`). Vale para camisa, shorts, meião, agasalho, bermuda e corporativo. Bola, chuteira e tênis são de prateleira e não têm mínimo. O número aparece nos cards de produto, na página de uniformes e na validação do formulário — mudou em `site.comercial.pedidoMinimo`, mudou nos quatro lugares.

O site **não vende**: ele existe para transformar visitante em conversa qualificada no WhatsApp. Todo CTA abre `wa.me` com uma mensagem pré-preenchida diferente conforme o contexto.

---

## Stack

| Item | Escolha |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilo | Tailwind CSS 3 — tokens em `tailwind.config.ts` |
| Fontes | `next/font/google` (self-hosted, sem CDN em runtime) |
| Ícones | `lucide-react` |
| Animação | CSS + `IntersectionObserver` próprio (sem framer-motion) |
| Backend | nenhum — todas as rotas são estáticas (SSG) |

Zero dependência externa em runtime. A única requisição a terceiros é o `iframe` do Google Maps, com `loading="lazy"`.

---

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000/seven-sport
npm run build    # build de produção
npm start        # serve o build na porta 3000
```

⚠ O site roda numa **subpasta** (`/seven-sport`), então o endereço local também tem o prefixo.
`http://localhost:3000` sem o prefixo dá 404 — é o comportamento correto.

---

## Onde mexer

### Dados de contato — `src/data/site.ts`
**Fonte única de verdade.** Telefone, endereço, mapa, redes, horários e CNPJ vivem só aqui.
Nenhum componente tem telefone ou endereço escrito à mão — alterou aqui, alterou no site inteiro (header, hero, footer, JSON-LD, sitemap, metadados).

Também ficam aqui as **mensagens de WhatsApp por contexto** (`mensagens`): a do hero é diferente da do formulário, da galeria, do botão flutuante etc.

### Imagens do cliente — `scripts/preparar-imagens.mjs`

As fotos originais **não** ficam no repositório: o script recorta, redimensiona e converte para
WebP direto da pasta que o dono enviou.

```bash
node scripts/preparar-imagens.mjs "C:/Users/josec/Downloads/Seven"
```

Ele produz `public/uniformes/*.webp` e as três versões do logo. As caixas de corte estão no topo
do arquivo, uma linha por foto — chegou foto nova, acrescente a linha e rode de novo.

O logo veio sobre fundo branco chapado; o script faz um **flood fill a partir das bordas** para
deixar o fundo transparente. Um threshold simples furaria o contorno branco das letras — o flood
fill só apaga o branco de fora.

Como o logo é **empilhado** (marca em cima, letreiro embaixo) e o header é uma barra horizontal,
o script gera três recortes:

| Arquivo | O que é | Onde é usado |
|---|---|---|
| `logo-seven-sport.png` | marca + letreiro + "ARTIGOS ESPORTIVOS" | rodapé |
| `logo-marca.png` | só o "S" | header (ao lado do texto) |
| `logo-texto.png` | só o letreiro | header |

O telefone foi removido de todas: o rodapé e o header já têm o número, e num logo de 36px ele
vira sujeira. ⚠ O dono usa **quatro variantes** de logo nos materiais (duas escritas
"SevenSport", uma "Seven sport", uma "SEVEN SPORT"). O site adotou a de `25.jpeg` por ser a única
em alta e sem fundo. Vale ele confirmar qual é a oficial.

### Portfólio — `src/data/portfolio.ts`

`mostrarNomeDosTimes` (topo do arquivo) liga e desliga o nome dos times na galeria.
**Recomendação: manter `true`.** O nome do time é a prova social da seção — sem ele o card vira
desenho genérico e a galeria perde a razão de existir. Com `false`, cada prancha passa a se
identificar só pela modalidade, sem citar time nenhum.

Para adicionar um time, basta uma linha no array:

```ts
{
  slug: 'novo-time',
  time: 'Novo Time',
  contexto: 'Futsal · kit completo',
  padrao: 'listras',            // listras | solido | faixa | ombro
  cores: { base: '#FFFFFF', detalhe: '#1B8F3A', numero: '#FFFFFF', contorno: '#08351A', shorts: '#1B8F3A' },
  numero: '10',
  nomeJogador: 'Novo Time',
}
```

`contorno` é opcional, mas **obrigatório em camisa listrada**: sem ele o número fica da mesma cor da listra e some.

Quando as fotos reais das pranchas chegarem, adicione o campo `foto` e o card troca o vetor pela imagem automaticamente:

```ts
foto: { frente: '/uniformes/novo-time-frente.webp', costas: '/uniformes/novo-time-costas.webp' }
```

### Tecidos e escudos — `src/data/acabamentos.ts`
As cinco malhas e as quatro formas de aplicar o escudo, exibidas em `/uniformes#tecidos` e
`/uniformes#escudos`. Cada uma tem uma amostra desenhada em SVG (`ui/Amostras.tsx`): o retalho
de tecido mostra a textura, e o escudete mostra o acabamento.

Os termos vieram escritos de ouvido pelo dono e foram conferidos contra catálogos de malharia
antes de virar texto publicado:

| Escrito pelo dono | Publicado como | Status |
|---|---|---|
| `jacar` | **Jacquard** | Confirmado — o comércio têxtil usa as duas grafias no mesmo anúncio |
| `preium` | **Premium** | Confirmado — mas é nome de linha, não de tecido: virou selo nos dois tecidos premium |
| `patch D3` | **Patch 3D** | Confirmado |
| `shipa` | **Chimpa** (helanca flanelada) | ⚠ Alta confiança, **falta o dono confirmar** |

### Produtos — `src/data/produtos.ts`
As seis categorias da loja. Cada uma tem `personalizado: true | false` — isso decide se o card
mostra o selo **Sob medida** (vermelho) ou **Pronta entrega**, e `href` opcional para a página
com mais detalhe.

Para criar uma categoria nova, acrescente um item ao array e escolha um ícone do `lucide-react`.
A grade de `/produtos` é de 3 colunas: múltiplos de 3 fecham a última linha certinho.

---

## Estrutura

```
src/
  app/
    layout.tsx            fontes, metadata global, JSON-LD SportingGoodsStore
    page.tsx              home (todas as seções)
    uniformes/page.tsx
    produtos/page.tsx
    contato/page.tsx
    not-found.tsx
    sitemap.ts  robots.ts
    opengraph-image.tsx   OG 1200×630 gerada com next/og
    icon.tsx              favicon gerado com next/og
  components/
    layout/   Header · Footer · WhatsAppFloat
    sections/ Hero · Servicos · Galeria · Processo · Diferenciais · Orcamento · Localizacao
    ui/       MockupBoard (assinatura) · KitSvg · DesenhoProduto · Amostras
              Logo · Button · SectionTitle · Reveal · Icons
  data/       site.ts · portfolio.ts · produtos.ts · acabamentos.ts
  lib/        whatsapp.ts
```

---

## Decisões que fogem do briefing original

1. **`Big Shoulders Display` não existe mais** com esse nome no Google Fonts — foi renomeada para **`Big Shoulders`** (mesmo desenho, agora com eixo óptico). O projeto usa `Big_Shoulders`. Como o Next ainda não tem métricas dessa família, `adjustFontFallback` está desligado e o fallback aponta para condensadas locais (Impact / Arial Narrow).

2. **`Archivo Expanded` também não existe** como família separada. Carregamos `Archivo` variável com o eixo `wdth` e criamos a classe utilitária `.font-expanded` (`font-variation-settings: 'wdth' 125`) para os numerais `01…07`. Uma família, um download.

3. **Todos os desenhos do site são vetores nossos**, não foto de banco de imagens:
   `KitSvg` (a prancha do portfólio), `DesenhoProduto` (camisa, shorts, meião, agasalho, bermuda,
   polo, bola, chuteira — usados na home, em `/produtos` e em `/uniformes`) e `Amostras`
   (retalhos de tecido e escudetes). Todos compartilham a mesma silhueta de camisa exportada
   por `KitSvg`, então a peça desenhada é literalmente a mesma peça em todo o site.
   A `MockupBoard` desenha o kit em **SVG vetorial** parametrizado por cores, padrão e número. Isso resolve três coisas de uma vez: não usa imagem genérica de banco de imagens, não reproduz escudo de clube profissional (risco de marca registrada) e mantém o LCP mínimo. Quando as fotos chegarem, o componente troca para `next/image` sozinho (campo `foto`).

4. **Logo em vetor** (`src/components/ui/Logo.tsx`) enquanto o arquivo em alta não chega. Quando chegar, salve em `public/logo-seven-sport.png` e troque o componente por um `<Image />`.

5. **Deploy como SSG servido por `next start` sob PM2** (e não `output: 'export'`), como pede a seção de deploy. Todas as rotas são pré-renderizadas em build; o Node serve arquivos estáticos e mantém `next/image` e a OG image funcionando. Se preferir servir direto pelo Nginx, veja "Alternativa 100% estática" abaixo.

---

## Deploy em subpasta — https://servicostech.com.br/seven-sport

O site é servido de dentro do domínio da agência, não de um domínio próprio. Quem faz isso
funcionar é o `basePath` do Next: ele prefixa sozinho as rotas do `<Link>`, os assets de `/_next`
e o `src` do `next/image`. Nenhum componente sabe que existe subpasta.

### Configuração — duas variáveis, um arquivo

`.env` (versionado, não tem segredo):

```
NEXT_PUBLIC_BASE_PATH=/seven-sport
NEXT_PUBLIC_SITE_URL=https://servicostech.com.br/seven-sport
```

São lidas em **tempo de build** e também pelo `next dev` — assim o ambiente local fica igual ao de produção. Mudou aqui, rode `npm run build` de novo.

Para rodar sem o prefixo na sua máquina, crie um `.env.local` (não versionado) com `NEXT_PUBLIC_BASE_PATH=` vazio; ele tem prioridade.

**No dia em que o domínio próprio entrar**, esvazie a primeira e troque a segunda:

```
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_SITE_URL=https://sevensport.com.br
```

Rebuild e pronto — canonical, sitemap, robots, OG e JSON-LD acompanham sozinhos.

### 1. Build na VPS

```bash
cd /var/www/seven-sport
git pull
npm ci
npm run build
```

### 2. PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup          # e rode o comando que ele imprimir
pm2 logs seven-sport
```

O app sobe na **porta 3000**. Se essa porta já estiver ocupada na VPS (o site da própria agência,
por exemplo), troque em **dois lugares**: `ecosystem.config.js` e o `proxy_pass` do Nginx.

### 3. Nginx — dentro do server block de servicostech.com.br

Não é um `server` novo: são `location` acrescentados ao bloco que já existe.

```nginx
# ---------- Seven Sport, em /seven-sport ----------

# sem a barra final o Next devolve 404; redireciona antes de chegar nele
location = /seven-sport {
    return 301 /seven-sport/;
}

# assets com hash: cache imutável de 1 ano
location /seven-sport/_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 200 365d;
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location /seven-sport/_next/image {
    proxy_pass http://127.0.0.1:3000;
    add_header Cache-Control "public, max-age=2592000";
}

location /seven-sport/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 60s;
}
```

⚠ **O `proxy_pass` não pode ter barra nem caminho no fim.**
`proxy_pass http://127.0.0.1:3000;` preserva a URI inteira, com o `/seven-sport/` — que é
exatamente o que o Next espera por causa do `basePath`.
`proxy_pass http://127.0.0.1:3000/;` (com barra) corta o prefixo e **tudo vira 404**. É o erro
mais comum de deploy em subpasta.

Depois: `nginx -t && systemctl reload nginx`.

### 4. HTTPS

Nada a fazer: o certificado de `servicostech.com.br` já cobre a subpasta.

### 5. ⚠ robots.txt — o passo que quase todo mundo esquece

Crawler só lê `robots.txt` na **raiz do domínio**. O arquivo que este projeto gera fica em
`https://servicostech.com.br/seven-sport/robots.txt` e **é ignorado**.

Acrescente esta linha ao robots.txt de **servicostech.com.br** (na raiz):

```
Sitemap: https://servicostech.com.br/seven-sport/sitemap.xml
```

Sem isso o Google não descobre o sitemap do Seven Sport.

### 6. Search Console

Cadastre a propriedade como **prefixo de URL** `https://servicostech.com.br/seven-sport/`
(não como domínio) e envie o sitemap por lá também.

### ⚠ O custo de SEO de morar em subpasta

O site é indexável e vai ranquear — mas a autoridade fica no domínio da agência, não no do
cliente. **Quando migrar para `sevensport.com.br`, é obrigatório um 301** de cada URL antiga
para a nova, mantido por pelo menos seis meses:

```nginx
location /seven-sport/ {
    return 301 https://sevensport.com.br$request_uri;
}
```

Como o `$request_uri` traz o `/seven-sport` junto, o redirect precisa reescrever o caminho:

```nginx
location /seven-sport/ {
    rewrite ^/seven-sport/(.*)$ https://sevensport.com.br/$1 permanent;
}
```

Quanto antes registrar o domínio, menos histórico há para migrar.

### Alternativa 100% estática (sem Node em produção)

Se preferir servir só arquivos pelo Nginx, adicione `output: 'export'` e `images: { unoptimized: true }` no `next.config.mjs` e rode `npm run build`. A saída vai para `out/`, já com o `basePath` aplicado nos caminhos. Aponte o Nginx para ela:

```nginx
location /seven-sport/ {
    alias /var/www/seven-sport/out/;
    try_files $uri $uri.html $uri/index.html =404;
}
```

Nesse cenário o PM2 não é necessário — mas some a otimização de imagem do `next/image`, e o site
tem 1,3 MB de fotos. Prefira o modo com Node, a não ser que a VPS não possa manter um processo.

---

## Antes de publicar — pendências com o cliente

- [ ] **Horário de funcionamento** — hoje `site.horarios.confirmado` está `false`, e a seção "Onde estamos" mostra "confirme pelo WhatsApp" em vez de anunciar um horário possivelmente errado. Confirme e mude para `true`.
- [x] ~~CNPJ e razão social~~ — **confirmados em 26/08/2026**: Everaldo José do Nascimento - ME, CNPJ 16.990.883/0001-64. Aparecem no rodapé e no JSON-LD (`legalName` / `taxID`).
  Nota: a Receita registra em caixa alta e sem acento (`EVERALDO JOSE DO NASCIMENTO - ME`). O site usa a grafia com acento e caixa mista, que lê melhor no rodapé. Se preferir idêntico ao cartão CNPJ, é só trocar a string em `site.empresa.razaoSocial`.
- [ ] **Domínio — VERIFICADO EM 25/08/2026, todos livres.** Registrar `sevensport.com.br` (principal) e `seevensport.com.br` (defesa, redirecionando — o Instagram é `@seeven.sport` com dois "e" e é assim que o cliente vai digitar). Checado por API do Registro.br + RDAP oficial + DNS, com controles. Registrar direto no registro.br. Detalhes e as outras quatro opções estão no comentário de `site.url`.
- [ ] **`shipa` = chimpa?** Uma pergunta fecha: *"o shipa é aquele que por fora é lisinho e por dentro é felpudo?"*. Se sim, o texto publicado está certo. Pergunte junto se a bermuda usa a mesma chimpa do agasalho ou uma versão mais leve — muda o texto do produto.
- [ ] **Patch 3D x emborrachado são a mesma coisa na loja?** Se forem, junte os dois num item só em `acabamentos.ts`: melhor três técnicas verdadeiras que quatro confusas.
- [ ] **A loja faz transfer/DTF e silk?** São comuns em várzea e não estavam na lista do dono. Se faz, é só acrescentar em `escudos`.
- [ ] **Pedido mínimo** — o site diz "10 unidades por produto personalizado" e que prateleira não tem mínimo. Confirmar se é isso mesmo.
- [x] ~~Fotos de uniformes produzidos~~ — **recebidas em 26/08/2026** (25 fotos). Onze entraram no site.
- [ ] **Fotos que ainda faltam** (o dono ficou de mandar): o agasalho do "Amigos do Gole Diretoria" (`5.jpeg`) em resolução maior — o recebido tem 463px. Também faltam bermuda, chuteiras, tênis e meião reais. Essas categorias seguem com o desenho vetorial até lá.
- [ ] **Detalhes do uniforme corporativo**: tipos de peça (polo, camiseta, manga longa), se a aplicação do logo é bordado, estampa ou os dois, e se há pedido mínimo. O texto atual em `/uniformes#corporativo` é conservador — confirme antes de publicar.
- [x] ~~Logo em alta~~ — **recebido e confirmado**: a variante de `25.jpeg` ("SEVEN SPORT / ARTIGOS ESPORTIVOS") é a oficial do site.
- [x] ~~Instagram e Threads~~ — **confirmados**: `@seeven.sport` nos dois, com ponto. É o que já estava em `site.redes`.
- [ ] **Confirmar envio para todo o Brasil** e o prazo médio de produção (hoje o texto afirma que sim, conforme o briefing).
- [ ] **Cores reais dos uniformes do portfólio** — as do vetor são uma reconstrução aproximada.

---

## Fotos que NÃO entraram, e por quê

Das 25 recebidas, onze foram publicadas. As outras ficaram de fora por motivo concreto:

**Marca registrada de terceiro (4 fotos) — risco jurídico real, não publicar:**

| Foto | Problema |
|---|---|
| `10.jpeg`, `11.jpeg` | Kit com o escudo da **FPF / seleção de Portugal** (time "Portugal de Custódia") |
| `18.jpeg`, `19.jpeg` | Kit e squeezes com o escudo do **E.C. Bahia** (time "E.C. Bahia 1995") |
| `21.jpeg` | Prancha com o escudo da **AFA / seleção da Argentina** |
| `4.jpeg` | Agasalho com o escudo do **E.C. Bahia** |

Produzir para o cliente que traz o escudo é um problema do cliente. **Publicar no seu site como
peça de propaganda é problema seu** — é uso comercial da marca de terceiro. Os times amadores que
usam escudo próprio (Ferroviário, Amigos do Gole, Laranjo, Arruma Nada, EREM JMS, Grêmio
Cacimbinha, Margirius) não têm esse risco e são os que estão no ar.

Nota sobre o Santa Isabel: o escudo é do próprio clube, mas o desenho lembra bastante o do
Atlético de Madrid. Risco baixo — é a identidade do time, não uma cópia do escudo registrado —
mas fica o registro.

**Imagem gerada por inteligência artificial (1 foto):**
`3.jpeg` (chuteiras) traz marca d'água "Dola AI" e as chuteiras são renderizadas, não fotografadas.
Publicar como se fosse o estoque da loja é anúncio enganoso. Ficou de fora.

**Marca d'água de app de edição (2 fotos):**
`1.jpeg` e `2.jpeg` têm "Pixelcut" no canto. A `1.jpeg` foi aproveitada com o rodapé cortado;
a `2.jpeg` (bola Topper) não deu para salvar.

**Resolução insuficiente (3 fotos):**
`4.jpeg` (543×472), `5.jpeg` (463×487) e `24.jpeg` (logo circular). O agasalho do "Amigos do Gole
Diretoria" (`5.jpeg`) é ótimo e sem problema de marca — **peça o original ao dono**, ele resolve a
categoria de agasalhos de uma vez.

## Cores e contraste — leia antes de mexer na paleta

A paleta tem **três pares**, e trocar um pelo outro quebra WCAG AA:

| Token | Hex | Onde pode usar |
|---|---|---|
| `verde` | `#1B8F3A` | Ícone, gráfico, área grande, título grande. **Não** para texto pequeno nem como fundo de botão com texto branco (dá 4,17:1). |
| `verde-forte` | `#15722F` | Texto verde sobre fundo claro **e** fundo de botão com texto branco. 6,0:1 nos dois sentidos. |
| `vermelho` | `#E1251B` | Fundo de botão com texto branco (4,69:1). **Não** para texto pequeno sobre fundo claro (4,28:1). |
| `vermelho-escuro` | `#B81C14` | Texto vermelho sobre fundo claro (5,98:1) — é o do marcador de seção. |
| `dourado` | `#C9A24A` | **Só sobre fundo escuro** (6,18:1 no verde-fundo). No claro reprova feio (2,19:1). |
| `dourado-escuro` | `#8A6B1F` | Dourado para texto sobre fundo claro (5,0:1 no branco). |

Todos os valores foram medidos no navegador, sobre a cor de fundo realmente pintada, não estimados.

## Acessibilidade e performance

- Foco de teclado visível em tudo que é interativo (vermelho no claro, dourado no escuro).
- `prefers-reduced-motion` respeitado: sem reveal, sem flip — a prancha mostra frente e costas lado a lado.
- A prancha é operável por teclado pelo botão "Ver as costas" (`aria-pressed`), não só por hover.
- Link "Pular para o conteúdo" no topo.
- Toda imagem/gráfico tem `alt` específico ("Uniforme personalizado do time Santa Isabel, frente da camisa com calção e meião").
- Sem CDN de fonte, sem jQuery, sem biblioteca de carrossel.

---

Desenvolvido por **ServiçosTech**.
