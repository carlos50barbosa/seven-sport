/**
 * Fonte única de verdade de contato, endereço e redes.
 * Nenhum componente pode ter telefone, endereço ou link de rede social escrito à mão.
 */

export const site = {
  nome: 'Seven Sport',
  nomeCompleto: 'Seven Sport — Artigos Esportivos',
  descricaoCurta:
    'Uniformes esportivos e corporativos personalizados, agasalhos, bermudas, bolas de futebol, chuteiras e tênis em Taboão da Serra/SP.',
  /**
   * Endereço público do site. Vem de NEXT_PUBLIC_SITE_URL (.env.production),
   * lido em tempo de build. Alimenta canonical, sitemap, robots, OG e JSON-LD
   * de uma vez só — trocou a variável, trocou tudo.
   *
   * Hoje: https://servicostech.com.br/seven-sport (subpasta do domínio da agência).
   *
   * ⚠ DOMÍNIO PRÓPRIO AINDA NÃO REGISTRADO. Verificado no Registro.br em
   * 25/08/2026 (API de disponibilidade + RDAP oficial + DNS, com controles):
   *
   *   sevensport.com.br            LIVRE  ← registrar este, é o principal
   *   seevensport.com.br           LIVRE  ← registrar junto, redirecionando
   *   sevensportuniformes.com.br   LIVRE
   *   sevensportoficial.com.br     LIVRE
   *   uniformessevensport.com.br   LIVRE
   *   sevensportesportes.com.br    LIVRE
   *
   * `seevensport` é defesa: o Instagram é @seeven.sport, com dois "e", e quem
   * vier de lá vai digitar assim. Não deve ser o endereço principal — soletrar
   * "s-e-e-v-e-n" por telefone é exatamente o problema a evitar.
   *
   * Quando registrar: em `.env.production`, esvazie NEXT_PUBLIC_BASE_PATH e
   * aponte NEXT_PUBLIC_SITE_URL para o domínio novo.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://servicostech.com.br/seven-sport',

  telefone: {
    /**
     * O número da LOJA. É o que todo botão de orçamento usa, e o único que vai
     * para o JSON-LD, para a imagem de compartilhamento e para o botão
     * flutuante. Alterou aqui, alterou em todos eles.
     */
    e164: '+5511995852948',
    digitos: '5511995852948',
    formatado: '(11) 99585-2948',
  },

  /**
   * Segundo número, a pedido do dono: quem cuida da arte.
   *
   * Aparece só na página de contato e no rodapé, e sempre com rótulo. Dois
   * números soltos lado a lado não informam, perguntam — quem chega no site
   * precisa saber para qual dos dois falar antes de escolher.
   *
   * Nenhum CTA de orçamento aponta para cá, de propósito: "pedir orçamento"
   * continua sendo conversa com a loja, que é quem fecha o pedido.
   */
  telefoneDesigner: {
    e164: '+5511949776443',
    digitos: '5511949776443',
    formatado: '(11) 94977-6443',
  },

  endereco: {
    rua: 'R. José Vaz de Oliveira, 65',
    bairro: 'Parque Pinheiros',
    cidade: 'Taboão da Serra',
    estado: 'SP',
    cep: '06767-190',
    pais: 'BR',
  },

  mapa: {
    // Busca por endereço: não depende de Place ID nem de chave de API.
    rota: 'https://www.google.com/maps/dir/?api=1&destination=R.+Jos%C3%A9+Vaz+de+Oliveira%2C+65+-+Parque+Pinheiros%2C+Tabo%C3%A3o+da+Serra+-+SP%2C+06767-190',
    embed:
      'https://www.google.com/maps?q=R.+Jos%C3%A9+Vaz+de+Oliveira%2C+65+-+Parque+Pinheiros%2C+Tabo%C3%A3o+da+Serra+-+SP%2C+06767-190&output=embed',
  },

  redes: {
    instagram: {
      usuario: '@seeven.sport',
      url: 'https://www.instagram.com/seeven.sport',
    },
    threads: {
      usuario: '@seeven.sport',
      url: 'https://www.threads.net/@seeven.sport',
    },
  },

  /**
   * ⚠ PENDENTE DE CONFIRMAÇÃO COM O CLIENTE antes de publicar.
   * Enquanto `confirmado` for false, o site mostra o aviso "confirme o horário pelo WhatsApp"
   * em vez de anunciar um horário que pode estar errado.
   */
  horarios: {
    confirmado: false,
    lista: [
      { dias: 'Segunda a sexta', horario: '09h às 18h' },
      { dias: 'Sábado', horario: '09h às 14h' },
      { dias: 'Domingo', horario: 'Fechado' },
    ],
  },

  /** Dados cadastrais, confirmados pelo dono. Dígitos do CNPJ conferidos. */
  empresa: {
    razaoSocial: 'Everaldo José do Nascimento - ME',
    cnpj: '16.990.883/0001-64',
  },

  /**
   * Condições comerciais. Mudou aqui, mudou no site inteiro:
   * página de uniformes, cards de produto, processo e validação do formulário.
   *
   * ⚠ CONFIRMAR COM O DONO: o mínimo de 10 vale por produto PERSONALIZADO
   * (camisa, shorts, meião, agasalho, bermuda, corporativo). Bola, chuteira e
   * tênis são de prateleira e não têm mínimo — é assim que o site diz hoje.
   */
  comercial: {
    pedidoMinimo: 10,
    unidade: 'unidades',
  },

  regioesAtendidas: [
    'Taboão da Serra',
    'Embu das Artes',
    'Itapecerica da Serra',
    'Cotia',
    'São Paulo',
  ],

  desenvolvidoPor: {
    nome: 'ServiçosTech',
    url: 'https://servicostech.com.br',
  },
} as const;

/** Mensagens de WhatsApp por contexto. Cada CTA tem a sua. */
export const mensagens = {
  hero: 'Olá, Seven Sport! Vi o site e quero um orçamento de uniforme personalizado para o meu time.',
  flutuante: 'Olá, Seven Sport! Quero falar sobre uniformes personalizados.',
  header: 'Olá, Seven Sport! Quero pedir um orçamento de uniforme.',
  galeria:
    'Olá, Seven Sport! Vi os uniformes no site e quero um parecido para o meu time. Podemos conversar?',
  catalogo:
    'Olá, Seven Sport! Vi o catálogo no site e quero um uniforme parecido para o meu time. Podemos conversar?',
  processo: 'Olá, Seven Sport! Quero começar a arte digital do uniforme do meu time.',
  produtos:
    'Olá, Seven Sport! Quero saber sobre os produtos da loja (bolas, chuteiras e tênis).',
  uniformes: 'Olá, Seven Sport! Quero um orçamento de uniforme completo (camisa, shorts e meião).',
  corporativo:
    'Olá, Seven Sport! Quero um orçamento de uniforme corporativo para a minha empresa.',
  localizacao: 'Olá, Seven Sport! Quero confirmar o horário de atendimento da loja.',
  contato: 'Olá, Seven Sport! Estou entrando em contato pelo site.',
  designer: 'Olá, Seven Sport! Quero falar sobre a arte do uniforme do meu time.',
} as const;

/**
 * Os dois contatos, na ordem em que aparecem — a loja primeiro, que é quem
 * fecha pedido. Mora aqui, e não em cada página, para o rótulo e a ordem não
 * divergirem entre a página de contato e o rodapé.
 */
export const contatos = [
  { rotulo: 'Loja', telefone: site.telefone, mensagem: mensagens.contato },
  { rotulo: 'Designer', telefone: site.telefoneDesigner, mensagem: mensagens.designer },
] as const;
