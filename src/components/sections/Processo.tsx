import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { PranchaAmpliavel } from '@/components/ui/PranchaAmpliavel';
import { mensagens } from '@/data/site';
import { pranchaExemplo } from '@/data/conteudo';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/** Sete etapas — o nome da loja é Seven. O numeral só existe aqui, onde a ordem importa. */
const etapas = [
  { numero: '01', texto: 'Você chama no WhatsApp e conta como é o time' },
  { numero: '02', texto: 'Escolhe o modelo, o tecido e as cores' },
  { numero: '03', texto: 'A gente monta a arte digital, frente e costas' },
  { numero: '04', texto: 'Você ajusta o que quiser e aprova' },
  { numero: '05', texto: 'Fecha o pedido com a lista de nomes e números' },
  { numero: '06', texto: 'Produção e conferência peça por peça' },
  { numero: '07', texto: 'Retirada na loja em Taboão ou envio para todo o Brasil' },
];

export function Processo() {
  return (
    <section
      id="processo"
      className="dark-section scroll-mt-24 bg-verde-fundo py-20 text-white lg:py-28"
      style={{ backgroundImage: 'linear-gradient(180deg, #0A2E16 0%, #061A0D 100%)' }}
    >
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <SectionTitle
          escuro
          marcador="Como funciona"
          titulo="Sete passos entre a ideia e o time uniformizado"
          descricao="Nenhuma peça é costurada antes de você ver e aprovar a arte. Todo o processo acontece no WhatsApp, direto com quem produz."
        />

        <Reveal delay={60}>
          <figure className="mt-12 lg:mt-14">
            <PranchaAmpliavel prancha={pranchaExemplo} />
            <figcaption className="mx-auto mt-4 max-w-3xl text-center text-[0.8125rem] text-white/55">
              A arte que sai daqui antes de qualquer costura — é este arquivo que chega no seu
              WhatsApp, para você aprovar ou pedir ajuste. Toque em “Ampliar” para ler os selos,
              os patrocinadores e a numeração de perto.
            </figcaption>
          </figure>
        </Reveal>

        {/* mobile: timeline vertical */}
        <ol className="mt-14 lg:hidden">
          {etapas.map((etapa, i) => (
            <Reveal as="li" key={etapa.numero} delay={i * 60}>
              <div className="relative flex gap-5 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="font-expanded text-2xl leading-none text-dourado">
                    {etapa.numero}
                  </span>
                  {i < etapas.length - 1 && (
                    <span aria-hidden="true" className="mt-2 w-px flex-1 bg-white/15" />
                  )}
                </div>
                <p className="pt-0.5 text-body text-white/85">{etapa.texto}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* desktop: trilha horizontal com scroll-snap */}
        <div className="relative mt-16 hidden lg:block">
          {/* tabIndex: uma região rolável precisa ser alcançável só pelo teclado */}
          <ol
            tabIndex={0}
            className="flex snap-x snap-mandatory gap-px overflow-x-auto bg-white/10 pb-1"
            aria-label="Etapas do processo de produção, role para o lado para ver todas as sete"
          >
            {etapas.map((etapa, i) => (
              <li
                key={etapa.numero}
                className="min-w-[240px] flex-1 snap-start bg-verde-noite/60 px-6 py-8 backdrop-blur-[1px]"
              >
                <Reveal delay={i * 60}>
                  <span className="font-expanded text-4xl leading-none text-dourado">
                    {etapa.numero}
                  </span>
                  <p className="mt-5 text-[0.9375rem] leading-relaxed text-white/85">{etapa.texto}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-verde-noite to-transparent"
          />

          <p className="mt-4 text-right text-[0.75rem] uppercase tracking-[0.08em] text-white/45">
            Role para o lado para ver as sete etapas →
          </p>
        </div>

        <Reveal delay={120}>
          <div className="mt-14 flex flex-col items-start gap-5 border-t border-white/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-body text-white/70">
              Começar leva um minuto: só o nome do time, a quantidade de kits e para quando você
              precisa.
            </p>
            <Button
              href={buildWhatsAppUrl(mensagens.processo)}
              variante="claro"
              tamanho="md"
              className="shrink-0"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Começar pelo passo 01
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
