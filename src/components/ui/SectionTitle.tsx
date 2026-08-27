import type { ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';

export function SectionTitle({
  marcador,
  titulo,
  descricao,
  escuro = false,
  centralizado = false,
}: {
  marcador: string;
  titulo: ReactNode;
  descricao?: ReactNode;
  escuro?: boolean;
  centralizado?: boolean;
}) {
  return (
    <Reveal className={centralizado ? 'text-center' : ''}>
      <p className={`marcador-secao ${escuro ? 'text-dourado' : 'text-vermelho-escuro'}`}>{marcador}</p>
      <h2
        className={`mt-3 text-display-lg ${escuro ? 'text-white' : 'text-carvao'} ${
          centralizado ? 'mx-auto max-w-3xl' : 'max-w-3xl'
        }`}
      >
        {titulo}
      </h2>
      {descricao && (
        <p
          className={`mt-4 max-w-2xl text-body-lg ${
            escuro ? 'text-white/70' : 'text-carvao-claro'
          } ${centralizado ? 'mx-auto' : ''}`}
        >
          {descricao}
        </p>
      )}
    </Reveal>
  );
}
