'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { mensagens, site } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function WhatsAppFloat() {
  const [visivel, setVisivel] = useState(false);
  const [sobreOrcamento, setSobreOrcamento] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 400);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  // No mobile o botão flutuante não pode cobrir o CTA do formulário:
  // enquanto a seção de orçamento estiver na tela, ele sai de cena.
  useEffect(() => {
    const alvo = document.getElementById('orcamento');
    if (!alvo || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entrada]) => setSobreOrcamento(entrada.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(alvo);
    return () => observer.disconnect();
  }, []);

  const escondido = !visivel || sobreOrcamento;

  return (
    <a
      href={buildWhatsAppUrl(mensagens.flutuante)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a ${site.nome} no WhatsApp, ${site.telefone.formatado}`}
      aria-hidden={escondido}
      tabIndex={escondido ? -1 : 0}
      className={`fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-verde-forte text-white shadow-[0_12px_28px_-10px_rgba(27,143,58,.85)] transition-all duration-300 ease-prancha hover:bg-verde-fundo sm:bottom-7 sm:right-7 ${
        escondido ? 'pointer-events-none translate-y-4 scale-90 opacity-0' : 'opacity-100'
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
