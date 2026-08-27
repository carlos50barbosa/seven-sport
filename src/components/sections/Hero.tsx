import { ArrowDown, Check } from 'lucide-react';
import { MockupBoard } from '@/components/ui/MockupBoard';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { mensagens, site } from '@/data/site';
import { portfolio } from '@/data/conteudo';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const provas = [
  'Arte digital gratuita',
  'Aprovação antes da produção',
  'Retirada em Taboão ou envio para todo o Brasil',
];

export function Hero() {
  const destaque = portfolio[0];

  return (
    <section className="relative overflow-hidden pb-16 pt-[calc(var(--header-h)+2.5rem)] sm:pb-20 lg:pb-28 lg:pt-[calc(var(--header-h)+4.5rem)]">
      {/* listras verticais discretas, o mesmo desenho das camisas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #14181B 0 1px, transparent 1px 84px)',
        }}
      />

      <div className="relative mx-auto grid max-w-conteudo items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="animate-sobe-fade">
          <p className="marcador-secao text-vermelho-escuro">
            {site.endereco.cidade.toUpperCase()} · {site.endereco.estado}
          </p>

          <h1 className="mt-5 text-display-xl text-carvao">
            Uniforme do seu time,
            <br />
            <span className="text-verde">do jeito que você desenhou</span>
          </h1>

          <p className="mt-6 max-w-xl text-body-lg text-carvao-claro">
            Camisa, shorts e meião personalizados com o escudo, as cores, os nomes e a numeração
            do seu time. Também agasalho, bermuda e uniforme corporativo. Arte digital antes de
            produzir — você aprova, a gente costura.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href={buildWhatsAppUrl(mensagens.hero)}>
              <WhatsAppIcon className="h-5 w-5" />
              Pedir orçamento no WhatsApp
            </Button>

            <Button href="#galeria" variante="secundario">
              Ver uniformes que já fizemos
              <ArrowDown aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[0.875rem] text-carvao-claro">
            {provas.map((prova) => (
              <li key={prova} className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-verde" strokeWidth={2.5} />
                {prova}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-sobe-fade [animation-delay:180ms]">
          <MockupBoard
            uniforme={destaque}
            tamanho="hero"
            className="mx-auto max-w-[420px]"
            prioridade
          />
          <p className="mx-auto mt-4 max-w-[420px] text-center text-[0.8125rem] text-carvao-claro">
            É exatamente assim que a sua arte chega: frente e costas, antes de qualquer costura.
          </p>
        </div>
      </div>
    </section>
  );
}
