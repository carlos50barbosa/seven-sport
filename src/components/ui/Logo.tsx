import Image from 'next/image';
import { asset } from '@/lib/asset';

/**
 * A marca da loja, no arquivo que o dono enviou.
 *
 * O logo original é EMPILHADO (o "S" em cima, o letreiro embaixo) e o header é
 * uma barra horizontal. Por isso `scripts/preparar-imagens.mjs` recorta o mesmo
 * original em duas peças — `logo-marca.png` e `logo-texto.png` — e aqui elas
 * ficam lado a lado. Em 36px de altura o letreiro continua legível; o logo
 * inteiro, empilhado, viraria uma mancha.
 *
 * `logo-seven-sport.png` é a versão completa (marca + letreiro + "ARTIGOS
 * ESPORTIVOS"), usada onde há altura sobrando — hoje, o rodapé.
 */

type Tamanho = 'mini' | 'responsivo' | 'padrao' | 'grande' | 'empilhado';

const medidas: Record<Tamanho, { marca: string; texto: string; gap: string }> = {
  mini: { marca: 'h-6', texto: 'h-[18px]', gap: 'gap-2' },
  responsivo: { marca: 'h-7 sm:h-9', texto: 'h-[20px] sm:h-[26px]', gap: 'gap-2 sm:gap-2.5' },
  padrao: { marca: 'h-9', texto: 'h-[26px]', gap: 'gap-2.5' },
  grande: { marca: 'h-12', texto: 'h-[34px]', gap: 'gap-3' },
  empilhado: { marca: '', texto: '', gap: '' },
};

export function Logo({
  escuro = false,
  animado = false,
  className = '',
  tamanho = 'padrao',
}: {
  /** Só afeta a animação de entrada; o logo tem contorno branco e lê nos dois fundos. */
  escuro?: boolean;
  /** Entrada suave no carregamento da página. */
  animado?: boolean;
  className?: string;
  tamanho?: Tamanho;
}) {
  const rotulo = 'Seven Sport, artigos esportivos';

  if (tamanho === 'empilhado') {
    return (
      <Image
        src={asset('/logo-seven-sport.png')}
        alt={rotulo}
        width={520}
        height={430}
        className={`h-auto w-[168px] ${className}`}
      />
    );
  }

  const m = medidas[tamanho];

  return (
    <span
      className={`inline-flex items-center ${m.gap} ${animado ? 'animate-sobe-fade' : ''} ${className}`}
      aria-label={rotulo}
      role="img"
    >
      <Image
        src={asset('/logo-marca.png')}
        alt=""
        width={520}
        height={222}
        priority
        className={`${m.marca} w-auto`}
      />
      <Image
        src={asset('/logo-texto.png')}
        alt=""
        width={520}
        height={157}
        priority
        className={`${m.texto} w-auto`}
      />
    </span>
  );
}
