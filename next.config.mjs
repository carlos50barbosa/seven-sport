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
  basePath,
  reactStrictMode: true,
  // Evita que o Next escolha um lockfile de diretório acima como raiz do workspace.
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
