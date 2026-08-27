/**
 * Prepara os assets do cliente para o site.
 *
 * Entrada : as fotos originais que o dono enviou
 * Saída   : public/fotos/*.webp e public/logo-seven-sport.png
 *
 * Rodar:  node scripts/preparar-imagens.mjs "C:/Users/josec/Downloads/Seven"
 *
 * As caixas de corte foram medidas olhando cada foto: tiram o fundo da loja,
 * o banner e a moldura que a própria prancha já traz (a MockupBoard desenha
 * a dela). Se o cliente mandar fotos novas, ajuste aqui e rode de novo.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ORIGEM = process.argv[2] ?? 'C:/Users/josec/Downloads/Seven';
const DESTINO_UNIFORMES = 'public/fotos';
const LARGURA_CARD = 900;

/** [esquerda, topo, largura, altura] no tamanho original da foto. */
const recortes = [
  // ---- pranchas de mockup: corta a moldura e o nome da base, a MockupBoard repõe
  { origem: '23.jpeg', saida: 'gremio-cacimbinha.webp', corte: [110, 350, 1060, 1120] },
  { origem: '22.jpeg', saida: 'santa-isabel.webp', corte: [85, 340, 870, 830] },
  { origem: '20.jpeg', saida: 'laranjo-fc.webp', corte: [100, 500, 1080, 1000] },
  { origem: '7.jpeg', saida: 'erem-jms.webp', corte: [85, 360, 880, 820] },

  // ---- fotos reais na loja: par frente/costas para o giro da prancha
  { origem: '8.jpeg', saida: 'ferroviario-frente.webp', corte: [160, 285, 840, 1265] },
  { origem: '9.jpeg', saida: 'ferroviario-costas.webp', corte: [95, 235, 820, 1245] },
  { origem: '13.jpeg', saida: 'amigos-do-gole-frente.webp', corte: [195, 125, 510, 1115] },
  { origem: '12.jpeg', saida: 'amigos-do-gole-costas.webp', corte: [115, 65, 780, 1175] },
  { origem: '17.jpeg', saida: 'margirius-frente.webp', corte: [85, 220, 1010, 1380] },
  { origem: '16.jpeg', saida: 'margirius-costas.webp', corte: [115, 25, 1015, 1575] },
  { origem: '15.jpeg', saida: 'arruma-nada.webp', corte: [175, 240, 860, 1320] },

  // ---- prancha completa, com os selos: é o que o cliente recebe no WhatsApp
  { origem: '14.jpeg', saida: 'prancha-exemplo.webp', corte: null, largura: 1400 },

  // ---- produtos de prateleira
  { origem: '6.jpeg', saida: 'bola-society.webp', corte: null, largura: 800 },
  { origem: '1.jpeg', saida: 'bola-campo.webp', corte: [0, 250, 1280, 900], largura: 900 },
];

async function preparar() {
  await mkdir(DESTINO_UNIFORMES, { recursive: true });
  const relatorio = [];

  for (const item of recortes) {
    const entrada = join(ORIGEM, item.origem);
    let img = sharp(entrada);
    const meta = await img.metadata();

    if (item.corte) {
      const [left, top, width, height] = item.corte;
      // trava o recorte dentro da imagem, para não estourar em foto de tamanho diferente
      img = img.extract({
        left: Math.max(0, Math.min(left, meta.width - 1)),
        top: Math.max(0, Math.min(top, meta.height - 1)),
        width: Math.min(width, meta.width - left),
        height: Math.min(height, meta.height - top),
      });
    }

    const destino = join(DESTINO_UNIFORMES, item.saida);
    const info = await img
      .resize({ width: item.largura ?? LARGURA_CARD, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destino);

    relatorio.push(
      `${item.origem.padEnd(10)} -> ${item.saida.padEnd(28)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
    );
  }

  console.log(relatorio.join('\n'));
}

/**
 * Logo: o original vem sobre fundo branco chapado. Um flood fill a partir das
 * bordas apaga só o branco de fora — o branco de dentro do desenho (contorno
 * das letras) fica intacto, que é o que um threshold simples estragaria.
 */
async function prepararLogo() {
  const entrada = join(ORIGEM, '25.jpeg');
  const { data, info } = await sharp(entrada)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visitado = new Uint8Array(width * height);
  const fila = [];
  const eBranco = (i) => data[i * channels] > 235 && data[i * channels + 1] > 235 && data[i * channels + 2] > 235;

  for (let x = 0; x < width; x++) {
    fila.push(x, (height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    fila.push(y * width, y * width + width - 1);
  }

  while (fila.length) {
    const p = fila.pop();
    if (visitado[p] || !eBranco(p)) continue;
    visitado[p] = 1;
    data[p * channels + 3] = 0;

    const x = p % width;
    const y = (p / width) | 0;
    if (x > 0) fila.push(p - 1);
    if (x < width - 1) fila.push(p + 1);
    if (y > 0) fila.push(p - width);
    if (y < height - 1) fila.push(p + width);
  }

  const png = await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    // 520px cobre o header (36-48px de altura) até em tela 3x, e mantém o PNG leve
    .resize({ width: 520 })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer();

  // Três recortes do mesmo original:
  //  - completo : marca + SEVEN SPORT + ARTIGOS ESPORTIVOS, sem o telefone
  //               (o rodapé já mostra) — para rodapé e onde houver altura
  //  - marca    : só o "S", para o header
  //  - texto    : só o letreiro, para ficar ao lado da marca no header
  // O logo original é empilhado e o header é uma barra horizontal; separar as
  // duas partes é o que mantém o letreiro legível em 36px de altura.
  const meta = await sharp(png).metadata();

  const cortes = [
    { arquivo: 'logo-seven-sport.png', top: 0, altura: 430 },
    { arquivo: 'logo-marca.png', top: 0, altura: 222 },
    { arquivo: 'logo-texto.png', top: 236, altura: 157 },
  ];

  const linhas = [];
  for (const corte of cortes) {
    const buf = await sharp(png)
      .extract({ left: 0, top: corte.top, width: meta.width, height: corte.altura })
      .trim({ threshold: 1 })
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toBuffer();
    await writeFile(`public/${corte.arquivo}`, buf);
    const m = await sharp(buf).metadata();
    linhas.push(
      `25.jpeg    -> ${corte.arquivo.padEnd(24)} ${m.width}x${m.height}  ${(buf.length / 1024).toFixed(0)} KB`,
    );
  }
  console.log('\n' + linhas.join('\n') + '\n(fundo transparente, telefone removido)');
}

await preparar();
await prepararLogo();
