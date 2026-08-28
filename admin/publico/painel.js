/**
 * Painel do admin — JavaScript de navegador, sem framework e sem build.
 *
 * São três telas e um formulário; React aqui exigiria uma segunda esteira de
 * build só para o painel, e o site inteiro depende de a esteira do Next ficar
 * simples. O DOM é montado com um helper de 8 linhas (`h`), nunca com innerHTML.
 *
 * Como o estado funciona: `dados.manifesto` é a verdade em memória. Digitar num
 * campo altera o objeto SEM redesenhar (redesenhar roubaria o foco no meio da
 * palavra); só mudança de estrutura — trocar foto, mover, remover — redesenha.
 */

const base = location.pathname.replace(/\/+$/, '');

const $ = (id) => document.getElementById(id);

/** Monta elemento. Texto entra como nó de texto, nunca como HTML. */
function h(tag, props = {}, ...filhos) {
  const no = document.createElement(tag);
  for (const [chave, valor] of Object.entries(props)) {
    if (valor === undefined || valor === false || valor === null) continue;
    if (chave.startsWith('on')) no.addEventListener(chave.slice(2), valor);
    else if (chave === 'class') no.className = valor;
    else if (chave in no) no[chave] = valor;
    else no.setAttribute(chave, valor);
  }
  for (const filho of filhos.flat()) {
    if (filho == null || filho === false) continue;
    no.append(filho instanceof Node ? filho : document.createTextNode(String(filho)));
  }
  return no;
}

// ─────────────────────────────────────────────────────────────────────── rede

class ErroDeSessao extends Error {}

async function api(rota, opcoes = {}) {
  const resposta = await fetch(base + rota, { credentials: 'same-origin', ...opcoes });
  if (resposta.status === 401) throw new ErroDeSessao('Sessão expirada.');

  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    const detalhe = corpo.erros?.length ? `\n· ${corpo.erros.join('\n· ')}` : '';
    throw new Error((corpo.erro ?? `Falha ${resposta.status}`) + detalhe);
  }
  return corpo;
}

let sumirAviso;
function avisar(mensagem, ruim = false) {
  const caixa = $('aviso');
  caixa.textContent = mensagem;
  caixa.className = ruim ? 'aviso ruim' : 'aviso';
  caixa.hidden = false;
  clearTimeout(sumirAviso);
  // Erro fica mais tempo na tela: costuma vir com uma lista para ler.
  sumirAviso = setTimeout(() => (caixa.hidden = true), ruim ? 9000 : 3500);
}

// ────────────────────────────────────────────────────────────────────── estado

let dados = null;
let sujo = false;

function marcarSujo() {
  sujo = true;
  $('btn-salvar').disabled = false;
  pintarEstado();
}

function pintarEstado() {
  const etiqueta = $('estado');
  if (sujo) {
    etiqueta.textContent = 'alterações não salvas';
    etiqueta.className = 'etiqueta pendente';
  } else if (dados?.pendente) {
    etiqueta.textContent = 'salvo — falta publicar';
    etiqueta.className = 'etiqueta pendente';
  } else {
    etiqueta.textContent = 'tudo publicado';
    etiqueta.className = 'etiqueta limpo';
  }
}

// O navegador só mostra o alerta se houve interação na página — e houve, se está sujo.
addEventListener('beforeunload', (evento) => {
  if (sujo) evento.preventDefault();
});

function apelidar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

/**
 * Dá identificador a quem entrou agora, sem mexer em quem já tinha.
 *
 * O slug é chave de lista e prefixo de id no SVG do site: trocar o de um time
 * antigo só porque o nome foi corrigido não traria ganho nenhum e mudaria HTML
 * publicado à toa. Por isso só os vazios ganham valor aqui.
 */
function garantirSlugs() {
  const usados = new Set(dados.manifesto.portfolio.map((u) => u.slug).filter(Boolean));
  for (const uniforme of dados.manifesto.portfolio) {
    if (uniforme.slug) continue;
    const raiz = apelidar(uniforme.time) || 'time';
    let candidato = raiz;
    let n = 2;
    while (usados.has(candidato)) candidato = `${raiz}-${n++}`;
    usados.add(candidato);
    uniforme.slug = candidato;
  }
}

/**
 * Tira do manifesto o quadro de costas que ficou aberto sem foto.
 *
 * `costas: ''` é estado de TELA — o quadro esperando um arquivo. Gravado, viraria
 * um campo vazio no JSON que o site teria de saber ignorar. Some antes de sair daqui.
 */
function descartarQuadrosVazios() {
  const m = dados.manifesto;
  for (const u of [...m.portfolio, m.uniformeDestaque, m.uniformeCorporativo]) {
    if (u.foto && !u.foto.costas) delete u.foto.costas;
  }
}

// ────────────────────────────────────────────────────────────────────── upload

const urlDaImagem = (caminho) => `${base}/api/imagem?caminho=${encodeURIComponent(caminho)}`;

async function enviarFoto(arquivo, destino, rotulo) {
  const busca = new URLSearchParams({ destino, rotulo: rotulo || '' });
  return api(`/api/foto?${busca}`, {
    method: 'POST',
    // Corpo cru: o File vai como está, sem multipart. O servidor lê os bytes direto.
    headers: { 'content-type': arquivo.type || 'application/octet-stream' },
    body: arquivo,
  });
}

/**
 * Quadro de foto: clicar abre o seletor, arrastar e soltar também vale.
 *
 * `aoTrocar` recebe a resposta inteira do servidor (caminho, largura, altura) —
 * a prancha de exemplo precisa das dimensões, os outros usam só o caminho.
 */
function quadroDeFoto({ caminho, texto, destino, rotulo, aoTrocar }) {
  const entrada = h('input', {
    type: 'file',
    accept: 'image/*',
    hidden: true,
    onchange: () => entrada.files[0] && receber(entrada.files[0]),
  });

  const quadro = h(
    'button',
    {
      type: 'button',
      class: 'solta',
      title: caminho ? `Trocar: ${caminho}` : 'Escolher foto',
      onclick: () => entrada.click(),
      ondragover: (e) => {
        e.preventDefault();
        quadro.classList.add('sobre');
      },
      ondragleave: () => quadro.classList.remove('sobre'),
      ondrop: (e) => {
        e.preventDefault();
        quadro.classList.remove('sobre');
        const arquivo = e.dataTransfer.files[0];
        if (arquivo) receber(arquivo);
      },
    },
    caminho ? h('img', { src: urlDaImagem(caminho), alt: '', loading: 'lazy' }) : 'escolher foto',
    h('span', { class: 'rotulo-foto' }, texto),
  );

  async function receber(arquivo) {
    quadro.classList.add('enviando');
    try {
      aoTrocar(await enviarFoto(arquivo, destino, rotulo));
      avisar('Foto enviada.');
    } catch (erro) {
      tratar(erro);
      quadro.classList.remove('enviando');
    }
  }

  // O input fica IRMÃO do button, não dentro dele: lá dentro, o `entrada.click()`
  // do onclick borbulharia de volta para o próprio button e o chamaria outra vez.
  // A especificação trava essa reentrada, mas depender disso é frágil — e input
  // dentro de button é HTML inválido de todo jeito.
  return h('span', { class: 'quadro' }, quadro, entrada);
}

function campoDeTexto(rotulo, valor, aoDigitar, opcoes = {}) {
  const entrada = opcoes.area
    ? h('textarea', { value: valor ?? '', oninput: (e) => aoDigitar(e.target.value) })
    : h('input', {
        type: 'text',
        value: valor ?? '',
        placeholder: opcoes.exemplo ?? '',
        oninput: (e) => aoDigitar(e.target.value),
      });
  entrada.addEventListener('input', marcarSujo);
  return h('div', { class: 'campo' }, h('label', {}, rotulo), entrada);
}

/** Seletor de gaveta do catálogo. Sem gavetas carregadas, some da tela. */
function campoDeSelecao(rotulo, valor, aoMudar) {
  const gavetas = dados.categorias ?? [];
  if (!gavetas.length) return null;

  const selecao = h(
    'select',
    {
      onchange: (e) => {
        aoMudar(e.target.value);
        marcarSujo();
        // Redesenha porque o filtro por categoria lá em cima pode deixar de casar.
        desenhar();
      },
    },
    gavetas.map((g) => h('option', { value: g.id, selected: g.id === valor }, g.rotulo)),
  );
  return h('div', { class: 'campo' }, h('label', {}, rotulo), selecao);
}

// ─────────────────────────────────────────────────────────────────── desenhar

function fichaDeUniforme(uniforme, opcoes = {}) {
  const { destino = 'galeria', acoes = [] } = opcoes;
  const rotulo = uniforme.time;

  // A CHAVE existir é o que decide mostrar o segundo quadro; o VALOR só diz se
  // já tem foto nele. São coisas diferentes: "+ Foto das costas" abre um quadro
  // vazio (chave presente, valor ''), e ele precisa aparecer na tela para poder
  // receber o clique.
  const temQuadroDeCostas = Boolean(uniforme.foto && 'costas' in uniforme.foto);

  const trocarLado = (lado) => (resposta) => {
    uniforme.foto = { ...uniforme.foto, [lado]: resposta.caminho };
    marcarSujo();
    desenhar();
  };

  const fotos = [
    quadroDeFoto({
      caminho: uniforme.foto?.frente,
      texto: 'frente',
      destino,
      rotulo,
      aoTrocar: trocarLado('frente'),
    }),
  ];

  if (temQuadroDeCostas) {
    fotos.push(
      quadroDeFoto({
        caminho: uniforme.foto.costas,
        texto: 'costas',
        destino,
        rotulo,
        aoTrocar: trocarLado('costas'),
      }),
    );
  }

  return h(
    'article',
    { class: 'ficha' },
    h('div', { class: 'fotos' }, fotos),
    h(
      'div',
      {},
      h(
        'div',
        { class: 'campos triplo' },
        campoDeTexto('Nome do time', uniforme.time, (v) => (uniforme.time = v), {
          exemplo: 'Grêmio Cacimbinha',
        }),
        campoDeTexto('Modalidade', uniforme.contexto, (v) => (uniforme.contexto = v), {
          exemplo: 'Futebol de campo',
        }),
        campoDeSelecao('Filtro do catálogo', uniforme.categoria ?? 'outros', (v) => {
          uniforme.categoria = v;
        }),
      ),
      h(
        'p',
        { class: 'ajuda' },
        uniforme.foto?.costas
          ? 'Com as duas fotos, a prancha gira no site para mostrar as costas.'
          : 'Só a frente: a prancha não gira. Acrescente as costas se a foto for de um lado só.',
      ),
      h(
        'div',
        { class: 'acoes-ficha' },
        temQuadroDeCostas
          ? h(
              'button',
              {
                type: 'button',
                class: 'botao miudo',
                onclick: () => {
                  delete uniforme.foto.costas;
                  marcarSujo();
                  desenhar();
                },
              },
              uniforme.foto.costas ? 'Tirar a foto das costas' : 'Cancelar',
            )
          : h(
              'button',
              {
                type: 'button',
                class: 'botao miudo',
                onclick: () => {
                  // Só abre o quadro vazio. Tentar já disparar o seletor daqui não
                  // funciona: o desenhar() abaixo troca o DOM, e o nó que abriria o
                  // diálogo sai da página antes do clique chegar nele.
                  uniforme.foto = { ...uniforme.foto, costas: '' };
                  marcarSujo();
                  desenhar();
                },
              },
              '+ Foto das costas',
            ),
        acoes,
      ),
    ),
  );
}

/**
 * Texto da busca da aba Galeria.
 *
 * Mora fora da função porque `desenhar()` recria a lista inteira a cada
 * alteração; guardado dentro, o que foi digitado sumiria ao trocar uma foto.
 */
let buscaNaGaleria = '';

/** Casa por nome do time ou pelo rótulo da gaveta — quem busca "escola" pensa no filtro. */
function combinaComABusca(uniforme) {
  const alvo = buscaNaGaleria.trim().toLowerCase();
  if (!alvo) return true;
  const gaveta = (dados.categorias ?? []).find((g) => g.id === uniforme.categoria);
  return `${uniforme.time} ${uniforme.contexto} ${gaveta?.rotulo ?? ''}`.toLowerCase().includes(alvo);
}

function desenharGaleria() {
  const lista = $('lista-galeria');
  lista.replaceChildren();

  const times = dados.manifesto.portfolio;
  const fichas = [];

  times.forEach((uniforme, i) => {
    const mover = (delta) => {
      const [item] = times.splice(i, 1);
      times.splice(i + delta, 0, item);
      marcarSujo();
      desenhar();
    };

    // O índice usado aqui é o do manifesto, não o da tela. Por isso a busca
    // ESCONDE cards em vez de montar uma lista filtrada: com lista filtrada, o
    // "i" de mover e remover apontaria para outro time.
    const noTopo = i === 0;
    const noFim = i === times.length - 1;

    const acoes = [
      h(
        'button',
        {
          type: 'button',
          class: 'botao miudo',
          'data-mover': '1',
          'data-limite': noTopo ? '1' : '',
          disabled: noTopo,
          onclick: () => mover(-1),
          title: 'Subir',
        },
        '↑',
      ),
      h(
        'button',
        {
          type: 'button',
          class: 'botao miudo',
          'data-mover': '1',
          'data-limite': noFim ? '1' : '',
          disabled: noFim,
          onclick: () => mover(1),
          title: 'Descer',
        },
        '↓',
      ),
      h(
        'button',
        {
          type: 'button',
          class: 'botao miudo perigo espaco',
          // A galeria não pode ficar vazia — o site quebraria o build na validação.
          disabled: times.length === 1,
          onclick: () => {
            if (!confirm(`Tirar "${uniforme.time || 'este time'}" do site?`)) return;
            times.splice(i, 1);
            marcarSujo();
            desenhar();
          },
        },
        'Remover',
      ),
    ];

    const ficha = fichaDeUniforme(uniforme, { acoes });
    fichas.push({ ficha, uniforme });
    lista.append(ficha);
  });

  const contagem = h('p', { class: 'ajuda' });

  /**
   * Aplica a busca sem redesenhar.
   *
   * Redesenhar a cada tecla tiraria o foco do campo no meio da palavra — o mesmo
   * motivo pelo qual os campos de texto das fichas não redesenham. Aqui a lista
   * já está montada; a busca só decide quem fica visível.
   */
  function aplicarBusca() {
    const buscando = buscaNaGaleria.trim() !== '';
    let vistos = 0;

    for (const { ficha, uniforme } of fichas) {
      const casa = combinaComABusca(uniforme);
      ficha.hidden = !casa;
      if (casa) vistos += 1;
    }

    // Reordenar vendo só parte da lista move o time para uma posição que não é a
    // que está na tela. Enquanto a busca estiver ativa, as setas ficam travadas.
    for (const botao of lista.querySelectorAll('[data-mover]')) {
      botao.disabled = buscando || botao.getAttribute('data-limite') === '1';
    }

    contagem.textContent = buscando
      ? `${vistos} de ${times.length} — a ordem só pode ser mudada sem busca`
      : `${times.length} ${times.length === 1 ? 'trabalho' : 'trabalhos'} no catálogo`;
  }

  const busca = h('input', {
    type: 'search',
    value: buscaNaGaleria,
    placeholder: 'Buscar por time, modalidade ou filtro…',
    'aria-label': 'Buscar na galeria',
    oninput: (e) => {
      buscaNaGaleria = e.target.value;
      aplicarBusca();
    },
  });

  lista.prepend(
    h(
      'div',
      { class: 'barra-busca' },
      busca,
      contagem,
      times[0] &&
        h(
          'p',
          { class: 'ajuda' },
          `O primeiro da lista — hoje ${times[0].time || 'sem nome'} — é o que aparece grande no topo da home e no rodapé.`,
        ),
    ),
  );

  aplicarBusca();
}

function desenharDestaques() {
  const lista = $('lista-destaques');
  lista.replaceChildren();
  const m = dados.manifesto;

  const bloco = (titulo, explicacao, ficha) =>
    h('section', {}, h('h3', {}, titulo), h('p', { class: 'ajuda' }, explicacao), ficha);

  lista.append(
    bloco(
      'Topo de /uniformes',
      'A prancha grande ao lado do texto de abertura da página de uniformes.',
      fichaDeUniforme(m.uniformeDestaque),
    ),
    bloco(
      'Uniforme corporativo',
      'A prancha da seção de empresas, em /uniformes#corporativo.',
      fichaDeUniforme(m.uniformeCorporativo),
    ),
  );

  const prancha = m.pranchaExemplo;
  lista.append(
    bloco(
      'Arte de exemplo',
      'A imagem da seção “Como funciona”, que mostra a arte que o cliente recebe no WhatsApp.',
      h(
        'article',
        { class: 'ficha' },
        h(
          'div',
          { class: 'fotos' },
          quadroDeFoto({
            caminho: prancha.src,
            texto: 'arte',
            destino: 'prancha',
            rotulo: 'prancha-exemplo',
            aoTrocar: (r) => {
              // Largura e altura vão para o next/image: sem elas a página pula ao carregar.
              Object.assign(prancha, { src: r.caminho, largura: r.largura, altura: r.altura });
              marcarSujo();
              desenhar();
            },
          }),
        ),
        h(
          'div',
          {},
          h(
            'div',
            { class: 'campos' },
            campoDeTexto(
              'Descrição da imagem (alt)',
              prancha.alt,
              (v) => (prancha.alt = v),
              { area: true },
            ),
          ),
          h(
            'p',
            { class: 'ajuda' },
            'Esta é a única imagem que pede descrição escrita: as outras o site descreve sozinho, ' +
              'pelo nome do time. Conte o que se vê — quem usa leitor de tela depende disso, e o Google lê também.',
          ),
        ),
      ),
    ),
  );
}

function desenharProdutos() {
  const lista = $('lista-produtos');
  lista.replaceChildren();
  const fotos = dados.manifesto.produtos;

  for (const produto of dados.catalogo) {
    const caminho = fotos[produto.slug];

    lista.append(
      h(
        'article',
        { class: 'ficha' },
        h(
          'div',
          { class: 'fotos' },
          quadroDeFoto({
            caminho,
            texto: 'foto',
            destino: 'produto',
            rotulo: produto.slug,
            aoTrocar: (r) => {
              fotos[produto.slug] = r.caminho;
              marcarSujo();
              desenhar();
            },
          }),
        ),
        h(
          'div',
          {},
          h('h3', {}, produto.nome),
          h(
            'p',
            { class: 'ajuda' },
            caminho ? 'Mostrando a foto.' : 'Sem foto — o site desenha a peça em vetor.',
          ),
          h(
            'div',
            { class: 'acoes-ficha' },
            caminho &&
              h(
                'button',
                {
                  type: 'button',
                  class: 'botao miudo perigo',
                  onclick: () => {
                    delete fotos[produto.slug];
                    marcarSujo();
                    desenhar();
                  },
                },
                'Voltar ao desenho',
              ),
          ),
        ),
      ),
    );
  }
}

function desenhar() {
  const aba = document.querySelector('.aba.ativa').dataset.painel;
  if (aba === 'galeria') desenharGaleria();
  if (aba === 'destaques') desenharDestaques();
  if (aba === 'produtos') desenharProdutos();
  pintarEstado();
}

// ──────────────────────────────────────────────────────────────────── ações

function tratar(erro) {
  if (erro instanceof ErroDeSessao) {
    $('tela-painel').hidden = true;
    $('tela-login').hidden = false;
    avisar('Sua sessão expirou. Entre de novo.', true);
    return;
  }
  avisar(erro.message, true);
}

async function carregar() {
  dados = await api('/api/conteudo');

  /**
   * O manifesto escrito antes do catálogo existir não tem categoria. Preencher
   * aqui faz o primeiro Salvar migrar tudo de uma vez — sem script de migração,
   * e sem o admin precisar saber que houve uma.
   */
  const gavetas = dados.categorias ?? [];
  const padrao = gavetas.find((g) => g.id === 'outros')?.id ?? gavetas[0]?.id ?? 'outros';
  const m = dados.manifesto;
  for (const u of [...m.portfolio, m.uniformeDestaque, m.uniformeCorporativo]) {
    if (u && !gavetas.some((g) => g.id === u.categoria)) u.categoria = padrao;
  }
  sujo = false;
  $('btn-salvar').disabled = true;
  desenhar();
}

async function salvar() {
  garantirSlugs();
  descartarQuadrosVazios();
  $('btn-salvar').disabled = true;
  try {
    const resposta = await api('/api/conteudo', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(dados.manifesto),
    });
    dados.manifesto = resposta.manifesto;
    dados.pendente = true;
    sujo = false;
    desenhar();
    avisar(
      resposta.apagadas
        ? `Salvo. ${resposta.apagadas} foto(s) sem uso foram apagadas.`
        : 'Salvo. Agora clique em “Publicar no site”.',
    );
  } catch (erro) {
    $('btn-salvar').disabled = false;
    tratar(erro);
  }
}

async function acompanharPublicacao() {
  const log = $('log-publicar');

  while (true) {
    const estado = await api('/api/publicar');
    log.textContent = estado.log.join('\n');
    log.scrollTop = log.scrollHeight;

    if (estado.estado !== 'publicando') {
      const deuCerto = estado.estado === 'ok';
      $('titulo-publicar').textContent = deuCerto ? 'Publicado' : 'A publicação falhou';
      $('resumo-publicar').textContent = deuCerto
        ? 'O site já está no ar com o conteúdo novo. Recarregue a página do site para conferir.'
        : 'Nada mudou no ar: o site continua exibindo a versão anterior. O log abaixo diz o motivo.';
      if (deuCerto) {
        dados.pendente = false;
        pintarEstado();
      }
      $('btn-publicar').disabled = false;
      return;
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
}

async function publicar() {
  if (sujo && !confirm('Você tem alterações não salvas. Publicar assim mesmo, sem elas?')) return;

  const dialogo = $('dialogo-publicar');
  $('titulo-publicar').textContent = 'Publicando…';
  $('resumo-publicar').textContent =
    'Levando o conteúdo para o ar. Costuma levar cerca de um minuto — pode fechar esta janela, ' +
    'que a publicação continua sozinha.';
  $('log-publicar').textContent = '';
  dialogo.showModal();
  $('btn-publicar').disabled = true;

  try {
    await api('/api/publicar', { method: 'POST' });
    await acompanharPublicacao();
  } catch (erro) {
    $('btn-publicar').disabled = false;
    tratar(erro);
  }
}

// ─────────────────────────────────────────────────────────────────── ligações

$('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const erro = $('erro-login');
  erro.hidden = true;
  try {
    await api('/api/entrar', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ usuario: $('usuario').value, senha: $('senha').value }),
    });
    $('senha').value = '';
    $('tela-login').hidden = true;
    $('tela-painel').hidden = false;
    await carregar();
  } catch (falha) {
    erro.textContent = falha.message;
    erro.hidden = false;
  }
});

for (const aba of document.querySelectorAll('.aba')) {
  aba.addEventListener('click', () => {
    for (const outra of document.querySelectorAll('.aba')) outra.classList.remove('ativa');
    aba.classList.add('ativa');
    for (const painel of document.querySelectorAll('.painel')) {
      painel.hidden = painel.id !== `painel-${aba.dataset.painel}`;
    }
    desenhar();
  });
}

$('btn-salvar').addEventListener('click', salvar);
$('btn-publicar').addEventListener('click', publicar);
$('btn-fechar-publicar').addEventListener('click', () => $('dialogo-publicar').close());

$('btn-sair').addEventListener('click', async () => {
  if (sujo && !confirm('Há alterações não salvas. Sair e perder tudo?')) return;
  await api('/api/sair', { method: 'POST' }).catch(() => {});
  location.reload();
});

// "Novo time" já abre o seletor: um card vazio na tela não passaria na validação
// (todo time precisa de foto de frente), e o admin ficaria preso sem entender.
$('btn-novo-time').addEventListener('click', () => {
  const entrada = h('input', { type: 'file', accept: 'image/*', hidden: true });
  entrada.addEventListener('change', async () => {
    const arquivo = entrada.files[0];
    if (!arquivo) return;
    try {
      const resposta = await enviarFoto(arquivo, 'galeria', 'time');
      dados.manifesto.portfolio.push({
        slug: '',
        time: '',
        contexto: '',
        foto: { frente: resposta.caminho },
      });
      marcarSujo();
      desenhar();
      // O card novo é o último; leva o foco direto para o nome do time.
      const fichas = $('lista-galeria').querySelectorAll('.ficha');
      fichas[fichas.length - 1]?.querySelector('input[type="text"]')?.focus();
    } catch (erro) {
      tratar(erro);
    }
  });
  document.body.append(entrada);
  entrada.click();
  entrada.remove();
});

// Sessão de ontem ainda válida: entra direto, sem pedir senha de novo.
try {
  await carregar();
  $('tela-login').hidden = true;
  $('tela-painel').hidden = false;
} catch {
  $('usuario').focus();
}
