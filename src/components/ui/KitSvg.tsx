type Lado = 'frente' | 'costas';

export type PadraoCamisa = 'listras' | 'solido' | 'faixa' | 'ombro';

export type CoresUniforme = {
  /** Cor de base da camisa. */
  base: string;
  /** Listra, faixa ou ombro. */
  detalhe: string;
  /** Cor do número e do nome nas costas. */
  numero: string;
  /** Contorno do número e do nome. Obrigatório em camisa listrada, senão o número some. */
  contorno?: string;
  /** Cor do shorts (calção). */
  shorts: string;
};

export type VetorUniforme = {
  padrao: PadraoCamisa;
  cores: CoresUniforme;
  numero: string;
  nomeJogador: string;
};

/** Silhuetas compartilhadas: a prancha de mockup e os desenhos de categoria usam as mesmas. */
export const CAMISA =
  'M62 26 L84 18 C92 31 108 31 116 18 L138 26 L172 50 L152 84 L140 74 L142 152 L58 152 L60 74 L48 84 L28 50 Z';
export const SHORTS = 'M64 160 H136 L141 212 H106 L100 180 L94 212 H59 Z';

/**
 * Reconstrução vetorial do kit (camisa + shorts + meiões) nas cores do time.
 * Substitui a foto enquanto as pranchas reais não chegam, e evita reproduzir
 * escudos de clubes profissionais.
 */
export function KitSvg({
  vetor,
  slug,
  lado,
  mostrarNome = true,
}: {
  vetor: VetorUniforme;
  /** Entra nos ids de clipPath, para duas pranchas na mesma página não colidirem. */
  slug: string;
  lado: Lado;
  /** false esconde o nome nas costas — é o que a chave do portfólio desliga. */
  mostrarNome?: boolean;
}) {
  const { cores, padrao, numero, nomeJogador } = vetor;
  // Contorno: garante que número e nome sejam legíveis mesmo sobre listras.
  const contorno = cores.contorno;
  const clipCamisa = `clip-camisa-${slug}-${lado}`;
  const clipShorts = `clip-shorts-${slug}-${lado}`;
  const listras = [28, 54, 80, 106, 132, 158];

  return (
    <svg
      viewBox="0 0 200 268"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      <defs>
        <clipPath id={clipCamisa}>
          <path d={CAMISA} />
        </clipPath>
        <clipPath id={clipShorts}>
          <path d={SHORTS} />
        </clipPath>
      </defs>

      {/* sombra de estúdio */}
      <ellipse cx="100" cy="262" rx="62" ry="5" fill="#14181B" opacity="0.07" />

      {/* ---------- camisa ---------- */}
      <g clipPath={`url(#${clipCamisa})`}>
        <rect x="0" y="0" width="200" height="160" fill={cores.base} />

        {padrao === 'listras' &&
          listras.map((x) => (
            <rect key={x} x={x} y="0" width="13" height="160" fill={cores.detalhe} />
          ))}

        {padrao === 'faixa' && <rect x="0" y="76" width="200" height="22" fill={cores.detalhe} />}

        {padrao === 'ombro' && (
          <>
            <path d="M28 50 L62 26 L70 40 L40 66 Z" fill={cores.detalhe} />
            <path d="M172 50 L138 26 L130 40 L160 66 Z" fill={cores.detalhe} />
          </>
        )}
      </g>

      {/* gola */}
      <path
        d="M84 18 C92 31 108 31 116 18 L112 15 C106 24 94 24 88 15 Z"
        fill={cores.detalhe}
        stroke={cores.detalhe}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      <path d={CAMISA} fill="none" stroke="#14181B" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* punhos */}
      <path d="M48 84 L28 50" fill="none" stroke={cores.detalhe} strokeWidth="6" />
      <path d="M152 84 L172 50" fill="none" stroke={cores.detalhe} strokeWidth="6" />

      {lado === 'costas' && (
        <>
          {/* textLength trava a largura: qualquer nome de time cabe nas costas */}
          {mostrarNome && (
          <text
            x="100"
            y="54"
            textAnchor="middle"
            textLength="74"
            lengthAdjust="spacingAndGlyphs"
            fill={cores.numero}
            stroke={contorno ?? 'none'}
            strokeWidth={contorno ? 2.5 : 0}
            strokeLinejoin="round"
            paintOrder="stroke"
            fontFamily="var(--font-display), Impact, sans-serif"
            fontWeight="700"
            fontSize="12"
          >
            {nomeJogador.toUpperCase()}
          </text>
          )}
          <text
            x="100"
            y="124"
            textAnchor="middle"
            fill={cores.numero}
            stroke={contorno ?? 'none'}
            strokeWidth={contorno ? 5 : 0}
            strokeLinejoin="round"
            paintOrder="stroke"
            fontFamily="var(--font-display), Impact, sans-serif"
            fontWeight="800"
            fontSize="58"
            letterSpacing="-2"
          >
            {numero}
          </text>
        </>
      )}

      {lado === 'frente' && (
        <g>
          {/* espaço do escudo: o escudo real do time entra aqui na produção */}
          <path
            d="M74 52 L92 52 L92 68 L83 76 L74 68 Z"
            fill={contorno ?? 'none'}
            fillOpacity={contorno ? 0.9 : 0}
            stroke={cores.numero}
            strokeWidth="1.5"
          />
          <text
            x="128"
            y="70"
            textAnchor="middle"
            fill={cores.numero}
            stroke={contorno ?? 'none'}
            strokeWidth={contorno ? 3 : 0}
            strokeLinejoin="round"
            paintOrder="stroke"
            fontFamily="var(--font-display), Impact, sans-serif"
            fontWeight="800"
            fontSize="26"
          >
            {numero}
          </text>
        </g>
      )}

      {/* ---------- shorts ---------- */}
      <g clipPath={`url(#${clipShorts})`}>
        <rect x="0" y="155" width="200" height="60" fill={cores.shorts} />
        <rect x="0" y="155" width="200" height="7" fill={cores.detalhe} />
        {padrao === 'listras' && <rect x="126" y="155" width="10" height="60" fill={cores.detalhe} />}
      </g>
      <path d={SHORTS} fill="none" stroke="#14181B" strokeOpacity="0.35" strokeWidth="1.5" />

      {/* ---------- meiões ---------- */}
      {[
        { x: 64, y: 220 },
        { x: 112, y: 220 },
      ].map((m) => (
        <g key={m.x}>
          <rect x={m.x} y={m.y} width="24" height="34" rx="7" fill={cores.shorts} />
          <rect x={m.x} y={m.y} width="24" height="8" rx="4" fill={cores.detalhe} />
          <rect
            x={m.x}
            y={m.y}
            width="24"
            height="34"
            rx="7"
            fill="none"
            stroke="#14181B"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}
