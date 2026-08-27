import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variante = 'primario' | 'secundario' | 'verde' | 'claro' | 'fantasma';
type Tamanho = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2.5 rounded-sm font-semibold uppercase tracking-[0.06em] transition-all duration-200 ease-prancha';

const tamanhos: Record<Tamanho, string> = {
  md: 'px-6 py-3.5 text-[0.875rem]',
  lg: 'px-7 py-4 text-[0.9375rem]',
};

const variantes: Record<Variante, string> = {
  primario:
    'bg-vermelho text-white shadow-[0_14px_30px_-16px_rgba(225,37,27,.95)] hover:-translate-y-0.5 hover:bg-vermelho-escuro',
  secundario:
    'border border-carvao/25 text-carvao hover:border-carvao hover:bg-carvao hover:text-osso',
  verde: 'bg-verde-forte text-white hover:bg-verde-fundo',
  claro: 'bg-white text-verde-noite hover:bg-dourado',
  fantasma: 'border border-white/30 text-white hover:border-dourado hover:text-dourado',
};

type Props = {
  href: string;
  children: ReactNode;
  variante?: Variante;
  tamanho?: Tamanho;
  className?: string;
} & Omit<ComponentProps<'a'>, 'href' | 'children' | 'className'>;

/**
 * Todo CTA do site passa por aqui. Links externos (wa.me, Instagram, Maps)
 * ganham target/rel sozinhos; âncoras e rotas internas usam o Link do Next.
 */
export function Button({
  href,
  children,
  variante = 'primario',
  tamanho = 'lg',
  className = '',
  ...resto
}: Props) {
  const classes = `${base} ${tamanhos[tamanho]} ${variantes[variante]} ${className}`;
  const externo = href.startsWith('http');

  if (externo || href.startsWith('#') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        className={classes}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...resto}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...resto}>
      {children}
    </Link>
  );
}
