/**
 * Tecidos e formas de aplicar o escudo.
 *
 * Os termos vieram escritos à mão pelo dono e foram conferidos contra catálogos
 * de malharia e de confecção de uniforme antes de virar texto do site:
 *
 *   "jacar"     → jacquard   (o comércio têxtil usa as duas grafias no mesmo anúncio)
 *   "preium"    → premium    (não é um tecido: é o nome da linha de cima)
 *   "shipa"     → chimpa     (malha chimpa / helanca flanelada)
 *   "patch D3"  → patch 3D
 *
 * A chimpa foi CONFIRMADA pelo dono em 26/08/2026.
 *
 * ⚠ AINDA A CONFIRMAR:
 *   1. Patch 3D x emborrachado — na prática das duas pode ser a mesma coisa na
 *      loja. Se for, junte num item só: melhor três técnicas verdadeiras que
 *      quatro confusas.
 *   2. A loja faz transfer/DTF e silk? São comuns em várzea e não estão na lista.
 *   3. A bermuda usa a mesma chimpa do agasalho ou uma versão mais leve?
 *
 * As descrições são deliberadamente conservadoras: nada de "não encolhe, não
 * desbota, proteção UV, antibacteriano". Promessa absoluta sem laudo do
 * fornecedor é problema com o cliente e com o Procon.
 */

export type Textura = 'liso' | 'stretch' | 'jacquard' | 'texturizado' | 'felpudo';

export type Tecido = {
  slug: string;
  nome: string;
  descricao: string;
  usoPrincipal: string;
  /** Marca a linha de cima da loja. */
  premium?: boolean;
  textura: Textura;
};

export const tecidos: Tecido[] = [
  {
    slug: 'dry-fit',
    nome: 'Malha dry 100% poliéster',
    descricao:
      'Malha leve, que puxa o suor para fora e seca rápido sem grudar no corpo. É a mais usada em camisa de time.',
    usoPrincipal: 'Camisa, shorts e uniforme de treino',
    textura: 'liso',
  },
  {
    slug: 'dry-sport',
    nome: 'Dry sport',
    descricao:
      'A dry da linha de jogo: caimento melhor e mais liberdade de movimento que a dry comum.',
    usoPrincipal: 'Uniforme de jogo, campo e quadra',
    textura: 'stretch',
  },
  {
    slug: 'jacquard',
    nome: 'Jacquard',
    descricao:
      'Malha dry com o desenho em relevo no próprio tecido — não é estampa. É o acabamento de camisa de time profissional.',
    usoPrincipal: 'Camisa da linha premium',
    premium: true,
    textura: 'jacquard',
  },
  {
    slug: 'manchester',
    nome: 'Manchester',
    descricao:
      'Malha dry texturizada, leve e fresca, com acabamento mais bonito que a dry lisa.',
    usoPrincipal: 'Camisa da linha premium',
    premium: true,
    textura: 'texturizado',
  },
  {
    slug: 'chimpa',
    nome: 'Chimpa',
    descricao:
      'Lisinha por fora e felpuda por dentro, quentinha e resistente. É o tecido clássico de agasalho de time.',
    usoPrincipal: 'Agasalhos e bermudas',
    textura: 'felpudo',
  },
];

export type TipoEscudo = 'sublimado' | 'bordado' | 'patch3d' | 'emborrachado';

export type Escudo = {
  slug: TipoEscudo;
  nome: string;
  descricao: string;
  quandoUsar: string;
};

export const escudos: Escudo[] = [
  {
    slug: 'sublimado',
    nome: 'Sublimado',
    descricao:
      'O escudo é impresso junto com o tecido da camisa: fica liso, sem relevo nenhum. Como não é uma camada por cima, não tem o que descascar.',
    quandoUsar: 'Quando o escudo já faz parte do desenho da camisa.',
  },
  {
    slug: 'bordado',
    nome: 'Bordado',
    descricao:
      'O escudo é costurado com linha na camisa, com aquele relevinho de fio que dá cara de clube grande e aguenta lavagem.',
    quandoUsar: 'Quando o time quer o acabamento clássico, de clube.',
  },
  {
    slug: 'patch3d',
    nome: 'Patch 3D',
    descricao:
      'Escudo pronto em alto relevo, aplicado na prensa — e costurado por cima quando o cliente pede.',
    quandoUsar: 'Quando o escudo tem que saltar da camisa.',
  },
  {
    slug: 'emborrachado',
    nome: 'Emborrachado',
    descricao:
      'Escudo em camada de borracha aplicada sobre o tecido, em alto relevo, que segura bem a cor.',
    quandoUsar: 'Quando o uniforme vai pegar uso pesado.',
  },
];
