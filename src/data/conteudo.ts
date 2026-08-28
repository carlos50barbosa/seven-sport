import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  portfolioSeed,
  uniformeCorporativoSeed,
  uniformeDestaqueSeed,
  pranchaExemploSeed,
  categoriasDoCatalogo,
  CATEGORIA_PADRAO,
  type PranchaExemplo,
  type Uniforme,
} from '@/data/portfolio';
import { produtos as produtosSeed, type Produto } from '@/data/produtos';

/**
 * O conteúdo visual do site, resolvido em tempo de BUILD.
 *
 * Duas fontes, nesta ordem:
 *  1. `dados/galeria.json` — escrito pelo painel do admin. Manda quando existe.
 *  2. as sementes de `portfolio.ts` / `produtos.ts` — com que o site nasce.
 *
 * O manifesto é AUTORITATIVO, não um remendo por cima da semente: se ele existe,
 * a lista dele é a lista, inteira. Foi de propósito — do contrário, apagar um
 * time no painel não teria como funcionar (a semente o traria de volta a cada
 * build, e o admin nunca entenderia por quê).
 *
 * ⚠ ESTE ARQUIVO LÊ DISCO. Só server component pode importá-lo. Client component
 * ('use client') importa tipo e `mostrarNomeDosTimes` de `@/data/portfolio`, que
 * é puro de propósito. Um `import` daqui dentro de um client component quebra o
 * build com "Module not found: node:fs" — o erro é confuso, a causa é esta.
 *
 * Com `output: 'export'` toda página é renderizada no build, então ler arquivo
 * aqui não custa nada em runtime: o resultado já vai congelado dentro do HTML.
 */

export const caminhoDoManifesto = join(process.cwd(), 'dados', 'galeria.json');

type Manifesto = {
  versao: number;
  atualizadoEm?: string;
  portfolio: Uniforme[];
  uniformeDestaque: Uniforme;
  uniformeCorporativo: Uniforme;
  pranchaExemplo: PranchaExemplo;
  /** slug do produto → caminho público da foto. Slug ausente = produto sem foto. */
  produtos: Record<string, string>;
};

/** Falha alto e claro: build quebrado é melhor que site publicado com conteúdo errado. */
function recusar(motivo: string): never {
  throw new Error(
    `Manifesto inválido em ${caminhoDoManifesto}: ${motivo}.\n` +
      'O painel (/admin) grava este arquivo validado — se ele foi editado à mão, ' +
      'corrija ou apague para o site voltar ao conteúdo de src/data/.',
  );
}

const CATEGORIAS_VALIDAS: readonly string[] = categoriasDoCatalogo.map((c) => c.id);

function exigirUniforme(valor: unknown, onde: string): Uniforme {
  if (!valor || typeof valor !== 'object') recusar(`${onde} não é um objeto`);
  const u = valor as Uniforme;
  if (!u.slug || !u.time || typeof u.contexto !== 'string') {
    recusar(`${onde} precisa de slug, time e contexto`);
  }
  // Sem foto e sem vetor a MockupBoard renderiza uma prancha vazia — barra aqui.
  if (!u.foto?.frente && !u.vetor) recusar(`${onde} (${u.slug}) não tem foto de frente nem vetor`);

  /**
   * Categoria é normalizada, não exigida — de propósito.
   *
   * O manifesto que já está no ar foi escrito antes do catálogo existir e não tem
   * esse campo. Exigir aqui quebraria o build do site em produção no primeiro
   * deploy, por conta de um dado que o admin nunca teve como preencher. Cai na
   * gaveta "Outros", que é visível e corrigível no painel em dois cliques.
   */
  const categoria = CATEGORIAS_VALIDAS.includes(u.categoria) ? u.categoria : CATEGORIA_PADRAO;

  return { ...u, categoria };
}

function lerManifesto(): Manifesto | null {
  let cru: string;
  try {
    cru = readFileSync(caminhoDoManifesto, 'utf8');
  } catch (erro) {
    // Instalação nova, ou painel que ainda não salvou: a semente resolve.
    if ((erro as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw erro;
  }

  let dados: Partial<Manifesto>;
  try {
    dados = JSON.parse(cru) as Partial<Manifesto>;
  } catch {
    recusar('não é JSON válido');
  }

  if (!Array.isArray(dados.portfolio)) recusar('"portfolio" precisa ser uma lista');
  if (dados.portfolio.length === 0) recusar('"portfolio" está vazio — a galeria ficaria sem nada');

  const prancha = dados.pranchaExemplo;
  if (!prancha?.src || !prancha.alt || !prancha.largura || !prancha.altura) {
    recusar('"pranchaExemplo" precisa de src, alt, largura e altura');
  }

  return {
    versao: dados.versao ?? 1,
    atualizadoEm: dados.atualizadoEm,
    portfolio: dados.portfolio.map((u, i) => exigirUniforme(u, `portfolio[${i}]`)),
    uniformeDestaque: exigirUniforme(dados.uniformeDestaque, 'uniformeDestaque'),
    uniformeCorporativo: exigirUniforme(dados.uniformeCorporativo, 'uniformeCorporativo'),
    pranchaExemplo: prancha,
    produtos: dados.produtos ?? {},
  };
}

const manifesto = lerManifesto();

export const portfolio: Uniforme[] = manifesto?.portfolio ?? portfolioSeed;
export const uniformeDestaque: Uniforme = manifesto?.uniformeDestaque ?? uniformeDestaqueSeed;
export const uniformeCorporativo: Uniforme =
  manifesto?.uniformeCorporativo ?? uniformeCorporativoSeed;
export const pranchaExemplo: PranchaExemplo = manifesto?.pranchaExemplo ?? pranchaExemploSeed;

/**
 * Tudo que a loja já produziu — é isto que `/catalogo` lista.
 *
 * União do portfólio com os destaques, e não só o portfólio. Um trabalho
 * promovido a destaque continua sendo um trabalho: o Arruma Nada e o Margirius
 * estavam no ar, na página de uniformes, e mesmo assim ficavam de fora do
 * catálogo — que se anuncia como "todo uniforme que já saiu daqui".
 *
 * A alternativa seria pedir ao admin que cadastrasse o mesmo trabalho duas vezes,
 * o que garantiria que uma das duas cópias ficaria desatualizada. Aqui ele
 * cadastra uma vez e o catálogo se monta sozinho.
 *
 * Dedupe por slug, com o portfólio ganhando: é a lista cuja ordem o admin
 * controla no painel.
 */
export const catalogo: Uniforme[] = (() => {
  const jaEstao = new Set(portfolio.map((u) => u.slug));
  const destaques = [uniformeDestaque, uniformeCorporativo].filter((u) => !jaEstao.has(u.slug));
  return [...portfolio, ...destaques];
})();

/**
 * O catálogo de produtos é código (nome, descrição, desenho vetorial); só a FOTO é editável.
 * Por isso a ordem e os slugs vêm sempre de `produtos.ts` — o painel nunca cria
 * nem apaga produto, apenas preenche ou limpa a foto de cada um.
 */
export const produtos: Produto[] = manifesto
  ? produtosSeed.map((p) => {
      const foto = manifesto.produtos[p.slug];
      return foto ? { ...p, foto } : { ...p, foto: undefined };
    })
  : produtosSeed;
