import type { Metadata } from 'next';
import { CatalogoGrade } from '@/components/sections/CatalogoGrade';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { mensagens, site } from '@/data/site';
import { catalogo } from '@/data/conteudo';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Catálogo de uniformes já produzidos',
  description:
    'Uniformes esportivos e corporativos que a Seven Sport já produziu, para times de campo, society, futsal, escolas e empresas. Veja o trabalho e peça o do seu time pelo WhatsApp.',
  alternates: { canonical: `${site.url}/catalogo` },
  openGraph: {
    title: `Catálogo de uniformes — ${site.nome}`,
    description:
      'Os uniformes que já saíram da Seven Sport: times de várzea, escolas e empresas, com escudo, nome e numeração.',
    url: `${site.url}/catalogo`,
  },
};

export default function CatalogoPage() {
  return (
    <>
      <section className="pb-14 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <p className="marcador-secao text-vermelho-escuro">Catálogo</p>
          <h1 className="mt-5 max-w-3xl text-display-lg text-carvao">
            Todo uniforme que já saiu daqui
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-carvao-claro">
            Cada peça desta página foi produzida na loja, para um time de verdade. Use o filtro
            para ver só a modalidade que interessa, e passe o mouse na prancha (ou toque em “ver as
            costas”) quando quiser conferir a numeração. Achou algo parecido com o que o seu time
            quer? Manda o print no WhatsApp que a gente parte dali.
          </p>

          <Button href={buildWhatsAppUrl(mensagens.catalogo)} className="mt-8">
            <WhatsAppIcon className="h-5 w-5" />
            Quero um assim para o meu time
          </Button>
        </div>
      </section>

      <section className="border-t border-carvao/10 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <CatalogoGrade uniformes={catalogo} />

          <Reveal>
            <div className="mt-14 flex flex-col items-start justify-between gap-6 border border-dashed border-carvao/25 p-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-title text-carvao">O próximo pode ser o seu time</h2>
                <p className="mt-2 max-w-xl text-[0.9375rem] text-carvao-claro">
                  Conta como é o time no WhatsApp e a gente devolve a arte digital de frente e
                  costas para você aprovar — sem compromisso e sem custo.
                </p>
              </div>
              <Button
                href={buildWhatsAppUrl(mensagens.catalogo)}
                variante="verde"
                tamanho="md"
                className="shrink-0"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Pedir a minha arte
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
