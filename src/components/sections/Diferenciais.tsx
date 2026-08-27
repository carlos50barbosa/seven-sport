import { MessageCircle, PencilRuler, Store, UserRoundPen } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';

const diferenciais = [
  {
    icone: PencilRuler,
    titulo: 'Arte digital antes de produzir',
    texto: 'Nada é costurado sem a sua aprovação. Você vê frente e costas e pede os ajustes.',
  },
  {
    icone: Store,
    titulo: 'Loja física em Taboão da Serra',
    texto: 'Você passa aqui, pega o tecido na mão e vê a qualidade antes de fechar o pedido.',
  },
  {
    icone: UserRoundPen,
    titulo: 'Personalização completa',
    texto: 'Escudo, nome do time, nome e número de cada jogador — peça por peça.',
  },
  {
    icone: MessageCircle,
    titulo: 'Atendimento com quem produz',
    texto: 'Sem intermediário e sem robô: você fala direto com a loja, pelo WhatsApp.',
  },
];

export function Diferenciais() {
  return (
    <section className="border-t border-carvao/10 py-20 lg:py-28">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <SectionTitle
          marcador="Por que a Seven Sport"
          titulo="Quatro motivos, sem enrolação"
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {diferenciais.map((item, i) => {
            const Icone = item.icone;
            return (
              <Reveal key={item.titulo} delay={i * 60}>
                <div className="flex gap-5">
                  <span className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center border border-verde/25 bg-verde/5">
                    <Icone aria-hidden="true" className="h-5 w-5 text-verde" strokeWidth={1.25} />
                  </span>
                  <div>
                    <h3 className="text-title text-carvao">{item.titulo}</h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-carvao-claro">
                      {item.texto}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
