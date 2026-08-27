/**
 * Painel do admin da Seven Sport — troca, remove e acrescenta as fotos do site.
 *
 * Rodar:  npm run admin      (127.0.0.1:4123, o Nginx publica em /admin)
 *
 * ---------------------------------------------------------------------------
 * POR QUE ISTO EXISTE, SE O SITE É ESTÁTICO
 *
 * O site continua 100% estático: o Nginx serve `out/` e nenhum visitante toca
 * neste processo. O que ele faz é receber a foto do dono da loja, converter,
 * gravar o manifesto e então rodar `npm run build` — o mesmo build do deploy.
 * O HTML publicado sai igualzinho ao de antes; só o conteúdo mudou. SEO, LCP e
 * "sem Node no caminho do visitante" ficam intactos.
 *
 * O preço é ~1 min entre salvar e aparecer no ar, e um processo a mais na VPS
 * que, se cair, derruba só o painel — nunca o site.
 * ---------------------------------------------------------------------------
 *
 * Uma dependência só (`sharp`, que os scripts já usavam). Upload sem multipart:
 * o painel manda o arquivo como corpo cru e os metadados na query, o que dispensa
 * parser de formulário — e com ele toda uma classe de bug de segurança.
 */
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createHmac, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { readFile, writeFile, rename, mkdir, readdir, unlink, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, extname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const RAIZ = resolve(import.meta.dirname, '..');

// ─────────────────────────────────────────────────────────────── configuração

/**
 * Lê `admin/.env.local` sem dotenv. Na VPS as variáveis chegam pelo systemd
 * (EnvironmentFile), e aí este arquivo nem existe — o que já vem no ambiente
 * ganha, para o systemd sempre mandar mais que um arquivo esquecido no disco.
 */
function carregarEnvLocal() {
  const caminho = join(RAIZ, 'admin/.env.local');
  if (!existsSync(caminho)) return;
  for (const linha of readFileSync(caminho, 'utf8').split('\n')) {
    const corte = linha.indexOf('=');
    if (corte < 1 || linha.trimStart().startsWith('#')) continue;
    const chave = linha.slice(0, corte).trim();
    if (process.env[chave] === undefined) {
      process.env[chave] = linha
        .slice(corte + 1)
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  }
}
carregarEnvLocal();

const config = {
  porta: Number(process.env.ADMIN_PORTA ?? 4123),
  /** 127.0.0.1: quem fala com o mundo é o Nginx. Nunca abra em 0.0.0.0. */
  endereco: process.env.ADMIN_ENDERECO ?? '127.0.0.1',
  usuario: process.env.ADMIN_USUARIO ?? 'admin',
  senhaHash: process.env.ADMIN_SENHA_HASH ?? '',
  segredo: process.env.ADMIN_SEGREDO ?? '',
  /** Prefixo público. Tem que casar com o `location` do Nginx. */
  base: (process.env.ADMIN_BASE ?? '/admin').replace(/\/$/, ''),
  /** Sessão de 12 h: um dia de trabalho, sem obrigar a logar toda hora. */
  horasDeSessao: 12,
};

if (!config.senhaHash || !config.segredo) {
  console.error(
    'Faltam credenciais. Rode `npm run admin:senha` e cole a saída em admin/.env.local\n' +
      '(ou em /etc/sevensport-admin.env, se for a VPS).',
  );
  process.exit(1);
}

const CAMINHOS = {
  dados: join(RAIZ, 'dados'),
  manifesto: join(RAIZ, 'dados/galeria.json'),
  estado: join(RAIZ, 'dados/estado.json'),
  originais: join(RAIZ, 'dados/originais'),
  /** Dentro de public/: o `next build` copia para out/ sozinho, sem passo extra. */
  fotos: join(RAIZ, 'public/galeria'),
  semente: join(RAIZ, 'admin/semente.json'),
  painel: join(RAIZ, 'admin/publico'),
};

/** Larguras iguais às de `scripts/preparar-imagens.mjs`, para as fotos casarem. */
const DESTINOS = {
  galeria: { largura: 900, prefixo: 'time' },
  produto: { largura: 900, prefixo: 'produto' },
  prancha: { largura: 1400, prefixo: 'prancha' },
};

const LIMITE_JSON = 2 * 1024 * 1024;
const LIMITE_FOTO = 25 * 1024 * 1024;

// ───────────────────────────────────────────────────────────────────── sessão

/** Compara em tempo constante mesmo com tamanhos diferentes (o !== vazaria o tamanho). */
function iguaisEmTempoConstante(a, b) {
  const ha = createHash('sha256').update(String(a)).digest();
  const hb = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

function conferirSenha(senha) {
  const [rotulo, N, r, p, salB64, hashB64] = config.senhaHash.split('$');
  if (rotulo !== 'scrypt') return false;
  const derivada = scryptSync(senha.normalize('NFKC'), Buffer.from(salB64, 'base64'), 64, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  });
  const guardada = Buffer.from(hashB64, 'base64');
  return derivada.length === guardada.length && timingSafeEqual(derivada, guardada);
}

function assinar(texto) {
  return createHmac('sha256', config.segredo).update(texto).digest('base64url');
}

function criarSessao() {
  const expira = Date.now() + config.horasDeSessao * 3600_000;
  const corpo = `${Buffer.from(config.usuario).toString('base64url')}.${expira}`;
  return `${corpo}.${assinar(corpo)}`;
}

function sessaoValida(cookie) {
  if (!cookie) return false;
  const partes = cookie.split('.');
  if (partes.length !== 3) return false;
  const [usuarioB64, expira, assinatura] = partes;
  if (!iguaisEmTempoConstante(assinatura, assinar(`${usuarioB64}.${expira}`))) return false;
  if (Number(expira) < Date.now()) return false;
  return Buffer.from(usuarioB64, 'base64url').toString() === config.usuario;
}

function lerCookie(req, nome) {
  for (const par of (req.headers.cookie ?? '').split(';')) {
    const corte = par.indexOf('=');
    if (corte > 0 && par.slice(0, corte).trim() === nome) return par.slice(corte + 1).trim();
  }
  return null;
}

const NOME_COOKIE = 'sevensport_admin';

function cabecalhoDeCookie(req, valor) {
  // Secure só sob HTTPS: com `Secure` em HTTP puro o navegador descarta o cookie
  // e o login entra em loop — exatamente o que acontece testando em localhost.
  const seguro = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
  const idade = valor ? config.horasDeSessao * 3600 : 0;
  return `${NOME_COOKIE}=${valor ?? ''}; Path=${config.base}; HttpOnly; SameSite=Strict; Max-Age=${idade}${seguro}`;
}

/** Trava de força bruta: 5 erros por IP, depois 15 min de castigo. */
const tentativas = new Map();

function bloqueado(ip) {
  const t = tentativas.get(ip);
  if (!t) return false;
  if (t.ate < Date.now()) {
    tentativas.delete(ip);
    return false;
  }
  return t.falhas >= 5;
}

function registrarFalha(ip) {
  const t = tentativas.get(ip) ?? { falhas: 0, ate: 0 };
  t.falhas += 1;
  t.ate = Date.now() + 15 * 60_000;
  tentativas.set(ip, t);
}

// ────────────────────────────────────────────────────────────────── manifesto

const lerSemente = () => JSON.parse(readFileSync(CAMINHOS.semente, 'utf8'));

/**
 * Catálogo de produtos para o painel. O nome e a ordem são código (`produtos.ts`);
 * o painel só preenche a foto de cada um, nunca cria nem apaga produto.
 *
 * Node >= 22.18 lê o .ts direto (o arquivo só tem `import type`, que some no
 * type-stripping), então o catálogo fica sempre em dia. Em Node antigo cai no
 * `admin/semente.json`, que é versionado e atualizado por `npm run admin:semear`.
 */
async function carregarCatalogo() {
  try {
    const modulo = await import(pathToFileURL(join(RAIZ, 'src/data/produtos.ts')).href);
    return modulo.produtos.map((p) => ({ slug: p.slug, nome: p.nome }));
  } catch {
    console.warn('Node sem leitura de .ts — catálogo vindo de admin/semente.json.');
    return lerSemente().produtos.map((p) => ({ slug: p.slug, nome: p.nome }));
  }
}

function manifestoDaSemente() {
  const s = lerSemente();
  return {
    versao: 1,
    atualizadoEm: new Date().toISOString(),
    portfolio: s.portfolio,
    uniformeDestaque: s.uniformeDestaque,
    uniformeCorporativo: s.uniformeCorporativo,
    pranchaExemplo: s.pranchaExemplo,
    produtos: Object.fromEntries(s.produtos.filter((p) => p.foto).map((p) => [p.slug, p.foto])),
  };
}

/** Grava por arquivo temporário + rename: um build concorrente nunca lê meio JSON. */
async function gravarManifesto(manifesto) {
  await mkdir(CAMINHOS.dados, { recursive: true });
  const temporario = `${CAMINHOS.manifesto}.tmp`;
  await writeFile(temporario, JSON.stringify(manifesto, null, 2) + '\n');
  await rename(temporario, CAMINHOS.manifesto);
}

async function lerManifesto() {
  try {
    return JSON.parse(await readFile(CAMINHOS.manifesto, 'utf8'));
  } catch (erro) {
    if (erro.code !== 'ENOENT') throw erro;
    // Primeira subida: nasce com o conteúdo que já estava no ar.
    const inicial = manifestoDaSemente();
    await gravarManifesto(inicial);
    console.log('dados/galeria.json criado a partir de admin/semente.json.');
    return inicial;
  }
}

/** Mesmas regras de `src/data/conteudo.ts`, aplicadas antes de gravar. */
function validarManifesto(m, slugsDeProduto) {
  const erros = [];
  const caminhoOk = (c) => typeof c === 'string' && /^\/(fotos|galeria)\/[\w.-]+$/.test(c);

  const conferirUniforme = (u, onde) => {
    if (!u || typeof u !== 'object') {
      erros.push(`${onde}: faltando`);
      return;
    }
    if (!u.slug?.trim()) erros.push(`${onde}: sem identificador`);
    if (!u.time?.trim()) erros.push(`${onde}: sem nome do time`);
    if (typeof u.contexto !== 'string') erros.push(`${onde}: sem modalidade`);
    if (!u.foto?.frente && !u.vetor) erros.push(`${onde}: sem foto de frente`);
    for (const lado of ['frente', 'costas']) {
      if (u.foto?.[lado] && !caminhoOk(u.foto[lado])) {
        erros.push(`${onde}: caminho inválido em ${lado}`);
      }
    }
  };

  if (!Array.isArray(m.portfolio) || m.portfolio.length === 0) {
    erros.push('a galeria precisa de pelo menos um time');
  } else {
    m.portfolio.forEach((u, i) => conferirUniforme(u, `galeria, item ${i + 1}`));
    const slugs = m.portfolio.map((u) => u?.slug);
    const repetido = slugs.find((s, i) => slugs.indexOf(s) !== i);
    if (repetido) erros.push(`identificador repetido na galeria: ${repetido}`);
  }

  conferirUniforme(m.uniformeDestaque, 'destaque de /uniformes');
  conferirUniforme(m.uniformeCorporativo, 'uniforme corporativo');

  const p = m.pranchaExemplo;
  if (!p || !caminhoOk(p.src)) erros.push('prancha de exemplo: caminho inválido');
  if (!p?.alt?.trim()) erros.push('prancha de exemplo: descrição (alt) obrigatória');
  if (!(p?.largura > 0) || !(p?.altura > 0)) erros.push('prancha de exemplo: sem dimensões');

  for (const [slug, caminho] of Object.entries(m.produtos ?? {})) {
    if (!slugsDeProduto.includes(slug)) erros.push(`produto desconhecido: ${slug}`);
    else if (!caminhoOk(caminho)) erros.push(`produto ${slug}: caminho inválido`);
  }

  return erros;
}

/** Todo caminho de foto citado pelo manifesto — a lista do que NÃO pode ser apagado. */
function fotosEmUso(m) {
  const usadas = new Set();
  const somar = (c) => c && usadas.add(c);
  for (const u of [...m.portfolio, m.uniformeDestaque, m.uniformeCorporativo]) {
    somar(u?.foto?.frente);
    somar(u?.foto?.costas);
  }
  somar(m.pranchaExemplo?.src);
  Object.values(m.produtos ?? {}).forEach(somar);
  return usadas;
}

/**
 * Apaga de public/galeria/ o que o manifesto não cita mais.
 *
 * A carência de 1 h protege o arquivo recém-enviado que ainda está só na tela do
 * painel, sem ter sido salvo — sem ela, salvar numa aba apagaria o upload da outra.
 * O original em dados/originais/ nunca é tocado: é o desfazer.
 */
async function limparOrfas(manifesto) {
  const usadas = fotosEmUso(manifesto);
  const carencia = Date.now() - 3600_000;
  let apagadas = 0;
  for (const arquivo of await readdir(CAMINHOS.fotos).catch(() => [])) {
    if (usadas.has(`/galeria/${arquivo}`)) continue;
    const alvo = join(CAMINHOS.fotos, arquivo);
    try {
      if ((await stat(alvo)).mtimeMs > carencia) continue;
      await unlink(alvo);
      apagadas += 1;
    } catch {
      // Some entre o readdir e o stat/unlink: já era faxina, o objetivo se cumpriu.
      // Deixar escapar aqui derrubaria o Salvar inteiro por causa de uma sobra.
    }
  }
  return apagadas;
}

// ──────────────────────────────────────────────────────────────────── imagens

/** Nome previsível e seguro: o do cliente nunca vira caminho. */
function apelidar(texto, reserva) {
  const limpo = String(texto ?? '')
    .normalize('NFD')
    // ̀-ͯ: os acentos que o NFD acabou de soltar da letra.
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return limpo || reserva;
}

/**
 * Converte para WebP na largura do destino e grava em public/galeria/.
 *
 * O hash do conteúdo entra no nome de propósito: o Nginx guarda /galeria/ por 30
 * dias, então substituir uma foto reaproveitando o nome mostraria a antiga por um
 * mês. Conteúdo diferente, nome diferente, cache nunca mente.
 */
async function processarFoto(bytes, destino, rotulo) {
  const perfil = DESTINOS[destino];
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8);
  const nome = `${apelidar(rotulo, perfil.prefixo)}-${hash}.webp`;

  await mkdir(CAMINHOS.fotos, { recursive: true });
  await mkdir(CAMINHOS.originais, { recursive: true });

  const info = await sharp(bytes)
    // rotate() sem argumento aplica o EXIF: foto de celular deitada endireita aqui.
    .rotate()
    .resize({ width: perfil.largura, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(CAMINHOS.fotos, nome));

  // O original fica guardado para dar recorte melhor depois sem pedir a foto de novo.
  const formatoOriginal = (await sharp(bytes).metadata()).format ?? 'bin';
  await writeFile(join(CAMINHOS.originais, `${basename(nome, '.webp')}.${formatoOriginal}`), bytes);

  return { caminho: `/galeria/${nome}`, largura: info.width, altura: info.height, bytes: info.size };
}

// ─────────────────────────────────────────────────────────────────── publicar

/**
 * Estado do `npm run build`. Um de cada vez: dois builds concorrentes escreveriam
 * no mesmo out/ e o site sairia com metade de cada um.
 */
const publicacao = { estado: 'ocioso', iniciadoEm: null, terminadoEm: null, log: [] };

async function lerEstado() {
  try {
    return JSON.parse(await readFile(CAMINHOS.estado, 'utf8'));
  } catch {
    return { publicadoEm: null, manifestoPublicado: null };
  }
}

function anotar(linha) {
  for (const l of String(linha).split('\n')) {
    if (l.trim()) publicacao.log.push(l.trimEnd());
  }
  // Guarda só a cauda: o log é para descobrir por que falhou, não é arquivo morto.
  if (publicacao.log.length > 200) publicacao.log.splice(0, publicacao.log.length - 200);
}

function publicar(manifesto) {
  if (publicacao.estado === 'publicando') return false;

  publicacao.estado = 'publicando';
  publicacao.iniciadoEm = new Date().toISOString();
  publicacao.terminadoEm = null;
  publicacao.log = [];
  anotar('npm run build');

  // No Windows o npm é um .cmd, que o Node 20+ recusa spawnar sem shell.
  // Os argumentos são constantes, então o shell aqui não abre porta para injeção.
  const noWindows = process.platform === 'win32';
  const processo = spawn(noWindows ? 'npm.cmd' : 'npm', ['run', 'build'], {
    cwd: RAIZ,
    shell: noWindows,
    env: { ...process.env, NODE_ENV: 'production' },
  });

  processo.stdout.on('data', (d) => anotar(d.toString()));
  processo.stderr.on('data', (d) => anotar(d.toString()));

  processo.on('close', async (codigo) => {
    publicacao.estado = codigo === 0 ? 'ok' : 'erro';
    publicacao.terminadoEm = new Date().toISOString();
    if (codigo === 0) {
      await writeFile(
        CAMINHOS.estado,
        JSON.stringify(
          { publicadoEm: publicacao.terminadoEm, manifestoPublicado: manifesto.atualizadoEm },
          null,
          2,
        ) + '\n',
      );
      anotar('Publicado. O site já está no ar com o conteúdo novo.');
    } else {
      anotar(`Falhou (código ${codigo}). O site NO AR continua o de antes, intacto.`);
    }
  });

  processo.on('error', (erro) => {
    publicacao.estado = 'erro';
    publicacao.terminadoEm = new Date().toISOString();
    anotar(`Não consegui rodar o npm: ${erro.message}`);
  });

  return true;
}

// ─────────────────────────────────────────────────────────────────────── HTTP

function responder(res, status, dados, extras = {}) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...extras });
  res.end(JSON.stringify(dados));
}

function lerCorpo(req, limite) {
  return new Promise((resolve, reject) => {
    const pedacos = [];
    let total = 0;
    req.on('data', (p) => {
      total += p.length;
      if (total > limite) {
        reject(new Error('grande demais'));
        req.destroy();
        return;
      }
      pedacos.push(p);
    });
    req.on('end', () => resolve(Buffer.concat(pedacos)));
    req.on('error', reject);
  });
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

async function servirPainel(res, arquivo) {
  const alvo = resolve(CAMINHOS.painel, arquivo);
  // Trava de path traversal, ainda que a rota só passe nomes conhecidos.
  if (!alvo.startsWith(CAMINHOS.painel)) return responder(res, 403, { erro: 'proibido' });
  try {
    const corpo = await readFile(alvo);
    res.writeHead(200, {
      'content-type': TIPOS[extname(alvo)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(corpo);
  } catch {
    responder(res, 404, { erro: 'não encontrado' });
  }
}

const catalogo = await carregarCatalogo();
const slugsDeProduto = catalogo.map((p) => p.slug);

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://interno');

  // Tem que ser a base exata ou algo abaixo dela. Um `startsWith` solto deixaria
  // `/administrativo` entrar como se fosse `/admin`.
  const noPainel = url.pathname === config.base || url.pathname.startsWith(`${config.base}/`);
  if (!noPainel) return responder(res, 404, { erro: 'fora do painel' });

  const resto = url.pathname.slice(config.base.length);

  // HEAD é GET sem corpo, e o Node já corta o corpo sozinho ao responder a um
  // HEAD. Tratar os dois igual evita que `curl -I` e monitor de disponibilidade
  // caiam na checagem de sessão lá embaixo e leiam 401 como painel quebrado.
  const leitura = req.method === 'GET' || req.method === 'HEAD';

  /**
   * `/admin` → `/admin/`, com redirect.
   *
   * Sem a barra final o navegador resolve `src="painel.js"` do index contra o
   * diretório PAI — vira `/painel.js`, fora do painel, e a página carrega sem
   * CSS e sem JS. Sem erro visível: o formulário simplesmente não faz nada.
   */
  if (resto === '' && leitura) {
    res.writeHead(302, { location: `${config.base}/` });
    return res.end();
  }

  const rota = resto || '/';

  // Nunca deixe o painel ser cacheado nem embutido em iframe de terceiro.
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('referrer-policy', 'same-origin');

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ?? req.socket.remoteAddress;
  const autenticado = sessaoValida(lerCookie(req, NOME_COOKIE));

  try {
    // ---- login (única rota de API aberta)
    if (rota === '/api/entrar' && req.method === 'POST') {
      if (bloqueado(ip)) {
        return responder(res, 429, { erro: 'Muitas tentativas. Espere 15 minutos.' });
      }
      const { usuario, senha } = JSON.parse(await lerCorpo(req, 4096));
      const ok = iguaisEmTempoConstante(usuario ?? '', config.usuario) && conferirSenha(senha ?? '');
      if (!ok) {
        registrarFalha(ip);
        // Mensagem única de propósito: dizer "usuário não existe" entrega quem existe.
        return responder(res, 401, { erro: 'Usuário ou senha incorretos.' });
      }
      tentativas.delete(ip);
      return responder(
        res,
        200,
        { ok: true },
        { 'set-cookie': cabecalhoDeCookie(req, criarSessao()) },
      );
    }

    // ---- páginas do painel (o HTML é público; quem guarda o conteúdo é a API)
    if (leitura && (rota === '/' || rota === '')) return servirPainel(res, 'index.html');
    if (leitura && (rota === '/painel.css' || rota === '/painel.js')) {
      return servirPainel(res, rota.slice(1));
    }

    // ---- daqui para baixo, sessão obrigatória
    if (!autenticado) return responder(res, 401, { erro: 'Sessão expirada. Entre de novo.' });

    if (rota === '/api/sair' && req.method === 'POST') {
      return responder(res, 200, { ok: true }, { 'set-cookie': cabecalhoDeCookie(req, null) });
    }

    if (rota === '/api/conteudo' && req.method === 'GET') {
      const manifesto = await lerManifesto();
      const estado = await lerEstado();
      return responder(res, 200, {
        manifesto,
        catalogo,
        publicacao,
        // "Salvei mas ainda não publiquei": o ar está numa versão anterior do manifesto.
        pendente: estado.manifestoPublicado !== manifesto.atualizadoEm,
        publicadoEm: estado.publicadoEm,
      });
    }

    if (rota === '/api/conteudo' && req.method === 'PUT') {
      const recebido = JSON.parse(await lerCorpo(req, LIMITE_JSON));
      const erros = validarManifesto(recebido, slugsDeProduto);
      if (erros.length) return responder(res, 422, { erro: 'Conteúdo inválido', erros });

      const manifesto = { ...recebido, versao: 1, atualizadoEm: new Date().toISOString() };
      await gravarManifesto(manifesto);
      const apagadas = await limparOrfas(manifesto);
      return responder(res, 200, { ok: true, manifesto, apagadas });
    }

    if (rota === '/api/foto' && req.method === 'POST') {
      const destino = url.searchParams.get('destino') ?? 'galeria';
      if (!DESTINOS[destino]) return responder(res, 400, { erro: 'destino desconhecido' });
      const bytes = await lerCorpo(req, LIMITE_FOTO);
      if (!bytes.length) return responder(res, 400, { erro: 'arquivo vazio' });
      try {
        const rotulo = url.searchParams.get('rotulo');
        return responder(res, 200, await processarFoto(bytes, destino, rotulo));
      } catch {
        // sharp recusa o que não for imagem — inclusive um PDF renomeado para .jpg.
        return responder(res, 415, { erro: 'Não consegui ler esse arquivo como imagem.' });
      }
    }

    /**
     * Miniatura para o painel.
     *
     * Por que não usar o caminho público direto: a foto recém-enviada existe em
     * `public/galeria/`, mas o Nginx serve `out/` — ela só aparece lá depois do
     * build. Sem esta rota, toda imagem nova ficaria quebrada na tela até publicar,
     * bem na hora em que o admin precisa conferir se acertou a foto.
     */
    if (rota === '/api/imagem' && leitura) {
      const caminho = url.searchParams.get('caminho') ?? '';
      if (!/^\/(fotos|galeria)\/[\w.-]+$/.test(caminho)) {
        return responder(res, 400, { erro: 'caminho inválido' });
      }
      const publicos = join(RAIZ, 'public');
      const alvo = resolve(publicos, `.${caminho}`);
      if (!alvo.startsWith(publicos)) return responder(res, 403, { erro: 'proibido' });
      try {
        const corpo = await readFile(alvo);
        const tipo = extname(alvo) === '.png' ? 'image/png' : 'image/webp';
        res.writeHead(200, { 'content-type': tipo, 'cache-control': 'private, max-age=300' });
        return res.end(corpo);
      } catch {
        return responder(res, 404, { erro: 'foto não encontrada' });
      }
    }

    if (rota === '/api/publicar' && req.method === 'POST') {
      const manifesto = await lerManifesto();
      if (!publicar(manifesto)) {
        return responder(res, 409, { erro: 'Já tem uma publicação rodando.' });
      }
      return responder(res, 202, { ok: true });
    }

    if (rota === '/api/publicar' && req.method === 'GET') return responder(res, 200, publicacao);

    return responder(res, 404, { erro: 'rota desconhecida' });
  } catch (erro) {
    if (erro.message === 'grande demais') {
      return responder(res, 413, { erro: 'Arquivo grande demais.' });
    }
    console.error(erro);
    // Detalhe de exceção fica no log do servidor, não na resposta.
    return responder(res, 500, { erro: 'Erro interno. Veja o log do serviço.' });
  }
});

await mkdir(CAMINHOS.dados, { recursive: true });
await lerManifesto();

servidor.listen(config.porta, config.endereco, () => {
  console.log(
    `Painel da Seven Sport em http://${config.endereco}:${config.porta}${config.base}\n` +
      `usuário: ${config.usuario} · ${catalogo.length} produtos no catálogo`,
  );
});
