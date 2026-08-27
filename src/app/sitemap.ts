import type { MetadataRoute } from 'next';
import { site } from '@/data/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = [
    { caminho: '', prioridade: 1 },
    { caminho: '/uniformes', prioridade: 0.9 },
    { caminho: '/produtos', prioridade: 0.8 },
    { caminho: '/contato', prioridade: 0.7 },
  ];

  return rotas.map(({ caminho, prioridade }) => ({
    url: `${site.url}${caminho}`,
    changeFrequency: 'monthly' as const,
    priority: prioridade,
  }));
}
