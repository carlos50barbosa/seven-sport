import type { ReactElement } from 'react';
import { CAMISA, SHORTS } from '@/components/ui/KitSvg';

/**
 * Desenhos de categoria.
 *
 * Mesma linguagem da Prancha de Mockup: silhueta chapada, contorno fino escuro
 * e a cartela da marca. A camisa reaproveita literalmente a silhueta do mockup
 * (`CAMISA`), então a peça desenhada aqui é a mesma peça mostrada no portfólio.
 *
 * Substitui foto de banco de imagens enquanto o cliente não manda as fotos reais.
 */

export type TipoDesenho =
  | 'camisa'
  | 'shorts'
  | 'meiao'
  | 'agasalho'
  | 'bermuda'
  | 'polo'
  | 'bola'
  | 'chuteira';

const VERDE = '#1B8F3A';
const VERDE_FUNDO = '#0A2E16';
const CARVAO = '#14181B';
const OSSO = '#F4F5F3';
const DOURADO = '#C9A24A';

const AGASALHO =
  'M64 30 L86 22 H114 L136 30 L172 56 L188 132 L160 140 L148 92 L150 176 L50 176 L52 92 L40 140 L12 132 L28 56 Z';

const BERMUDA = 'M56 46 H144 L152 168 H106 L100 104 L94 168 H48 Z';

const MEIAO =
  'M74 26 H126 L131 118 C133 134 127 143 113 146 L64 157 C52 160 44 153 44 143 C44 133 50 127 60 125 L69 121 Z';

const CHUTEIRA =
  'M18 140 C16 120 30 106 52 99 L100 84 C114 80 126 82 134 90 L138 76 L170 80 L174 118 C176 132 170 140 158 140 Z';
const SOLADO =
  'M14 139 L174 139 L172 152 C170 156 162 158 152 158 L30 156 C20 155 14 151 14 145 Z';

/** Traço de contorno comum a todas as peças. */
const contorno = { fill: 'none', stroke: CARVAO, strokeOpacity: 0.35, strokeWidth: 1.6 };

function Chao({ y = 188 }: { y?: number }) {
  return <ellipse cx="100" cy={y} rx="58" ry="4.5" fill={CARVAO} opacity="0.07" />;
}

function Camisa() {
  return (
    <>
      <defs>
        <clipPath id="desenho-camisa-clip">
          <path d={CAMISA} />
        </clipPath>
      </defs>
      <g transform="translate(-15 12) scale(1.15)">
        <g clipPath="url(#desenho-camisa-clip)">
          <rect x="0" y="0" width="200" height="160" fill={OSSO} />
          {[28, 54, 80, 106, 132, 158].map((x) => (
            <rect key={x} x={x} y="0" width="13" height="160" fill={VERDE} />
          ))}
        </g>
        <path
          d="M84 18 C92 31 108 31 116 18 L112 15 C106 24 94 24 88 15 Z"
          fill={VERDE_FUNDO}
          stroke={VERDE_FUNDO}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M48 84 L28 50" stroke={VERDE_FUNDO} strokeWidth="6" fill="none" />
        <path d="M152 84 L172 50" stroke={VERDE_FUNDO} strokeWidth="6" fill="none" />
        <path d={CAMISA} {...contorno} />
        <text
          x="128"
          y="72"
          textAnchor="middle"
          fill={OSSO}
          stroke={VERDE_FUNDO}
          strokeWidth="3"
          strokeLinejoin="round"
          paintOrder="stroke"
          fontFamily="var(--font-display), Impact, sans-serif"
          fontWeight="800"
          fontSize="28"
        >
          07
        </text>
      </g>
    </>
  );
}

function Polo() {
  return (
    <g transform="translate(-15 12) scale(1.15)">
      <path d={CAMISA} fill={OSSO} />
      {/* gola polo: duas abas caídas e o carcela com botões */}
      <path d="M84 18 L76 34 L98 26 Z" fill={CARVAO} />
      <path d="M116 18 L124 34 L102 26 Z" fill={CARVAO} />
      <rect x="95" y="24" width="10" height="34" fill={OSSO} stroke={CARVAO} strokeWidth="1.4" />
      <circle cx="100" cy="34" r="1.8" fill={CARVAO} />
      <circle cx="100" cy="48" r="1.8" fill={CARVAO} />
      {/* espaço da marca da empresa, no peito */}
      <rect x="58" y="52" width="26" height="16" rx="2" fill={VERDE} />
      <path d="M48 84 L28 50" stroke={CARVAO} strokeWidth="6" fill="none" />
      <path d="M152 84 L172 50" stroke={CARVAO} strokeWidth="6" fill="none" />
      <path d={CAMISA} fill="none" stroke={CARVAO} strokeOpacity="0.55" strokeWidth="1.8" />
    </g>
  );
}

function Agasalho() {
  return (
    <g transform="translate(0 4)">
      <path d={AGASALHO} fill={VERDE_FUNDO} />
      {/* punhos */}
      <path d="M12 132 L40 140" stroke={VERDE} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M188 132 L160 140" stroke={VERDE} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* barra elástica */}
      <path d="M51 168 H149" stroke={VERDE} strokeWidth="9" fill="none" />
      {/* gola alta */}
      <path d="M86 22 H114 L116 8 H84 Z" fill={VERDE} stroke={CARVAO} strokeOpacity="0.35" strokeWidth="1.6" />
      {/* faixa do ombro à barra, como agasalho de time */}
      <path d="M74 26 L66 176" stroke={VERDE} strokeWidth="5" fill="none" />
      <path d="M126 26 L134 176" stroke={VERDE} strokeWidth="5" fill="none" />
      {/* zíper e cursor */}
      <path d="M100 12 V176" stroke={OSSO} strokeWidth="2.6" fill="none" />
      <rect x="96.4" y="34" width="7.2" height="12" rx="2" fill={DOURADO} />
      <path d={AGASALHO} {...contorno} />
    </g>
  );
}

function Bermuda() {
  return (
    <g transform="translate(-30 -39) scale(1.3)">
      <path d={BERMUDA} fill={CARVAO} />
      {/* cós e cordão */}
      <rect x="56" y="46" width="88" height="14" fill={VERDE} />
      <path d="M92 60 q8 8 16 0" stroke={OSSO} strokeWidth="2" fill="none" />
      {/* abertura do bolso */}
      <path d="M60 72 C72 76 80 84 82 98" stroke={OSSO} strokeOpacity="0.55" strokeWidth="1.8" fill="none" />
      {/* barra */}
      <path d="M48 158 H94" stroke={VERDE} strokeWidth="4" fill="none" />
      <path d="M106 158 H152" stroke={VERDE} strokeWidth="4" fill="none" />
      <path d={BERMUDA} {...contorno} />
    </g>
  );
}

function Shorts() {
  return (
    <g transform="translate(-90 -253) scale(1.9)">
      <path d={SHORTS} fill={VERDE} />
      {/* cós */}
      <rect x="59" y="160" width="82" height="7" fill={VERDE_FUNDO} />
      {/* numeração na perna, como no uniforme */}
      <text
        x="124"
        y="190"
        textAnchor="middle"
        fill={OSSO}
        fontFamily="var(--font-display), Impact, sans-serif"
        fontWeight="800"
        fontSize="17"
      >
        07
      </text>
      <path d={SHORTS} fill="none" stroke={CARVAO} strokeOpacity="0.35" strokeWidth="0.9" />
    </g>
  );
}

function Meiao() {
  return (
    <g transform="translate(0 6)">
      <path d={MEIAO} fill={VERDE} />
      {/* punho */}
      <rect x="74" y="26" width="52" height="15" fill={VERDE_FUNDO} />
      {/* listras da canela */}
      <rect x="74" y="52" width="53" height="7" fill={OSSO} opacity="0.85" />
      <rect x="75" y="66" width="53" height="7" fill={OSSO} opacity="0.85" />
      <path d={MEIAO} {...contorno} />
    </g>
  );
}

function Bola() {
  // pentágono central + gomos irradiando: leitura imediata de bola de futebol
  const pentagono = '100,70 128,90 117,124 83,124 72,90';
  const raios = [
    'M100 70 L100 28',
    'M128 90 L166 74',
    'M117 124 L142 158',
    'M83 124 L58 158',
    'M72 90 L34 74',
  ];

  return (
    <g>
      <circle cx="100" cy="100" r="72" fill={OSSO} stroke={CARVAO} strokeOpacity="0.35" strokeWidth="1.6" />
      <polygon points={pentagono} fill={VERDE_FUNDO} />
      {raios.map((d) => (
        <path key={d} d={d} stroke={CARVAO} strokeOpacity="0.55" strokeWidth="2.6" fill="none" />
      ))}
      {/* brilho de estúdio */}
      <path
        d="M62 62 C74 48 96 40 116 42"
        stroke={OSSO}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <circle cx="100" cy="100" r="72" fill="none" stroke={CARVAO} strokeOpacity="0.35" strokeWidth="1.6" />
    </g>
  );
}

function Chuteira() {
  return (
    <g transform="translate(0 8)">
      {/* travas, atrás do solado */}
      {[30, 60, 118, 146].map((x) => (
        <path key={x} d={`M${x} 152 h15 l-3.5 11 h-8 Z`} fill={VERDE_FUNDO} />
      ))}

      <path d={CHUTEIRA} fill={CARVAO} />

      {/* gola do cano */}
      <path d="M138 76 L170 80" stroke={VERDE} strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* faixa lateral em verde, do bico ao calcanhar */}
      <path
        d="M28 130 C54 116 84 104 122 96"
        stroke={VERDE}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* cadarço */}
      {[
        'M78 104 L104 94',
        'M84 114 L110 104',
        'M90 124 L116 114',
      ].map((d) => (
        <path key={d} d={d} stroke={OSSO} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      ))}
      {/* língua */}
      <path d="M104 92 L134 90" stroke={OSSO} strokeOpacity="0.45" strokeWidth="1.8" fill="none" />

      <path d={CHUTEIRA} {...contorno} />

      {/* solado */}
      <path d={SOLADO} fill={VERDE_FUNDO} />
      <path d={SOLADO} fill="none" stroke={CARVAO} strokeOpacity="0.35" strokeWidth="1.4" />
    </g>
  );
}

const desenhos: Record<TipoDesenho, () => ReactElement> = {
  camisa: Camisa,
  shorts: Shorts,
  meiao: Meiao,
  agasalho: Agasalho,
  bermuda: Bermuda,
  polo: Polo,
  bola: Bola,
  chuteira: Chuteira,
};

export function DesenhoProduto({ tipo, className = '' }: { tipo: TipoDesenho; className?: string }) {
  const Desenho = desenhos[tipo];

  return (
    <svg
      viewBox="0 0 200 200"
      className={`h-full w-full ${className}`}
      aria-hidden="true"
      focusable="false"
      shapeRendering="geometricPrecision"
    >
      <Chao y={tipo === 'chuteira' ? 178 : 188} />
      <Desenho />
    </svg>
  );
}
