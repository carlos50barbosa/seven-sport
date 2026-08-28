'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import type { PranchaExemplo } from '@/data/portfolio';
import { asset } from '@/lib/asset';

/**
 * A prancha da seção "Como funciona", e a mesma prancha em tamanho real.
 *
 * Por que precisa de um modal, e não bastava aumentar a largura: o conteúdo
 * desta imagem é TEXTO — os selos ("TECNOLOGIA DRY"), os patrocinadores no
 * peito, o nome, o número e o telefone do rodapé. A letra miúda tem ~11px no
 * arquivo, então ela só se lê perto de 1:1. Dentro da coluna da página isso
 * nunca acontece: o contêiner tem 1152px para uma imagem de 1565px, e no
 * celular a conta é muito pior.
 *
 * Abrir o .webp numa aba nova também não resolvia — o visualizador do navegador
 * ajusta a imagem à janela, ou seja, devolve o mesmo tamanho de que se estava
 * fugindo. Por isso aqui a versão ampliada é renderizada na largura NATIVA
 * (`max-w-none`) dentro de uma caixa que rola nos dois eixos: é o único arranjo
 * em que os pixels do arquivo chegam inteiros ao olho, em qualquer tela.
 */
export function PranchaAmpliavel({ prancha }: { prancha: PranchaExemplo }) {
  const [aberta, setAberta] = useState(false);
  const botaoFechar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberta) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberta(false);
    };
    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    botaoFechar.current?.focus();
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [aberta]);

  return (
    <>
      {/*
        Sem aria-label: o nome acessível do botão sai do alt da imagem somado ao
        rótulo "Ampliar". Um aria-label aqui apagaria a descrição da arte, que é
        justamente o que o leitor de tela tem para entender a foto.
      */}
      <button
        type="button"
        onClick={() => setAberta(true)}
        className="group relative block w-full rounded-prancha focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dourado"
      >
        <Image
          src={asset(prancha.src)}
          alt={prancha.alt}
          width={prancha.largura}
          height={prancha.altura}
          className="w-full rounded-prancha border border-white/10 transition-colors duration-200 ease-prancha group-hover:border-white/30"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-sm bg-carvao/85 px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-white backdrop-blur-sm transition-colors duration-200 ease-prancha group-hover:bg-verde-forte">
          <ZoomIn className="h-4 w-4" aria-hidden="true" />
          Ampliar
        </span>
      </button>

      {aberta && (
        // O clique no fundo fecha; o cabeçalho e a própria arte seguram o evento.
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Arte do uniforme em tamanho real"
          onClick={() => setAberta(false)}
          className="fixed inset-0 z-[70] flex flex-col bg-carvao/95 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 sm:px-8"
          >
            <p className="text-[0.8125rem] text-white/70">
              Tamanho real, {prancha.largura} px de largura — role para o lado e para baixo para
              percorrer a arte.
            </p>
            <button
              ref={botaoFechar}
              type="button"
              onClick={() => setAberta(false)}
              aria-label="Fechar a arte ampliada"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-white/20 text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dourado"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-auto overscroll-contain px-5 pb-8 sm:px-8">
            <Image
              src={asset(prancha.src)}
              alt=""
              width={prancha.largura}
              height={prancha.altura}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto max-w-none rounded-prancha"
            />
          </div>
        </div>
      )}
    </>
  );
}
