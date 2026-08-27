'use client';

import Image from 'next/image';
import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { mostrarNomeDosTimes, type Uniforme } from '@/data/portfolio';
import { KitSvg } from '@/components/ui/KitSvg';
import { asset } from '@/lib/asset';

type Tamanho = 'hero' | 'galeria' | 'mini';

const alturas: Record<Tamanho, string> = {
  hero: 'h-[300px] sm:h-[380px] lg:h-[440px]',
  galeria: 'h-[330px] sm:h-[370px]',
  mini: 'h-[120px]',
};

/** Com os nomes desligados, a prancha se identifica pela modalidade. */
function rotuloDe(uniforme: Uniforme) {
  return mostrarNomeDosTimes ? uniforme.time : uniforme.contexto;
}

function altDe(uniforme: Uniforme, lado: 'frente' | 'costas', umLadoSo: boolean) {
  const quem = mostrarNomeDosTimes
    ? `do time ${uniforme.time}`
    : `de ${uniforme.contexto.toLowerCase()}`;

  if (umLadoSo) {
    return `Uniforme personalizado ${quem}: frente e costas da camisa, com shorts, escudo e numeração.`;
  }

  const costas = mostrarNomeDosTimes
    ? 'costas da camisa com nome e numeração'
    : 'costas da camisa com a numeração';
  return `Uniforme personalizado ${quem}, ${
    lado === 'frente' ? 'frente da camisa com shorts e meião' : costas
  }.`;
}

function Face({
  uniforme,
  lado,
  umLadoSo,
  prioridade,
}: {
  uniforme: Uniforme;
  lado: 'frente' | 'costas';
  umLadoSo: boolean;
  prioridade?: boolean;
}) {
  const src = uniforme.foto?.[lado];

  if (src) {
    return (
      <Image
        src={asset(src)}
        alt={altDe(uniforme, lado, umLadoSo)}
        fill
        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 380px"
        className="object-contain"
        priority={prioridade}
      />
    );
  }

  if (!uniforme.vetor) return null;

  return (
    <div role="img" aria-label={altDe(uniforme, lado, umLadoSo)} className="h-full w-full">
      <KitSvg
        vetor={uniforme.vetor}
        slug={uniforme.slug}
        lado={lado}
        mostrarNome={mostrarNomeDosTimes}
      />
    </div>
  );
}

/**
 * A Prancha de Mockup — elemento assinatura do site.
 * Replica o formato que a loja já usa: cantoneiras em L, manequim frente/costas
 * e o nome do time em caixa alta na base.
 *
 * Três modos, decididos pelo dado:
 *  - foto com `frente` e `costas` → gira no hover e no botão
 *  - foto só com `frente`         → a prancha da loja já mostra os dois lados: não gira
 *  - sem foto, com `vetor`        → desenha o kit e gira
 */
export function MockupBoard({
  uniforme,
  tamanho = 'galeria',
  className = '',
  prioridade,
}: {
  uniforme: Uniforme;
  tamanho?: Tamanho;
  className?: string;
  /** true só na prancha do topo da página, para o LCP. */
  prioridade?: boolean;
}) {
  const [virada, setVirada] = useState(false);
  const mini = tamanho === 'mini';
  const umLadoSo = Boolean(uniforme.foto && !uniforme.foto.costas);
  const gira = !umLadoSo && !mini;

  return (
    <figure
      className={`grupo-prancha relative bg-white rounded-prancha shadow-[0_1px_0_rgba(20,24,27,.08),0_18px_40px_-24px_rgba(20,24,27,.45)] ${className}`}
      data-virada={virada ? 'true' : 'false'}
    >
      <div className={`prancha-palco relative px-6 pt-8 ${mini ? 'pb-3' : 'pb-4'}`}>
        {/* cantoneiras em L: verde no topo, vermelha na base */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l-2 border-t-2 border-verde"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b-2 border-r-2 border-vermelho"
        />

        <div className={`${gira ? 'prancha-giro' : 'relative'} ${alturas[tamanho]}`}>
          <div className="prancha-face relative h-full w-full">
            <Face uniforme={uniforme} lado="frente" umLadoSo={umLadoSo} prioridade={prioridade} />
          </div>

          {gira && (
            <div className="prancha-face prancha-face-costas h-full w-full">
              <Face uniforme={uniforme} lado="costas" umLadoSo={umLadoSo} />
            </div>
          )}
        </div>
      </div>

      <figcaption className="min-w-0 overflow-hidden border-t border-carvao/10 px-5 py-3.5">
        <p
          className={`truncate font-display uppercase leading-none tracking-tight text-carvao ${
            mini ? 'text-lg' : 'text-2xl sm:text-[1.75rem]'
          }`}
        >
          {rotuloDe(uniforme)}
        </p>

        {!mini && (
          <div className="mt-2 flex min-w-0 items-center justify-between gap-3">
            <span className="min-w-0 truncate text-[0.75rem] uppercase tracking-[0.08em] text-carvao-claro">
              {mostrarNomeDosTimes ? uniforme.contexto : 'Kit completo'}
            </span>

            {gira && (
              <button
                type="button"
                onClick={() => setVirada((v) => !v)}
                aria-pressed={virada}
                aria-label={
                  virada
                    ? `Ver a frente do uniforme ${rotuloDe(uniforme)}`
                    : `Ver as costas do uniforme ${rotuloDe(uniforme)}`
                }
                className="prancha-botao-virar inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-carvao/15 px-2.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.05em] text-carvao-claro transition-colors hover:border-verde hover:text-verde-forte"
              >
                <RotateCw aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="hidden xs:inline">
                  {virada ? 'Ver a frente' : 'Ver as costas'}
                </span>
              </button>
            )}
          </div>
        )}
      </figcaption>
    </figure>
  );
}
