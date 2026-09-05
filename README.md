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
| Backend | nenhum no site — `output: 'export'`, o Nginx serve arquivo |
| Painel do admin | serviço Node à parte, só em `/admin` — veja "Painel do admin" |

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

> Para trocar uma foto no dia a dia, o caminho é o **painel do admin** (`/admin`), que converte
> sozinho e publica. Este script continua sendo o caminho do **recorte fino** e do lote inicial —
> é ele que sabe onde cortar cada foto para tirar o balcão da loja e a moldura da prancha.

As fotos originais **não** ficam no repositório: o script recorta, redimensiona e converte para
WebP direto da pasta que o dono enviou.

```bash
node scripts/preparar-imagens.mjs "C:/Users/josec/Downloads/Seven"
```

Ele produz `public/fotos/*.webp` e as três versões do logo. As caixas de corte estão no topo
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

⚠ **Este arquivo é a semente, não o conteúdo no ar.** Ele diz com que galeria uma instalação
nova nasce. Assim que o painel do admin salva pela primeira vez, `dados/galeria.json` passa a
mandar e mexer aqui não muda mais o site — por isso os nomes exportados terminam em `Seed`.
Quem junta as duas fontes é `src/data/conteudo.ts`, e é de lá que página e seção importam.

Para acrescentar ou remover time, use `/admin`. O que segue vale para a semente.

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
foto: { frente: '/fotos/novo-time-frente.webp', costas: '/fotos/novo-time-costas.webp' }
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
    catalogo/page.tsx       o catálogo de trabalhos, com filtro
    privacidade/page.tsx  política de privacidade (LGPD)
    not-found.tsx
    sitemap.ts  robots.ts
    opengraph-image.tsx   OG 1200×630 gerada com next/og
    icon.tsx              favicon gerado com next/og
  components/
    layout/   Header · Footer · WhatsAppFloat
    sections/ Hero · Servicos · Galeria · Processo · Diferenciais · Orcamento · Localizacao
              CatalogoGrade (grade filtrável de /catalogo)
    ui/       MockupBoard (assinatura) · KitSvg · DesenhoProduto · Amostras
              Logo · Button · SectionTitle · Reveal · Icons
              MapaSobDemanda (o mapa do Google, só depois do clique)
  data/       site.ts · acabamentos.ts
              portfolio.ts · produtos.ts   semente: com que conteúdo o site nasce
              conteudo.ts                  junta a semente com dados/galeria.json (build)
  lib/        whatsapp.ts · asset.ts
admin/        servidor.mjs · senha.mjs · publico/ (o painel) · semente.json
              sevensport-admin.service (unit do systemd)
dados/        conteúdo editável, FORA do git — criado pelo painel
scripts/      preparar-imagens.mjs (recorta as fotos do cliente)
              semear-conteudo.mjs  (atualiza admin/semente.json)
              servir-estatico.mjs  (testa o out/ como o Nginx serve)
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

5. **Deploy por export estático, não por `next start` sob PM2** — o briefing pedia PM2, e o
   runbook começou assim. Mudou depois de olhar a VPS: ela hospeda cinco sites, o padrão da
   máquina é servir pasta buildada (`/opt/apps/*/dist`), e a porta 3000 já é de outro projeto.
   Um processo Node a mais só acrescentaria coisa para cair. O site não tem nada dinâmico, então
   o export não custa funcionalidade — custa a otimização de imagem em runtime, compensada por
   já gerar as fotos no tamanho certo. `ecosystem.config.js` foi removido: nenhum processo Node
   fica no caminho do visitante. (O painel do admin, item 6, é um processo — mas ele só atende
   `/admin`, e o site não depende dele para nada.)

6. **Painel do admin com rebuild, não com galeria dinâmica** — o cliente precisa trocar as fotos
   sozinho, e isso pedia um servidor onde não havia nenhum. A saída óbvia seria a galeria buscar
   um JSON no navegador: mudança instantânea, sem build. Foi recusada — o Google passaria a ver
   a seção vazia e o LCP pioraria, justamente na seção que é a prova social da loja.

   O painel salva o conteúdo e dispara `npm run build`. O HTML publicado sai idêntico ao de um
   deploy manual; o que muda é quem apertou o botão. Custa ~1 min de espera e um processo a mais
   na VPS, e mantém intactas as duas coisas que o item 5 comprou.

   O conteúdo editável vive em `dados/`, **fora do git**, e não em `src/data/`. Se ficasse dentro,
   toda foto trocada pelo dono deixaria a árvore suja e o `git pull` do deploy seguinte falharia
   por conflito — um jeito silencioso de quebrar o deploy semanas depois. O preço é que o backup
   de `dados/` passa a ser responsabilidade de quem opera a VPS, não do git.

7. **`browserslist` explícito no `package.json`** — sem ele, o padrão do Browserslist
   resolve para iOS Safari 18.5+ apenas. O autoprefixer conclui, corretamente para
   esse alvo, que `-webkit-backdrop-filter` é desnecessário — e para de emiti-lo. O
   resultado: em iPhone com iOS 15/16/17 o desfoque do header simplesmente não
   acontece, a barra fixa vira vidro sem fosco e o texto da página passa por baixo
   dela. Nada quebra, nada avisa; só fica feio no aparelho de quem não atualizou.
   O alvo agora vai até `ios_saf 15.4`. Custo medido: +496 bytes de CSS, e o JS
   ficou 794 bytes MENOR (o Next usa a própria lista para o bundle moderno).

---

## Privacidade — por que não há banner de cookies

O site **não grava nada** no navegador de quem visita: nenhuma ferramenta de análise de
audiência, nenhum pixel de rede social, nenhum cookie próprio, nenhum `localStorage`. As fontes
do Google vêm por `next/font/google`, que as **auto-hospeda em tempo de build** — o navegador do
visitante não fala com o Google por causa delas. E o formulário de orçamento não envia nada a
servidor nenhum: monta um texto e abre o WhatsApp.

Sem rastreamento não há o que consentir, e é por isso que o site não tem aquela janela de aceite
de cookies. A LGPD não exige banner (isso vem da diretiva europeia); o que ela cobra é
transparência — daí a página `/privacidade`, ligada no rodapé.

O único conteúdo de terceiro era o **iframe do Google Maps**, que grava cookies do Google no
instante em que carrega. Por isso ele virou `MapaSobDemanda`: no lugar do mapa aparece uma planta
de ruas desenhada em SVG e um botão, e o iframe só entra depois do clique. De quebra saiu da
carga inicial o recurso mais pesado da página.

Verificado no `out/` gerado, com o Chrome gravando a rede: **19 requisições no carregamento de
`/contato`, zero domínios de terceiro**; depois do clique no botão, o iframe aparece, o foco do
teclado vai para ele e só então `www.google.com` entra na lista.

> ⚠ **Isto é um combinado, não um estado permanente.** No dia em que alguém colocar Google
> Analytics, pixel do Meta, mapa carregando sozinho ou um formulário que grave dados em servidor,
> as três frases acima deixam de ser verdade — e aí passa a caber banner de consentimento com
> escolha granular, no que a ANPD orienta no *Guia Orientativo sobre Cookies*. Antes de subir uma
> mudança dessas, atualize `src/app/privacidade/page.tsx` e a data em `atualizadoEm`.

O painel do admin usa um cookie de sessão (`sevensport_admin`, `HttpOnly`, `SameSite=Strict`).
Ele é estritamente necessário e fica numa área restrita — não entra nessa conta e dispensa
consentimento.

---

## Deploy — sevensport.com.br

O site é **estático**. `npm run build` gera a pasta `out/` com o HTML pronto, e o Nginx serve
arquivo. Sem Node em produção, sem PM2, sem porta, sem processo para cair.

Isso é escolha, não limitação: o site não tem nenhuma API route nem server action, então não se
perde funcionalidade. O que se perde é a otimização de imagem em runtime do `next/image` — por
isso as fotos já saem no tamanho certo do `scripts/preparar-imagens.mjs` (900px de largura, WebP,
40–170 KB cada) em vez de irem em resolução de câmera.

### Configuração

`.env` (versionado, sem segredo):

```
NEXT_PUBLIC_BASE_PATH=
NEXT_PUBLIC_SITE_URL=https://sevensport.com.br
```

`BASE_PATH` vazio é o certo para o domínio próprio. Ele só existe para publicar uma prévia numa
subpasta (`/uma-pasta`), como foi feito para mostrar ao cliente antes do domínio sair.

### 1. Build

Na VPS, seguindo a convenção que a máquina já usa para os outros projetos (`/opt/apps/...`):

```bash
sudo mkdir -p /opt/apps && cd /opt/apps
git clone https://github.com/carlos50barbosa/seven-sport.git seven-sport
cd seven-sport
npm ci
npm run build          # gera /opt/apps/seven-sport/out
```

Nas próximas vezes, o deploy inteiro é:

```bash
cd /opt/apps/seven-sport && git pull && npm ci && npm run build
```

Não precisa reiniciar nada. O Nginx passa a servir os arquivos novos na hora.

A exceção é o painel do admin: ele roda como serviço, então mudança em `admin/` só vale
depois de `sudo systemctl restart sevensport-admin`.

### 2. Nginx

⚠ **Esta VPS é AlmaLinux/RHEL (`nginx/1.20.1`)**: não existe `sites-available` /
`sites-enabled`. O `nginx.conf` inclui `/etc/nginx/conf.d/*.conf`, e é lá que o arquivo vai.
Criar em `sites-available` falha de um jeito traiçoeiro: o `tee` reclama de diretório
inexistente, mas o `nginx -t` seguinte passa (porque nada foi criado) e parece sucesso.

`/etc/nginx/conf.d/sevensport.conf`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name sevensport.com.br www.sevensport.com.br;

    root /opt/apps/seven-sport/out;
    index index.html;

    # o Next exporta /uniformes como uniformes.html
    location / {
        try_files $uri $uri.html $uri/index.html =404;
    }

    # ⚠ O favicon e a imagem de OG são gerados SEM extensão. Sem estas duas
    # linhas o Nginx entrega application/octet-stream e a prévia do link no
    # WhatsApp e no Facebook não renderiza.
    location = /icon            { default_type image/png; }
    location = /opengraph-image { default_type image/png; }

    # assets com hash no nome: cache imutável
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /fotos/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Fotos enviadas pelo painel. O nome de cada arquivo carrega o hash do
    # conteúdo, então cache longo aqui nunca mostra a foto antiga.
    location /galeria/ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Painel do admin — o ÚNICO lugar do site que fala com um processo Node.
    location /admin {
        proxy_pass http://127.0.0.1:4123;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # Sem esta linha o cookie de sessão sai sem `Secure` e o login entra em loop.
        proxy_set_header X-Forwarded-Proto $scheme;

        # Foto de celular passa fácil de 1 MB, que é o teto padrão do Nginx.
        client_max_body_size 26m;
        # O build demora ~1 min: não derrube a conexão do painel no meio.
        proxy_read_timeout 300s;
    }

    error_page 404 /404.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -s -o /dev/null -w "%{http_code}\n" http://sevensport.com.br/            # 200
curl -s -o /dev/null -w "%{http_code}\n" http://sevensport.com.br/uniformes   # 200
```

### 3. HTTPS

```bash
sudo certbot install --cert-name sevensport.com.br
```

`install` usa o certificado que **já está emitido** em `/etc/letsencrypt/live/sevensport.com.br/`
— não pede um novo, então não consome tentativa no limite da Let's Encrypt (5/hora por domínio).

Se ainda não houver certificado:

```bash
sudo certbot --nginx -d sevensport.com.br -d www.sevensport.com.br
```

Se o Certbot disser *"Successfully received certificate"* seguido de *"Could not install
certificate — Could not automatically find a matching server block"*, o certificado está em disco
e faltou o passo 2. Corrija e rode o `install`.

### 4. www → raiz

Escolha um endereço só, senão o Google vê duas versões do mesmo site. No bloco 443 que o Certbot
criou, separe o `www`:

```nginx
server {
    listen 443 ssl;
    server_name www.sevensport.com.br;
    # ... as linhas ssl_certificate que o Certbot escreveu ...
    return 301 https://sevensport.com.br$request_uri;
}
```

E tire `www.sevensport.com.br` do `server_name` do bloco principal.

### 5. Aposentar a prévia

A prévia do cliente ficou em `/var/www/servicostech.com.br/seven-sport` — uma pasta solta dentro
do document root da agência, sem nenhuma linha de Nginx (é por isso que `grep seven-sport` na
config não acha nada). Para não deixar cópia duplicada indexável:

```bash
sudo rm -rf /var/www/servicostech.com.br/seven-sport
```

E, no server block de `servicostech.com.br`, um redirect para quem tiver o link salvo:

```nginx
location /seven-sport {
    rewrite ^/seven-sport/?(.*)$ https://sevensport.com.br/$1 permanent;
}
```

### 6. Search Console

Cadastre `sevensport.com.br` e envie `https://sevensport.com.br/sitemap.xml`.
O `robots.txt` agora nasce na raiz e vale sozinho — quando o site morava na subpasta, ele era
ignorado (crawler só lê robots na raiz do domínio).

### 7. Atualize onde o endereço aparece fora do site

- Bio do Instagram `@seeven.sport`
- Google Meu Negócio
- Cartão, adesivo de vitrine, etiqueta de uniforme

### Se algo der errado

| Sintoma | Causa quase certa |
|---|---|
| `ERR_NAME_NOT_RESOLVED` | DNS não propagou. `dig +short sevensport.com.br @8.8.8.8` |
| Erro de certificado no navegador | Falta o server block: o TLS cai no server padrão da VPS e entrega o certificado de outro domínio |
| `/uniformes` dá 404 | Falta o `try_files ... $uri.html` |
| Site abre sem CSS | `root` apontando para o repositório em vez de `.../out` |
| Prévia do link sem imagem no WhatsApp | Faltam as duas linhas de `default_type image/png` |
| Aparece o site de outro domínio | `proxy_pass` sobrando de uma tentativa anterior — este site não usa proxy |

### Testar o `out/` antes de subir

`scripts/servir-estatico.mjs` sobe um servidor local com as mesmas regras de `try_files` do
Nginx, para conferir o build exatamente como a VPS vai servir:

```bash
npm run build
node scripts/servir-estatico.mjs out 3200
# http://127.0.0.1:3200
```

## Catálogo — `/catalogo`

A página que o dono abre no celular para mostrar o trabalho a um cliente, ou manda por link no
WhatsApp. Lista **todos** os uniformes já produzidos, com filtro por modalidade.

Foi dimensionada para 20 a 60 trabalhos. Abaixo disso a home já daria conta; acima disso o filtro
deixa de bastar e a página passaria a pedir paginação.

### Como se divide o trabalho entre as três seções

| Onde | O que mostra | Para quem |
|---|---|---|
| Vitrine da home (`Galeria`) | os **6 primeiros** do catálogo | visitante que chegou por busca ou anúncio |
| `/catalogo` | **todos**, com filtro | cliente que já está conversando, ou quem quer vasculhar |
| `/produtos` | as **categorias** da loja | quem procura bola, chuteira ou tênis |

O seis da vitrine está em `NA_VITRINE`, em `Galeria.tsx`. Fecha duas linhas na grade de três
colunas, e existe para a home não virar acervo: despejar sessenta pranchas ali empurraria as
seções de conversão para baixo. Passando de seis trabalhos, aparece sozinho um link para o
catálogo com a contagem.

⚠ `/produtos` deixou de se anunciar como "Catálogo" (virou "Categorias") quando esta página
nasceu. Duas seções com o mesmo nome confundiriam exatamente o cliente que o dono quer impressionar.

### Trabalho acrescentado no código não chega sozinho ao ar

Depois do primeiro Salvar no painel, quem manda é `dados/galeria.json`, e a semente vira só o ponto
de partida de uma instalação nova. Isso é o certo — senão apagar um time no painel não funcionaria.

O efeito colateral é que um trabalho acrescentado em `portfolio.ts` nunca apareceria num site que já
rodou o painel. Para essa ponte existe:

```bash
npm run conteudo:sincronizar --simular   # mostra o que faria, sem escrever
npm run conteudo:sincronizar             # aplica
```

Ele só **acrescenta** o que falta (comparando por slug) e **preenche categoria em branco** a partir
da semente. Nunca altera nem remove o que o dono editou: categoria já preenchida não é tocada, mesmo
que discorde da semente — ali houve escolha de alguém. Faz cópia datada do manifesto antes de
escrever. Depois de rodar, publique.

### As gavetas do filtro

Vivem em `categoriasDoCatalogo`, em `src/data/portfolio.ts` — hoje campo, society, futsal,
escolas, empresas e outros. Só entram no filtro as gavetas que têm trabalho dentro; botão que
devolve "nenhum resultado" é ruído.

Repare que `categoria` e `contexto` parecem a mesma coisa e não são. `contexto` é legenda livre
("Enviado para PE", "Veteranos · campo") e dá personalidade ao card; `categoria` é gaveta fechada
e serve para agrupar. Filtrar por texto livre daria uma gaveta por trabalho.

Para criar uma gaveta: acrescente a linha em `categoriasDoCatalogo` **e rode
`npm run admin:semear`**, senão o painel não oferece a opção nova.

Trabalho salvo antes desta página existir cai em "Outros" — sem quebrar o build, de propósito, já
que é um campo que o admin nunca teve como preencher. O painel preenche a gaveta no carregamento,
então o primeiro Salvar migra tudo de uma vez.

---


## Painel do admin — `/admin`

O dono da loja troca, tira e acrescenta as fotos do site pelo navegador, do celular, sem
código e sem deploy. `https://sevensport.com.br/admin`.

### Como isso convive com o site estático

O site **continua 100% estático**. Nenhum visitante toca em Node: o Nginx serve `out/`, como
sempre. O painel é um processo separado que só responde em `/admin`, e o que ele faz ao salvar é
rodar **o mesmo `npm run build` do deploy**. O HTML publicado sai idêntico ao que sairia se você
tivesse editado o arquivo à mão — SEO, LCP e a decisão de "sem Node no caminho do visitante"
ficam de pé.

O que se paga por isso:

| | |
|---|---|
| **Custo** | ~1 min entre clicar em Publicar e a mudança aparecer no ar |
| **Custo** | um processo a mais na VPS (~60 MB parado) |
| **Não custa** | se o painel cair, o site **não** cai — ele só serve arquivo |
| **Não custa** | nenhuma requisição do visitante passa pelo Node |

A alternativa seria a galeria buscar um JSON em runtime: apareceria na hora, mas o Google
passaria a ver a seção vazia e o carregamento ficaria mais lento. Não valeu o troco.

### Instalação na VPS (uma vez)

O painel só chega na VPS depois que o commit estiver na **`main`** — o deploy é `git pull` nela.

```bash
cd /opt/apps/seven-sport && git pull && npm ci

# 1. De quem é o projeto? O serviço tem que rodar como esse usuário: ele grava as
#    fotos e roda o build, os dois dentro desta pasta.
ls -ld /opt/apps/seven-sport

# 2. Credenciais, gravadas DIRETO no arquivo (modo 600, uma linha por variável).
#    A senha é digitada escondida, e o hash e o segredo nunca aparecem na tela.
#
#    ⚠ NÃO faça por copia-e-cola. O hash tem ~150 caracteres; terminal e editor
#    cortam ou quebram valor longo, e o arquivo fica com a variável VAZIA — três
#    linhas, o "grep -c ADMIN_" respondendo 3, tudo com cara de certo, e o
#    serviço subindo em laço com "Faltam credenciais".
sudo node admin/senha.mjs --escrever /etc/sevensport-admin.env
sudo chown root:root /etc/sevensport-admin.env

#    Confira: 3 linhas, NENHUMA com menos de 20 chars (linha curta = valor perdido)
sudo awk '{print NR": "length($0)" chars"}' /etc/sevensport-admin.env

# 3. HOME do serviço, para o cache do npm durante o build.
#    O dono TEM que ser o usuário do passo 1 — root aqui faz o build falhar com
#    erro de permissão que não parece ter nada a ver com a causa.
sudo mkdir -p /var/lib/sevensport-admin
sudo chown SEU_USUARIO:SEU_GRUPO /var/lib/sevensport-admin

# 4. O serviço. Ajuste `User=` e `Group=` no arquivo antes de copiar.
sudo cp admin/sevensport-admin.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now sevensport-admin
systemctl status sevensport-admin

# 5. Confira que o serviço responde ANTES de mexer no Nginx.
curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:4123/admin/    # 302
```

⚠ **SELinux — o passo que só existe porque esta VPS é AlmaLinux/RHEL.** Com SELinux em
`Enforcing`, o Nginx é **proibido de abrir conexão de rede**, inclusive para `127.0.0.1:4123`.
O sintoma engana: o serviço está no ar, o `curl` direto na porta responde, o `nginx -t` passa —
e mesmo assim `/admin` devolve **502**, com `Permission denied while connecting to upstream`
no `/var/log/nginx/error.log`. Nenhum tutorial escrito para Debian menciona isso.

```bash
getenforce                                    # Enforcing?
sudo setsebool -P httpd_can_network_connect 1 # o -P grava, senão volta no reboot
```

Depois acrescente o `location /admin` ao server block em `/etc/nginx/conf.d/sevensport.conf`
(o bloco completo está em "2. Nginx"), recarregue e confirme pelo caminho público:

```bash
sudo nginx -t && sudo systemctl reload nginx
curl -s -o /dev/null -w '%{http_code}\n' https://sevensport.com.br/admin/   # 200
```

⚠ **O painel só deve existir sob HTTPS.** O cookie de sessão só ganha a marca `Secure` quando o
Nginx repassa `X-Forwarded-Proto: https`. Faça o passo 3 do deploy (certbot) antes de divulgar
o endereço para o cliente.

### O dia a dia

1. Entrar em `sevensport.com.br/admin`
2. Trocar, arrastar, remover, reordenar
3. **Salvar** — grava o conteúdo, ainda não mexe no site
4. **Publicar no site** — roda o build e leva para o ar (~1 min, com log na tela)

A etiqueta no topo diz onde você está: `alterações não salvas` → `salvo — falta publicar` →
`tudo publicado`.

As três abas:

| Aba | O que dá para fazer |
|---|---|
| **Galeria** | Os trabalhos do catálogo: acrescentar, trocar foto, editar nome, modalidade e filtro, reordenar, remover. Tem busca por nome ou filtro, para achar um time no meio de dezenas. A ordem daqui é a ordem no site; os seis primeiros são a vitrine da home, e o primeiro também aparece no topo e no rodapé. |
| **Destaques** | As três imagens de posição fixa: topo de `/uniformes`, uniforme corporativo e a arte de exemplo de "Como funciona". Trocam de foto, mas não somem — o layout conta com elas. |
| **Produtos** | Uma foto por categoria de `/produtos`. Sem foto, o site desenha a peça em vetor. Criar e apagar categoria continua sendo código (`src/data/produtos.ts`). |

O painel **converte a foto sozinho**: aplica o giro do EXIF (foto de celular deitada endireita),
redimensiona para a largura certa e salva em WebP com qualidade 82 — as mesmas regras de
`scripts/preparar-imagens.mjs`. Pode mandar a foto direto da câmera.

O que ele **não** faz é recortar. Foto com o balcão da loja no fundo entra com o balcão. Para
recorte fino, o caminho continua sendo o script — e o original de tudo que passou pelo painel
fica guardado em `dados/originais/`, então dá para recortar depois sem pedir a foto de novo.

### Onde o conteúdo mora

```
dados/galeria.json      o conteúdo editável (fonte de verdade)
dados/originais/        o arquivo cru de cada upload — é o desfazer
dados/estado.json       o que já foi publicado
public/galeria/*.webp   as fotos convertidas, que o build copia para out/
```

**Nada disso vai para o git**, de propósito: a VPS escreve nesses caminhos, e um `git pull` no
deploy não pode conflitar com o que o dono da loja acabou de salvar.

A consequência é que **o backup é seu**:

```bash
rsync -az /opt/apps/seven-sport/dados/ /opt/apps/seven-sport/public/galeria/ destino:/backup/seven-sport/
```

`src/data/portfolio.ts` continua no git com o conteúdo original — é a **semente**, com que uma
instalação nova nasce. Depois do primeiro Salvar, quem manda é `dados/galeria.json`, e mexer na
semente não muda mais o site. Quem lê o código precisa saber disso; por isso os nomes lá
terminam em `Seed`.

### Segurança

| | |
|---|---|
| Senha | scrypt (32 MB por tentativa), nunca guardada em claro |
| Sessão | cookie assinado com HMAC, `HttpOnly` + `SameSite=Strict`, 12 h |
| Força bruta | 5 erros por IP, 15 min de castigo |
| Escuta | `127.0.0.1` apenas — quem fala com a internet é o Nginx |
| Upload | o `sharp` recusa o que não for imagem; o nome do arquivo do cliente nunca vira caminho |

Para **expulsar uma sessão perdida** (celular roubado, senha vazada), troque `ADMIN_SEGREDO` em
`/etc/sevensport-admin.env` e `sudo systemctl restart sevensport-admin`. Todo mundo cai na hora.

### Rodar na sua máquina

```bash
npm run admin:senha        # cole a saída em admin/.env.local
npm run admin              # http://127.0.0.1:4123/admin
```

`admin/.env.local` é ignorado pelo git (`.env*.local`). Em local o cookie sai sem `Secure`,
senão o navegador o descartaria em HTTP e o login entraria em loop.

### Depois de mexer no catálogo de produtos

`admin/semente.json` guarda a lista de produtos que o painel exibe. Mexeu em
`src/data/produtos.ts` (categoria nova, nome alterado)?

```bash
npm run admin:semear       # e commite o JSON junto
```

Em Node ≥ 22.18 o painel relê o `.ts` direto ao subir, então na prática ele já se corrige
sozinho; o JSON é a rede de proteção para Node antigo. Este script **não** roda no `prebuild` de
propósito: ele escreve um arquivo versionado, e a VPS reescrevendo arquivo versionado durante o
build deixaria a árvore suja e quebraria o `git pull` seguinte.

### Se algo der errado no painel

| Sintoma | Causa quase certa |
|---|---|
| `/admin` dá 404 | Falta o `location /admin` no Nginx, ou o serviço está parado (`systemctl status sevensport-admin`) |
| `/admin` dá 502, mas o `curl` direto na porta 4123 responde | SELinux barrando o Nginx: `sudo setsebool -P httpd_can_network_connect 1` |
| Login não passa, sem erro na tela | Cookie descartado: o painel está em HTTP puro, ou falta `proxy_set_header X-Forwarded-Proto $scheme` |
| Upload falha em foto grande | `client_max_body_size` do Nginx (o padrão dele é 1 MB — o bloco recomendado usa 26 MB) |
| "Publicar" falha e o log fala de permissão | O `User=` do serviço não é dono de `/opt/apps/seven-sport`, ou falta `/var/lib/sevensport-admin` |
| Foto some depois de publicar | A foto foi salva mas o time não foi salvo; a limpeza de órfãs recolhe arquivo sem dono depois de 1 h |
| Build falha citando "Manifesto inválido" | `dados/galeria.json` foi editado à mão. Corrija ou apague o arquivo — sem ele o site volta ao conteúdo de `src/data/` |

O site no ar **nunca** fica quebrado por um build que falhou: o `out/` só é reescrito quando o
build termina bem. Falhou, o visitante continua vendo a versão anterior.

---

## Antes de publicar — pendências com o cliente

- [ ] **Horário de funcionamento** — hoje `site.horarios.confirmado` está `false`, e a seção "Onde estamos" mostra "confirme pelo WhatsApp" em vez de anunciar um horário possivelmente errado. Confirme e mude para `true`.
- [x] ~~CNPJ e razão social~~ — **confirmados em 26/08/2026**: Everaldo José do Nascimento - ME, CNPJ 16.990.883/0001-64. Aparecem no rodapé e no JSON-LD (`legalName` / `taxID`).
  Nota: a Receita registra em caixa alta e sem acento (`EVERALDO JOSE DO NASCIMENTO - ME`). O site usa a grafia com acento e caixa mista, que lê melhor no rodapé. Se preferir idêntico ao cartão CNPJ, é só trocar a string em `site.empresa.razaoSocial`.
- [x] ~~Domínio~~ — **`sevensport.com.br` registrado no Registro.br.** A migração da subpasta para ele está em "Migrar para sevensport.com.br — runbook", neste README. Falta apontar o DNS para o IP da VPS.
- [ ] **`seevensport.com.br` como defesa** — o Instagram é `@seeven.sport`, com dois "e", e quem vier de lá vai digitar assim. Estava livre em 25/08. Vale registrar e redirecionar para o principal.
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

Das 25 recebidas, **doze foram publicadas**. As outras ficaram de fora por motivo concreto.

Em 28/08/2026 as 25 foram **auditadas de novo**, uma a uma, com segunda leitura independente
em cada peça com escudo. As conclusões abaixo são o resultado dessa auditoria, não da triagem
original. Nenhuma mudou de lado, e uma foi recuperada (a `5.jpeg`).

**Marca registrada de terceiro (6 fotos) — risco jurídico real, não publicar:**

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

**Achados novos da auditoria de 28/08, sobre fotos que JÁ estavam no site:**

- `1.jpeg` (bola de campo) tem, no canto inferior direito, um borrão retangular no lugar exato do
  selo Pixelcut da `2.jpeg` — marca d’água apagada de forma malfeita. A auditoria também levantou
  suspeita de imagem gerada por IA. O `bola-campo.webp` existe em `public/fotos/` mas **não está
  referenciado em lugar nenhum**, então não está no ar. Não republique sem olhar.
- `6.jpeg` (bola society, **publicada** em `/produtos`) tem cara de foto de catálogo do fornecedor
  Penalty, não de foto da loja. Não é ilegal revender nem ilustrar com a imagem do fabricante, mas
  vale saber que a foto não é da prateleira dele.

**Marca d'água de app de edição (2 fotos):**
`1.jpeg` e `2.jpeg` têm "Pixelcut" no canto. A `1.jpeg` foi aproveitada com o rodapé cortado;
a `2.jpeg` (bola Topper) não deu para salvar.

**Resolução insuficiente (2 fotos):**
`4.jpeg` (543×472) e `24.jpeg` (logo circular, 738×1600 com tarjas).

A `5.jpeg` (463×487) **foi recuperada e publicada** como `agasalho-amigos-do-gole.webp`: é a única
peça de agasalho do lote com escudo próprio, e a categoria não tinha foto nenhuma. O corte tira o
logo e o letreiro do topo da prancha; a largura fica nos 463 originais, sem ampliar — ampliar só
deixaria borrado. ⚠ **Ainda vale pedir o original ao dono**: em tela de celular densa ela fica macia
perto das outras.

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
