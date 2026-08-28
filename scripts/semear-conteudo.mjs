/**
 * Gera `admin/semente.json` a partir dos dados em TypeScript.
 *
 * Para que serve: o painel do admin roda em Node puro e não compila TypeScript.
 * Ele precisa de duas coisas que só existem em `src/data/*.ts` — o conteúdo com
 * que uma instalação nova nasce, e a lista de produtos (slug + nome) para montar
 * as fichas de foto. Este script congela as duas num JSON que o painel lê direto.
 *
 * Rodar:  npm run admin:semear
 *
 * QUANDO RODAR: depois de mexer em `src/data/produtos.ts` (produto novo, nome
 * alterado). Commite o JSON junto com a mudança.
 *
 * ⚠ NÃO chame isto em `prebuild`. A VPS roda `git pull && npm run build`, e um
 * arquivo versionado reescrito durante o build deixaria a árvore suja — o `pull`
 * seguinte falharia por conflito local. Este script escreve; o build não.
 * (Em Node ≥ 22.18 o painel ainda relê o .ts direto ao subir, então um JSON
 * desatualizado só afeta quem estiver em Node antigo.)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const raiz = resolve(import.meta.dirname, '..');
const destino = resolve(raiz, 'admin/semente.json');

/** Node ≥ 22.18 apaga os tipos e importa .ts direto — ambos os arquivos só têm `import type`. */
async function importarDados(arquivo) {
  return import(pathToFileURL(resolve(raiz, 'src/data', arquivo)).href);
}

const portfolio = await importarDados('portfolio.ts');
const produtos = await importarDados('produtos.ts');

const semente = {
  // As gavetas do catálogo. O painel monta o seletor de categoria a partir daqui,
  // então gaveta nova em portfolio.ts só aparece lá depois de rodar este script.
  categorias: portfolio.categoriasDoCatalogo.map((c) => ({ id: c.id, rotulo: c.rotulo })),
  portfolio: portfolio.portfolioSeed,
  uniformeDestaque: portfolio.uniformeDestaqueSeed,
  uniformeCorporativo: portfolio.uniformeCorporativoSeed,
  pranchaExemplo: portfolio.pranchaExemploSeed,
  // Só slug, nome e foto: o resto do catálogo (descrição, desenho) é código e o painel não mexe.
  produtos: produtos.produtos.map((p) => ({ slug: p.slug, nome: p.nome, foto: p.foto ?? null })),
};

// Sem carimbo de data, de propósito: gerar de novo sem mudança no .ts produz um
// arquivo idêntico byte a byte, e o git não acusa alteração à toa.
const saida = JSON.stringify(semente, null, 2) + '\n';

let anterior = null;
try {
  anterior = readFileSync(destino, 'utf8');
} catch {
  /* primeira vez */
}

if (anterior === saida) {
  console.log('admin/semente.json já estava em dia.');
} else {
  writeFileSync(destino, saida);
  console.log(
    `admin/semente.json gravado — ${semente.portfolio.length} times no portfólio, ` +
      `${semente.produtos.length} produtos no catálogo.`,
  );
}
