'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { mensagens } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const navegacao = [
  { rotulo: 'Uniformes', href: '/uniformes' },
  { rotulo: 'Produtos', href: '/produtos' },
  { rotulo: 'Como funciona', href: '/#processo' },
  { rotulo: 'Contato', href: '/contato' },
];

export function Header() {
  const [rolou, setRolou] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const urlWhats = buildWhatsAppUrl(mensagens.header);

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => {
    if (!menuAberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuAberto(false);
    };
    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [menuAberto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-colors duration-300 ${
        rolou ? 'border-b border-carvao/10 bg-osso/85 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-full max-w-conteudo items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/" aria-label="Seven Sport, ir para a página inicial" className="shrink-0">
          <Logo animado tamanho="responsivo" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navegacao.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-[0.9375rem] font-medium text-carvao transition-colors hover:text-verde-forte after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-verde after:transition-all hover:after:w-full"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={urlWhats}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir orçamento no WhatsApp"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-vermelho px-3.5 text-[0.8125rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors hover:bg-vermelho-escuro xs:px-4 sm:px-5"
          >
            <WhatsAppIcon className="h-5 w-5 xs:h-4 xs:w-4" />
            <span className="hidden xs:inline sm:hidden">Orçamento</span>
            <span className="hidden sm:inline">Pedir orçamento</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu de navegação"
            aria-expanded={menuAberto}
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-carvao lg:hidden"
          >
            <Menu aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Fechar menu"
            tabIndex={-1}
            onClick={() => setMenuAberto(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-carvao/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="absolute right-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col bg-osso px-6 py-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Logo tamanho="mini" />
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                aria-label="Fechar menu de navegação"
                autoFocus
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-carvao"
              >
                <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
              </button>
            </div>

            <nav aria-label="Navegação mobile" className="mt-8">
              <ul className="flex flex-col gap-1">
                {navegacao.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuAberto(false)}
                      className="block border-b border-carvao/10 py-4 font-display text-3xl uppercase leading-none tracking-tight text-carvao"
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={urlWhats}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuAberto(false)}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-sm bg-verde-forte px-5 py-4 text-sm font-semibold uppercase tracking-[0.06em] text-white"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
