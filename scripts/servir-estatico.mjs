// Servidor que imita `try_files $uri $uri.html $uri/index.html =404` do Nginx,
// para testar o out/ exatamente como a VPS vai servir.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, sep } from 'node:path';

const RAIZ = resolve(process.argv[2]);
const PORTA = Number(process.argv[3] ?? 3200);

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

async function arquivo(p) {
  try {
    const s = await stat(p);
    return s.isFile() ? p : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const uri = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const base = resolve(join(RAIZ, uri));

  // trava de path traversal: tem que continuar dentro da raiz
  if (base !== RAIZ && !base.startsWith(RAIZ + sep)) {
    res.writeHead(403).end('proibido');
    return;
  }

  const alvo =
    (await arquivo(base)) ??
    (await arquivo(base + '.html')) ??
    (await arquivo(join(base, 'index.html')));

  if (!alvo) {
    const p404 = await arquivo(join(RAIZ, '404.html'));
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    res.end(p404 ? await readFile(p404) : 'nao encontrado');
    return;
  }

  res.writeHead(200, { 'content-type': tipos[extname(alvo)] ?? 'application/octet-stream' });
  res.end(await readFile(alvo));
}).listen(PORTA, () => console.log('servindo ' + RAIZ + ' em http://127.0.0.1:' + PORTA));
