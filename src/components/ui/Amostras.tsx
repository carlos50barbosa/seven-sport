import type { Textura } from '@/data/acabamentos';
import type { TipoEscudo } from '@/data/acabamentos';

/**
 * Amostras desenhadas: retalho de tecido e escudo aplicado.
 *
 * Mesma linguagem dos desenhos de categoria — chapado, contorno fino, cartela
 * da marca. A ideia é o cliente ver a diferença entre um jacquard e uma dry lisa,
 * ou entre um bordado e um patch, sem precisar de foto.
 */

const VERDE = '#1B8F3A';
const VERDE_FUNDO = '#0A2E16';
const CARVAO = '#14181B';
const OSSO = '#F4F5F3';
const DOURADO = '#C9A24A';

/** Escudo em escudete: a mesma forma nas quatro técnicas, muda só o acabamento. */
const ESCUDO = 'M50 22 H110 V64 L80 86 L50 64 Z';

// ---------------------------------------------------------------- tecidos

function TexturaSvg({ textura }: { textura: Textura }) {
  const id = `tex-${textura}`;

  return (
    <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}-clip`}>
          {/* retalho com o canto dobrado, como amostra de malharia */}
          <path d="M8 8 H152 V78 L128 102 H8 Z" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}-clip)`}>
        <rect x="0" y="0" width="160" height="110" fill={VERDE} />

        {textura === 'stretch' &&
          [18, 34, 50, 66, 82].map((y) => (
            <path
              key={y}
              d={`M0 ${y} Q40 ${y - 5} 80 ${y} T160 ${y}`}
              stroke={OSSO}
              strokeOpacity="0.28"
              strokeWidth="2"
              fill="none"
            />
          ))}

        {textura === 'jacquard' &&
          [0, 1, 2, 3, 4].map((linha) =>
            [0, 1, 2, 3, 4, 5, 6].map((col) => (
              <path
                key={`${linha}-${col}`}
                d={`M${col * 24 + (linha % 2) * 12} ${linha * 22 + 6} l8 8 l-8 8 l-8 -8 Z`}
                fill={OSSO}
                opacity="0.22"
              />
            )),
          )}

        {textura === 'texturizado' &&
          [0, 1, 2, 3, 4, 5].map((linha) =>
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
              <circle
                key={`${linha}-${col}`}
                cx={col * 18 + (linha % 2) * 9 + 6}
                cy={linha * 18 + 8}
                r="2.6"
                fill={VERDE_FUNDO}
                opacity="0.45"
              />
            )),
          )}

        {textura === 'felpudo' && (
          <>
            <rect x="0" y="0" width="160" height="110" fill={VERDE_FUNDO} />
            {[0, 1, 2, 3, 4, 5, 6].map((linha) =>
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((col) => (
                <path
                  key={`${linha}-${col}`}
                  d={`M${col * 16 + (linha % 2) * 8} ${linha * 16 + 6} q4 -6 8 0`}
                  stroke={OSSO}
                  strokeOpacity="0.22"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  fill="none"
                />
              )),
            )}
          </>
        )}
      </g>

      {/* dobra do canto */}
      <path d="M128 102 L152 78 L128 78 Z" fill={CARVAO} opacity="0.18" />
      <path
        d="M8 8 H152 V78 L128 102 H8 Z"
        fill="none"
        stroke={CARVAO}
        strokeOpacity="0.35"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function AmostraTecido({ textura }: { textura: Textura }) {
  return <TexturaSvg textura={textura} />;
}

// ---------------------------------------------------------------- escudos

export function AmostraEscudo({ tipo }: { tipo: TipoEscudo }) {
  return (
    <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden="true" focusable="false">
      {/* pedaço de camisa ao fundo */}
      <rect x="6" y="6" width="148" height="98" rx="2" fill={OSSO} />
      <rect
        x="6"
        y="6"
        width="148"
        height="98"
        rx="2"
        fill="none"
        stroke={CARVAO}
        strokeOpacity="0.2"
        strokeWidth="1.4"
      />

      <g transform="translate(0 5) scale(0.86) translate(13 0)">
        {tipo === 'sublimado' && (
          <>
            {/* nada de relevo: a tinta é o próprio tecido */}
            <path d={ESCUDO} fill={VERDE} />
            <path d="M80 34 l7 14 l15 2 l-11 11 l3 15 l-14 -8 l-14 8 l3 -15 l-11 -11 l15 -2 Z" fill={OSSO} />
          </>
        )}

        {tipo === 'bordado' && (
          <>
            <path d={ESCUDO} fill={VERDE} />
            {/* pontos de linha acompanhando a borda */}
            <path
              d={ESCUDO}
              fill="none"
              stroke={DOURADO}
              strokeWidth="2.6"
              strokeDasharray="5 4"
              strokeLinecap="round"
            />
            {[32, 42, 52, 62].map((y) => (
              <path
                key={y}
                d={`M56 ${y} H104`}
                stroke={VERDE_FUNDO}
                strokeOpacity="0.22"
                strokeWidth="2.2"
                strokeDasharray="3 3"
              />
            ))}
            {/* mesma estrela das outras técnicas, aqui feita de pontos de linha */}
            <path
              d="M80 34 l7 14 l15 2 l-11 11 l3 15 l-14 -8 l-14 8 l3 -15 l-11 -11 l15 -2 Z"
              fill={DOURADO}
              stroke={DOURADO}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </>
        )}

        {tipo === 'patch3d' && (
          <>
            {/* sombra projetada = peça que salta do tecido */}
            <path d={ESCUDO} fill={CARVAO} opacity="0.28" transform="translate(5 6)" />
            <path d={ESCUDO} fill={VERDE_FUNDO} />
            <path d={ESCUDO} fill="none" stroke={DOURADO} strokeWidth="5" strokeLinejoin="round" />
            <path
              d="M80 36 l6 13 l14 2 l-10 10 l2 14 l-12 -7 l-12 7 l2 -14 l-10 -10 l14 -2 Z"
              fill={DOURADO}
            />
          </>
        )}

        {tipo === 'emborrachado' && (
          <>
            {/* borda grossa e arredondada, com brilho de silicone */}
            <path
              d={ESCUDO}
              fill={VERDE}
              stroke={VERDE_FUNDO}
              strokeWidth="9"
              strokeLinejoin="round"
            />
            <path
              d="M56 30 C64 26 96 26 104 30"
              stroke={OSSO}
              strokeOpacity="0.55"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M80 40 l6 12 l13 2 l-9 9 l2 13 l-12 -6 l-12 6 l2 -13 l-9 -9 l13 -2 Z" fill={OSSO} />
          </>
        )}

        <path d={ESCUDO} fill="none" stroke={CARVAO} strokeOpacity="0.35" strokeWidth="1.6" />
      </g>
    </svg>
  );
}
