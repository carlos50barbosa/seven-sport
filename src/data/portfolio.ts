import type { PadraoCamisa, CoresUniforme } from '@/components/ui/KitSvg';

/**
 * SEMENTE do conteúdo visual — os valores com que o site nasce.
 *
 * Quem lê isto aqui direto vê o estado ORIGINAL, não o que está no ar: assim que
 * o painel do admin salva pela primeira vez, `dados/galeria.json` passa a mandar
 * e estas listas viram só o ponto de partida. Por isso os nomes terminam em
 * `Seed` — para o import errado não compilar em silêncio.
 *
 * Página e seção devem importar de `@/data/conteudo`, que junta as duas fontes.
 *
 * Este arquivo é CLIENT-SAFE de propósito (a MockupBoard é 'use client' e importa
 * `Uniforme` e `mostrarNomeDosTimes` daqui). Não acrescente `node:fs` nele — a
 * leitura de disco mora em `conteudo.ts`, que só server component importa.
 */

/**
 * Mostrar ou não o nome do time em cada prancha do portfólio.
 *
 * Recomendação: manter `true`. O nome do time é a prova social da galeria —
 * sem ele o card vira uma foto anônima e a seção perde a razão de existir.
 * Todos os uniformes abaixo são de times amadores, escolas e empresas, com
 * escudo próprio: identificá-los é o que dá credibilidade à loja.
 *
 * Vire para `false` e a galeria passa a identificar cada prancha só pela
 * modalidade, sem citar time nenhum (o nome também some das costas da camisa).
 */
export const mostrarNomeDosTimes = true;

/**
 * As gavetas do catálogo, e a ordem em que os filtros aparecem.
 *
 * Existe separada de `contexto` porque as duas coisas parecem iguais e não são:
 * `contexto` é legenda livre ("Enviado para PE", "Veteranos · campo") e serve
 * para o card ter personalidade; `categoria` é gaveta fechada e serve para
 * agrupar. Tentar filtrar por texto livre daria uma gaveta por trabalho.
 *
 * O vocabulário veio do próprio site: `/produtos` já fala em "campo, society e
 * futsal", e escola e empresa saíram dos trabalhos que a loja já tinha feito.
 * Acrescentar uma gaveta é acrescentar uma linha aqui — mas depois disso rode
 * `npm run admin:semear`, senão o painel não oferece a opção nova.
 */
export const categoriasDoCatalogo = [
  { id: 'campo', rotulo: 'Futebol de campo' },
  { id: 'society', rotulo: 'Society' },
  { id: 'futsal', rotulo: 'Futsal' },
  { id: 'escola', rotulo: 'Escolas' },
  { id: 'empresa', rotulo: 'Empresas' },
  { id: 'outros', rotulo: 'Outros' },
] as const;

export type CategoriaCatalogo = (typeof categoriasDoCatalogo)[number]['id'];

/** Gaveta de quem chegou antes das gavetas existirem. */
export const CATEGORIA_PADRAO: CategoriaCatalogo = 'outros';

export function rotuloDaCategoria(id: CategoriaCatalogo): string {
  return categoriasDoCatalogo.find((c) => c.id === id)?.rotulo ?? 'Outros';
}

export type Uniforme = {
  slug: string;
  time: string;
  /** Modalidade, mostrada como legenda discreta no card. Curta: divide a linha com o botão. */
  contexto: string;
  /** Em que filtro do catálogo o trabalho aparece. Ver `categoriasDoCatalogo`. */
  categoria: CategoriaCatalogo;
  /**
   * `costas` opcional: quando existe, o card gira no hover e no botão.
   * Quando a foto já é a prancha inteira (frente e costas lado a lado),
   * mande só `frente` — o card entende e esconde o botão de girar.
   */
  foto?: {
    frente: string;
    costas?: string;
  };
  /** Só para time que ainda não tem foto: a MockupBoard desenha o kit em vetor. */
  vetor?: {
    padrao: PadraoCamisa;
    cores: CoresUniforme;
    numero: string;
    nomeJogador: string;
  };
};

/**
 * Uniformes já produzidos pela loja, com as fotos que o dono enviou.
 *
 * ⚠ NÃO PUBLICAR: das 25 fotos recebidas, quatro reproduzem escudo de clube
 * ou seleção profissional — Portugal/FPF, Argentina/AFA e dois do E.C. Bahia.
 * São marcas registradas de terceiros e ficaram de fora de propósito.
 * Detalhe no README, em "Fotos que não entraram".
 *
 * Para adicionar um time novo o caminho normal é o PAINEL (/admin): ele recorta,
 * converte para WebP e publica sozinho. Mexer aqui só muda com que conteúdo uma
 * instalação nova nasce — não altera o site que já tem `dados/galeria.json`.
 */
export const portfolioSeed: Uniforme[] = [
  {
    slug: 'gremio-cacimbinha',
    time: 'Grêmio Cacimbinha',
    contexto: 'Futebol de campo',
    categoria: 'campo',
    foto: { frente: '/fotos/gremio-cacimbinha.webp' },
  },
  {
    slug: 'santa-isabel',
    time: 'Santa Isabel',
    contexto: 'Futebol de campo',
    categoria: 'campo',
    foto: { frente: '/fotos/santa-isabel.webp' },
  },
  {
    slug: 'ferroviario-carnaiba',
    time: 'Ferroviário Carnaíba',
    contexto: 'Enviado para PE',
    categoria: 'campo',
    foto: {
      frente: '/fotos/ferroviario-frente.webp',
      costas: '/fotos/ferroviario-costas.webp',
    },
  },
  {
    slug: 'amigos-do-gole',
    time: 'Amigos do Gole',
    contexto: 'Com patrocínio',
    categoria: 'campo',
    foto: {
      frente: '/fotos/amigos-do-gole-frente.webp',
      costas: '/fotos/amigos-do-gole-costas.webp',
    },
  },
  {
    slug: 'laranjo-fc',
    time: 'Laranjo FC',
    contexto: 'Veteranos · campo',
    categoria: 'campo',
    foto: { frente: '/fotos/laranjo-fc.webp' },
  },
  {
    slug: 'erem-jms',
    time: 'EREM JMS',
    contexto: 'Escola de ensino médio',
    categoria: 'escola',
    foto: { frente: '/fotos/erem-jms.webp' },
  },
  {
    slug: 'amigos-do-gole-agasalho',
    time: 'Amigos do Gole',
    contexto: 'Agasalho da diretoria',
    categoria: 'campo',
    foto: { frente: '/fotos/agasalho-amigos-do-gole.webp' },
  },
];

/** Uniforme de empresa — vive na seção corporativa de /uniformes. */
export const uniformeCorporativoSeed: Uniforme = {
  slug: 'margirius',
  time: 'Margirius',
  contexto: 'Uniforme de empresa',
  categoria: 'empresa',
  foto: {
    frente: '/fotos/margirius-frente.webp',
    costas: '/fotos/margirius-costas.webp',
  },
};

/** Destaque da página de uniformes. */
export const uniformeDestaqueSeed: Uniforme = {
  slug: 'arruma-nada',
  time: 'Arruma Nada FC',
  contexto: 'Campo · com patrocínio',
  categoria: 'campo',
  foto: { frente: '/fotos/arruma-nada.webp' },
};

/** A prancha que o cliente recebe no WhatsApp, do jeito que a loja envia. */
export type PranchaExemplo = {
  src: string;
  alt: string;
  largura: number;
  altura: number;
};

export const pranchaExemploSeed: PranchaExemplo = {
  src: '/fotos/prancha-exemplo.webp',
  alt: 'Arte digital do uniforme do time Amigos do Gole: frente e costas lado a lado, com escudo, patrocinadores, nome e número, do jeito que a Seven Sport envia no WhatsApp antes de produzir.',
  largura: 1565,
  altura: 1205,
};
