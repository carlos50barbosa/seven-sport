import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

/**
 * ⚠ Rodando em subpasta, este arquivo é gerado em
 * https://servicostech.com.br/seven-sport/robots.txt — e robô nenhum lê ali.
 * Crawler só busca robots.txt na RAIZ do domínio.
 *
 * Ou seja: enquanto o site viver na subpasta, quem manda é o robots.txt de
 * servicostech.com.br. A linha do Sitemap precisa ser acrescentada lá
 * (instruções no README, em "Deploy em subpasta").
 *
 * Este arquivo continua aqui porque passa a valer sozinho no dia em que o
 * domínio próprio entrar — aí ele nasce na raiz e já sai correto.
 */
export default function robots(): MetadataRoute.Robots {
  const base = new URL(site.url);
  const emSubpasta = base.pathname !== '/';

  return {
    // Em subpasta, libera só o que é nosso: o resto do domínio não é assunto deste site.
    rules: { userAgent: '*', allow: emSubpasta ? `${base.pathname}/` : '/' },
    sitemap: `${site.url}/sitemap.xml`,
    // `host` é domínio, nunca caminho — com o path junto o diretivo fica inválido.
    host: base.origin,
  };
}
