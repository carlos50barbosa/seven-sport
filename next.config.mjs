/**
 * O site roda numa SUBPASTA (https://servicostech.com.br/seven-sport).
 * `basePath` faz o Next prefixar sozinho as rotas do <Link>, os assets de
 * /_next e o src do next/image.
 *
 * Quando o domínio próprio entrar, basta esvaziar NEXT_PUBLIC_BASE_PATH e
 * apontar NEXT_PUBLIC_SITE_URL para ele — nenhum componente muda.
 * As duas variáveis são lidas em tempo de BUILD (.env.production).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Export estático: `next build` gera a pasta `out/` com HTML pronto.
   * Sem Node em produção, sem PM2, sem porta — o Nginx serve arquivo.
   *
   * O site é 100% estático (nenhuma API route, nenhum server action), então
   * não se perde nada de funcionalidade. O que se perde é a otimização de
   * imagem do next/image; por isso as fotos já saem no tamanho certo do
   * `scripts/preparar-imagens.mjs`, e não em resolução de câmera.
   */
  output: 'export',
  basePath,
  reactStrictMode: true,
  // Evita que o Next escolha um lockfile de diretório acima como raiz do workspace.
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  images: {
    // Obrigatório com output: 'export' — não há servidor para otimizar em runtime.
    unoptimized: true,
  },
};

export default nextConfig;
