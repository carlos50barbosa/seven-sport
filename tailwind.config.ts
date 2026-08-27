import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 380px: onde o header deixa de caber com o rótulo do CTA por extenso.
      screens: {
        xs: '380px',
      },
      colors: {
        verde: {
          DEFAULT: '#1B8F3A',
          claro: '#25B14C',
          /**
           * Verde que passa em contraste (4,5:1) nos dois sentidos:
           * texto verde sobre fundo claro (6,0:1 no branco) e
           * texto branco sobre fundo verde (6,0:1).
           * O `DEFAULT` (#1B8F3A) fica para ícone, gráfico e área grande.
           */
          forte: '#15722F',
          fundo: '#0A2E16',
          noite: '#061A0D',
        },
        vermelho: {
          DEFAULT: '#E1251B',
          escuro: '#B81C14',
        },
        dourado: {
          /** Numeração de camisa. Só sobre fundo escuro: no claro reprova WCAG. */
          DEFAULT: '#C9A24A',
          /** Mesmo dourado, escurecido para texto sobre fundo claro — 5,0:1 no branco. */
          escuro: '#8A6B1F',
        },
        osso: '#F4F5F3',
        carvao: {
          DEFAULT: '#14181B',
          claro: '#4A5257',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Impact', 'Haettenschweiler', 'sans-serif'],
        sans: ['var(--font-corpo)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // [tamanho, { lineHeight, letterSpacing, fontWeight }]
        'display-xl': ['clamp(2.75rem, 8vw, 5.75rem)', { lineHeight: '0.96', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '0.95', letterSpacing: '-0.015em', fontWeight: '700' }],
        title: ['clamp(1.25rem, 2.2vw, 1.75rem)', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        body: ['1.0625rem', { lineHeight: '1.65', letterSpacing: '0' }],
        'body-lg': ['1.1875rem', { lineHeight: '1.6', letterSpacing: '0' }],
        caption: ['0.8125rem', { lineHeight: '1.45', letterSpacing: '0.08em', fontWeight: '600' }],
      },
      maxWidth: {
        conteudo: '76rem',
      },
      borderRadius: {
        prancha: '4px',
      },
      transitionTimingFunction: {
        prancha: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'traco-swoosh': {
          from: { strokeDashoffset: '260' },
          to: { strokeDashoffset: '0' },
        },
        'sobe-fade': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'traco-swoosh': 'traco-swoosh 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'sobe-fade': 'sobe-fade 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
