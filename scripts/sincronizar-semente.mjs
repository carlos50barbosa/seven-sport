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
 * Este script fecha essa porta. Ele só ACRESCENTA o que falta, comparando por
 * slug — nunca altera nem remove o que o dono da loja editou. O manifesto anterior
 * fica salvo ao lado, com a data, antes de qualquer escrita.
 *
 * Depois de rodar, publique: pelo painel, ou com `npm run build`.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync, renameSync } from 'node:fs';
import { resolve } from 'node:path';

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

if (!faltando.length && !classificados.length) {
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
].filter(Boolean);

console.log(
  `\n${feito.join(' e ')}. O manifesto tem agora ${manifesto.portfolio.length} trabalhos.\n` +
    `Cópia do anterior: ${reserva}\n\n` +
    'Agora publique — pelo painel, ou com `npm run build`.',
);
