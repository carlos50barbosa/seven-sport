import type { TipoDesenho } from '@/components/ui/DesenhoProduto';

export type Produto = {
  slug: string;
  nome: string;
  descricao: string;
  detalhes: string[];
  /** Qual desenho vetorial representa a categoria. */
  desenho: TipoDesenho;
  /** true = produzido sob medida (vale o pedido mínimo); false = prateleira da loja. */
  personalizado: boolean;
  /** Item de prateleira vendido também por atacado, para quem leva quantidade. */
  atacado?: boolean;
  /** Foto real do produto, quando existe. Sem ela, o card mostra o desenho. */
  foto?: string;
  /** Para onde o card leva quando existe uma página com mais detalhe. */
  href?: string;
};

/**
 * As categorias da loja, na ordem que o dono definiu:
 * o nicho principal é uniforme esportivo, depois artigos de prateleira,
 * e a categoria à parte de uniforme corporativo para empresas.
 *
 * ⚠ PENDENTE: fotos reais de cada categoria. Até lá, cada produto é
 * representado pelo ícone de traço fino sobre a cartela da marca —
 * nunca por imagem genérica de banco de imagens.
 */
export const produtos: Produto[] = [
  {
    slug: 'uniformes-esportivos',
    nome: 'Uniformes esportivos',
    descricao:
      'O carro-chefe da loja: camisa, shorts e meião com o escudo, as cores, o nome e o número de cada jogador do seu time.',
    detalhes: [
      'Kit completo ou peças separadas',
      'Nome e numeração por jogador',
      'Campo, society e futsal',
    ],
    desenho: 'camisa',
    personalizado: true,
    href: '/uniformes',
  },
  {
    slug: 'agasalhos',
    nome: 'Agasalhos esportivos',
    descricao:
      'Jaqueta e calça de agasalho na identidade do time, para o aquecimento, a viagem e o frio da beira do campo.',
    detalhes: [
      'Conjunto completo ou só a jaqueta',
      'Escudo, nome do time e nome do atleta',
      'Tamanhos infantil ao adulto',
    ],
    desenho: 'agasalho',
    personalizado: true,
    href: '/uniformes',
  },
  {
    slug: 'bermudas',
    nome: 'Bermudas de passeio',
    descricao:
      'Bermuda para usar fora de campo, na mesma identidade do uniforme ou no modelo liso.',
    detalhes: ['Cor lisa ou com a identidade do time', 'Sozinha ou junto com o kit', 'Vários tamanhos'],
    desenho: 'bermuda',
    personalizado: true,
    href: '/uniformes',
  },
  {
    slug: 'corporativo',
    nome: 'Uniformes corporativos',
    descricao:
      'Categoria à parte, para empresas: camisa e camiseta com a marca do seu negócio, para a equipe, a loja ou o evento.',
    detalhes: [
      'Logo da empresa aplicado',
      'Nome do funcionário e do setor',
      'Reposição de peças depois',
    ],
    desenho: 'polo',
    personalizado: true,
    href: '/uniformes#corporativo',
  },
  {
    slug: 'bolas',
    nome: 'Bolas de futebol',
    descricao:
      'Bolas de campo, society e futsal para treino e jogo, disponíveis na loja em Taboão da Serra.',
    detalhes: [
      'Campo, society e futsal',
      'Modelos de treino e de jogo',
      'Varejo e atacado',
    ],
    desenho: 'bola',
    foto: '/fotos/bola-society.webp',
    personalizado: false,
    atacado: true,
  },
  {
    slug: 'chuteiras-tenis',
    nome: 'Chuteiras e tênis',
    descricao:
      'Chuteiras de campo, society e futsal, além de tênis esportivo. Vale passar na loja para experimentar a numeração.',
    detalhes: ['Trava, society e futsal', 'Tênis esportivo', 'Varejo e atacado'],
    desenho: 'chuteira',
    personalizado: false,
    atacado: true,
  },
  {
    slug: 'meioes',
    nome: 'Meiões de futebol',
    descricao:
      'Meião liso ou na cor do time, avulso ou fechando o kit. Vendemos no varejo e no atacado.',
    detalhes: ['Cores lisas e combinadas', 'Tamanho infantil e adulto', 'Varejo e atacado'],
    desenho: 'meiao',
    personalizado: false,
    atacado: true,
  },
];
