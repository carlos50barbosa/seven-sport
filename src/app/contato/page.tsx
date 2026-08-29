import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import { Orcamento } from '@/components/sections/Orcamento';
import { Localizacao } from '@/components/sections/Localizacao';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { contatos, site } from '@/data/site';
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

          {/*
            Cada número vem rotulado. Dois telefones idênticos lado a lado não
            informam nada — só transferem para o visitante a dúvida de para qual
            deles falar, que é justamente o que a página existe para resolver.
          */}
          <div className="mt-9 grid gap-8 sm:max-w-2xl sm:grid-cols-2">
            {contatos.map((contato) => (
              <div key={contato.rotulo}>
                <p className="text-caption text-vermelho-escuro">
                  {contato.rotulo.toUpperCase()}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <Button href={buildWhatsAppUrl(contato.mensagem, contato.telefone.digitos)}>
                    <WhatsAppIcon className="h-5 w-5" />
                    {contato.telefone.formatado}
                  </Button>
                  <Button
                    href={`tel:${contato.telefone.e164}`}
                    variante="secundario"
                    aria-label={`Ligar para ${contato.telefone.formatado}`}
                  >
                    <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                    Ligar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Orcamento />
      <Localizacao />
    </>
  );
}
