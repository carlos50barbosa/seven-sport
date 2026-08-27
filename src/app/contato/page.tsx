import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import { Orcamento } from '@/components/sections/Orcamento';
import { Localizacao } from '@/components/sections/Localizacao';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { mensagens, site } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Contato e localização',
  description: `Fale com a ${site.nome} pelo WhatsApp ${site.telefone.formatado}. Loja em ${site.endereco.rua} — ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.estado}.`,
  alternates: { canonical: `${site.url}/contato` },
  openGraph: {
    title: `Contato — ${site.nome}`,
    description: `WhatsApp ${site.telefone.formatado}. Loja em ${site.endereco.cidade}/${site.endereco.estado}.`,
    url: `${site.url}/contato`,
  },
};

export default function ContatoPage() {
  return (
    <>
      <section className="pb-14 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <p className="marcador-secao text-vermelho-escuro">Contato</p>
          <h1 className="mt-5 max-w-3xl text-display-lg text-carvao">
            Fale direto com quem produz o uniforme
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-carvao-claro">
            O atendimento é todo pelo WhatsApp: você conta como é o time, a gente devolve a arte
            digital e ajusta até ficar do jeito que você quer.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={buildWhatsAppUrl(mensagens.contato)}>
              <WhatsAppIcon className="h-5 w-5" />
              {site.telefone.formatado}
            </Button>
            <Button href={`tel:${site.telefone.e164}`} variante="secundario">
              <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              Ligar para a loja
            </Button>
          </div>
        </div>
      </section>

      <Orcamento />
      <Localizacao />
    </>
  );
}
