/**
 * Leva para o site no ar os trabalhos que existem na semente e faltam no manifesto.
 *
 * Rodar:  npm run conteudo:sincronizar
 *
 * POR QUE ISTO PRECISA EXISTIR
 *
 * Depois do primeiro Salvar no painel, quem manda é `dados/galeria.json`, e a
 * semente em `src/data/portfolio.ts` vira só o ponto de partida de uma instalação
 * nova. Isso é o certo — senão apagar um time no painel não funcionaria, porque a
 * semente o traria de volta a cada build.
 *
 * O efeito colateral é que trabalho acrescentado NO CÓDIGO nunca chega ao site que
 * já rodou o painel. Foi o que aconteceu com o agasalho do Amigos do Gole: a foto
 * foi recortada, versionada e publicada em `public/fotos/`, e mesmo assim não
 * apareceria no catálogo do ar.
 *
 * Este script fecha essa porta. Ele ACRESCENTA o que falta, comparando por slug, e
 * corrige só o que é fato e não escolha: categoria em branco, e as dimensões que o
 * manifesto declara para a prancha quando elas discordam do arquivo em disco.
 * Nunca altera nem remove aquilo que o dono da loja de fato editou. O manifesto
 * anterior fica salvo ao lado, com a data, antes de qualquer escrita.
 *
 * Depois de rodar, publique: pelo painel, ou com `npm run build`.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const raiz = resolve(import.meta.dirname, '..');
const caminhoSemente = resolve(raiz, 'admin/semente.json');
const caminhoManifesto = resolve(raiz, 'dados/galeria.json');

const simular = process.argv.includes('--simular');

if (!existsSync(caminhoManifesto)) {
  console.log(
    'Não existe dados/galeria.json ainda — esta instalação nunca salvou pelo painel.\n' +
      'Nada a sincronizar: o site já nasce com a semente inteira.',
  );
  process.exit(0);
}

const semente = JSON.parse(readFileSync(caminhoSemente, 'utf8'));
const manifesto = JSON.parse(readFileSync(caminhoManifesto, 'utf8'));

const porSlug = new Map(semente.portfolio.map((u) => [u.slug, u]));
const jaEstao = new Set(manifesto.portfolio.map((u) => u.slug));
const faltando = semente.portfolio.filter((u) => !jaEstao.has(u.slug));
const gavetas = new Set((semente.categorias ?? []).map((c) => c.id));

/**
 * Preenche a categoria de quem entrou antes do catálogo existir.
 *
 * Não é alterar edição do dono: é preencher um campo em branco, num trabalho que
 * a semente já sabe classificar. Sem isto, os trabalhos antigos ficariam todos
 * na gaveta "Outros" — o filtro do site sumiria (uma gaveta só não é escolha) e
 * alguém teria de acertar cada um no seletor do painel.
 *
 * Categoria já preenchida NUNCA é tocada, mesmo que discorde da semente: ali
 * houve escolha de alguém.
 */
const classificados = [];
for (const u of manifesto.portfolio) {
  if (gavetas.has(u.categoria)) continue;
  const daSemente = porSlug.get(u.slug);
  if (!daSemente?.categoria) continue;
  u.categoria = daSemente.categoria;
  classificados.push(u);
}

/**
 * Corrige as dimensões da prancha quando elas não batem com o arquivo em disco.
 *
 * Isto não é alterar edição do dono: largura e altura não são escolha de ninguém,
 * são propriedade do arquivo. Quando discordam, quem está errado é o manifesto.
 *
 * E o estrago é silencioso: o navegador recebe um `width` menor que o arquivo,
 * desenha a arte reduzida, e a letra miúda — selos, patrocinadores, telefone —
 * volta a não se ler. Que é o problema inteiro justamente desta imagem, a única
 * do site cujo conteúdo é texto.
 *
 * Aconteceu de verdade: a prancha foi regerada de 1400 para 1565px no código, o
 * deploy subiu o arquivo novo, e o HTML no ar continuou declarando 1400 porque o
 * manifesto manda depois do primeiro Salvar. `src` e `alt` seguem intocados —
 * nesses dois houve escolha de alguém.
 */
const prancha = manifesto.pranchaExemplo;
let pranchaCorrigida = null;
if (prancha?.src) {
  const naPasta = resolve(raiz, 'public', prancha.src.replace(/^\//, ''));
  if (existsSync(naPasta)) {
    const { width, height } = await sharp(naPasta).metadata();
    if (width && height && (prancha.largura !== width || prancha.altura !== height)) {
      pranchaCorrigida = {
        de: `${prancha.largura}x${prancha.altura}`,
        para: `${width}x${height}`,
      };
      prancha.largura = width;
      prancha.altura = height;
    }
  }
}

if (!faltando.length && !classificados.length && !pranchaCorrigida) {
  console.log(`Nada a fazer: os ${semente.portfolio.length} trabalhos da semente já estão no ar.`);
  process.exit(0);
}

if (faltando.length) {
  console.log(`Faltam ${faltando.length} no manifesto:\n`);
  for (const u of faltando) {
    console.log(`  + ${u.time} — ${u.contexto} [${u.categoria}]`);
    console.log(`    ${u.foto?.frente ?? '(sem foto)'}`);
  }
}

if (classificados.length) {
  console.log(`\n${classificados.length} sem categoria, classificados pela semente:\n`);
  for (const u of classificados) console.log(`  ~ ${u.time} → ${u.categoria}`);
}

if (pranchaCorrigida) {
  console.log(
    `\nPrancha de exemplo: o manifesto declara ${pranchaCorrigida.de}, ` +
      `mas o arquivo tem ${pranchaCorrigida.para} — corrigindo a declaração.`,
  );
}

if (simular) {
  console.log('\n--simular: nada foi escrito.');
  process.exit(0);
}

// Cópia datada antes de tocar no que está no ar. Barato, e evita o arrependimento.
const reserva = `${caminhoManifesto}.${manifesto.atualizadoEm?.slice(0, 10) ?? 'antes'}.bak`;
copyFileSync(caminhoManifesto, reserva);

manifesto.portfolio.push(...faltando);
manifesto.atualizadoEm = new Date().toISOString();

// Escreve num temporário e renomeia por cima: o rename é atômico, então um build
// concorrente ou o serviço do painel nunca leem meio JSON.
const temporario = `${caminhoManifesto}.tmp`;
writeFileSync(temporario, JSON.stringify(manifesto, null, 2) + '\n');
renameSync(temporario, caminhoManifesto);

const feito = [
  faltando.length && `${faltando.length} acrescentado(s)`,
  classificados.length && `${classificados.length} classificado(s)`,
  pranchaCorrigida && 'dimensões da prancha corrigidas',
].filter(Boolean);

console.log(
  `\n${feito.join(' e ')}. O manifesto tem agora ${manifesto.portfolio.length} trabalhos.\n` +
    `Cópia do anterior: ${reserva}\n\n` +
    'Agora publique — pelo painel, ou com `npm run build`.',
);
