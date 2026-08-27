import type { PadraoCamisa, CoresUniforme } from '@/components/ui/KitSvg';

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

export type Uniforme = {
  slug: string;
  time: string;
  /** Modalidade, mostrada como legenda discreta no card. Curta: divide a linha com o botão. */
  contexto: string;
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
 * Para adicionar um time novo: recorte a foto em `scripts/preparar-imagens.mjs`,
 * rode o script e acrescente uma linha aqui.
 */
export const portfolio: Uniforme[] = [
  {
    slug: 'gremio-cacimbinha',
    time: 'Grêmio Cacimbinha',
    contexto: 'Futebol de campo',
    foto: { frente: '/fotos/gremio-cacimbinha.webp' },
  },
  {
    slug: 'santa-isabel',
    time: 'Santa Isabel',
    contexto: 'Futebol de campo',
    foto: { frente: '/fotos/santa-isabel.webp' },
  },
  {
    slug: 'ferroviario-carnaiba',
    time: 'Ferroviário Carnaíba',
    contexto: 'Enviado para PE',
    foto: {
      frente: '/fotos/ferroviario-frente.webp',
      costas: '/fotos/ferroviario-costas.webp',
    },
  },
  {
    slug: 'amigos-do-gole',
    time: 'Amigos do Gole',
    contexto: 'Com patrocínio',
    foto: {
      frente: '/fotos/amigos-do-gole-frente.webp',
      costas: '/fotos/amigos-do-gole-costas.webp',
    },
  },
  {
    slug: 'laranjo-fc',
    time: 'Laranjo FC',
    contexto: 'Veteranos · campo',
    foto: { frente: '/fotos/laranjo-fc.webp' },
  },
  {
    slug: 'erem-jms',
    time: 'EREM JMS',
    contexto: 'Escola de ensino médio',
    foto: { frente: '/fotos/erem-jms.webp' },
  },
];

/** Uniforme de empresa — vive na seção corporativa de /uniformes. */
export const uniformeCorporativo: Uniforme = {
  slug: 'margirius',
  time: 'Margirius',
  contexto: 'Uniforme de empresa',
  foto: {
    frente: '/fotos/margirius-frente.webp',
    costas: '/fotos/margirius-costas.webp',
  },
};

/** Destaque da página de uniformes. */
export const uniformeDestaque: Uniforme = {
  slug: 'arruma-nada',
  time: 'Arruma Nada FC',
  contexto: 'Campo · com patrocínio',
  foto: { frente: '/fotos/arruma-nada.webp' },
};

/** A prancha que o cliente recebe no WhatsApp, do jeito que a loja envia. */
export const pranchaExemplo = {
  src: '/fotos/prancha-exemplo.webp',
  alt: 'Arte digital do uniforme do time Amigos do Gole: frente e costas lado a lado, com escudo, patrocinadores, nome e número, do jeito que a Seven Sport envia no WhatsApp antes de produzir.',
  largura: 1400,
  altura: 1078,
};
