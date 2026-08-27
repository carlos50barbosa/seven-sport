import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

/** Necessário com `output: 'export'`: gera o arquivo em build, não em runtime. */
export const dynamic = 'force-static';

/**
 * Gerado na raiz do domínio, que é onde crawler procura. Quando o site morava
 * numa subpasta este arquivo era ignorado — o robots que valia era o do
 * domínio hospedeiro. Não é mais o caso.
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
