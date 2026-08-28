import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { MockupBoard } from '@/components/ui/MockupBoard';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { mostrarNomeDosTimes } from '@/data/portfolio';
import { catalogo } from '@/data/conteudo';
import { mensagens } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Quantos trabalhos a home mostra antes de mandar para o catálogo.
 *
 * Seis fecha duas linhas na grade de três colunas e uma coluna limpa no celular.
 * A home é vitrine, não acervo: despejar sessenta pranchas aqui empurraria as
 * seções de conversão para baixo e faria o visitante rolar sem chegar a lugar
 * nenhum. O catálogo é que serve para vasculhar.
 */
const NA_VITRINE = 6;

export function Galeria() {
  const amostra = catalogo.slice(0, NA_VITRINE);
  const temMais = catalogo.length > NA_VITRINE;

  return (
    <section id="galeria" className="scroll-mt-24 border-t border-carvao/10 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <SectionTitle
          marcador="Portfólio"
          titulo="Uniformes que já saíram daqui"
          descricao={
            mostrarNomeDosTimes
              ? 'Passe o mouse na prancha (ou toque em “ver as costas”) para conferir a numeração e o nome do time nas costas da camisa.'
              : 'Passe o mouse na prancha (ou toque em “ver as costas”) para conferir a numeração nas costas da camisa.'
          }
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {amostra.map((uniforme, i) => (
            <Reveal key={uniforme.slug} delay={i * 60}>
              <MockupBoard uniforme={uniforme} tamanho="galeria" />
            </Reveal>
          ))}
        </div>

        {temMais && (
          <Reveal delay={amostra.length * 60}>
            <Link
              href="/catalogo"
              className="group mt-8 inline-flex items-center gap-2 text-body-lg font-semibold text-verde-forte underline-offset-4 hover:underline"
            >
              Ver os {catalogo.length} trabalhos do catálogo
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        )}

        <Reveal delay={amostra.length * 60}>
          <div className="mt-6 flex flex-col items-start justify-between gap-6 border border-dashed border-carvao/25 p-8 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-title text-carvao">O próximo pode ser o seu time</h3>
              <p className="mt-2 max-w-xl text-[0.9375rem] text-carvao-claro">
                Conta como é o time no WhatsApp e a gente devolve a arte digital de frente e costas
                para você aprovar — sem compromisso.
              </p>
            </div>
            <Button
              href={buildWhatsAppUrl(mensagens.galeria)}
              variante="verde"
              tamanho="md"
              className="shrink-0"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Quero a minha arte
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
