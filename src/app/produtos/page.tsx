import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Store } from 'lucide-react';
import { DesenhoProduto } from '@/components/ui/DesenhoProduto';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Localizacao } from '@/components/sections/Localizacao';
import { produtos } from '@/data/conteudo';
import { mensagens, site } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { asset } from '@/lib/asset';

export const metadata: Metadata = {
  title: 'Produtos: uniformes, agasalhos, bolas, chuteiras e tênis',
  description:
    'Uniformes esportivos e corporativos personalizados, agasalhos, bermudas de passeio, bolas de futebol, chuteiras e tênis na Seven Sport, em Taboão da Serra/SP.',
  alternates: { canonical: `${site.url}/produtos` },
  openGraph: {
    title: `Produtos — ${site.nome}`,
    description:
      'Uniformes esportivos e corporativos sob medida, agasalhos, bermudas, bolas, chuteiras e tênis na loja em Taboão da Serra.',
    url: `${site.url}/produtos`,
  },
};

export default function ProdutosPage() {
  return (
    <>
      <section className="pb-14 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <p className="marcador-secao text-vermelho-escuro">Produtos da loja</p>
          <h1 className="mt-5 max-w-3xl text-display-lg text-carvao">
            Tudo o que o seu time veste, e o que o seu jogo precisa
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-carvao-claro">
            O nicho principal é uniforme esportivo sob medida — camisa, shorts, meião, agasalho e
            bermuda. Também fazemos uniforme corporativo para empresas e vendemos bola, chuteira e
            tênis na loja em {site.endereco.cidade}. Como o estoque de prateleira gira rápido, o
            jeito mais seguro é mandar mensagem perguntando pelo modelo e pela numeração antes de
            vir.
          </p>

          <Button href={buildWhatsAppUrl(mensagens.produtos)} className="mt-8">
            <WhatsAppIcon className="h-5 w-5" />
            Consultar disponibilidade
          </Button>
        </div>
      </section>

      <section className="border-t border-carvao/10 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <SectionTitle
            marcador="Categorias"
            titulo="As categorias da Seven Sport"
            descricao={`Peças marcadas como sob medida são produzidas com a identidade do seu time ou da sua empresa, com pedido mínimo de ${site.comercial.pedidoMinimo} ${site.comercial.unidade} por produto. Bola, chuteira, tênis e meião são de prateleira, no varejo e no atacado.`}
          />

          <div className="mt-14 grid gap-px border border-carvao/10 bg-carvao/10 sm:grid-cols-2 lg:grid-cols-3">
            {produtos.map((produto, i) => (
              <Reveal key={produto.slug} delay={i * 60}>
                  <article className="flex h-full flex-col bg-white p-8">
                    {/* Foto real quando o cliente já mandou; senão, o desenho da peça. */}
                    <div className="relative mb-7 flex h-48 items-center justify-center overflow-hidden border border-carvao/10 bg-osso py-4">
                      {produto.foto ? (
                        <Image
                          src={asset(produto.foto)}
                          alt={`${produto.nome} à venda na ${site.nome}`}
                          fill
                          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px"
                          className="object-contain p-3"
                        />
                      ) : (
                        <DesenhoProduto tipo={produto.desenho} />
                      )}
                    </div>

                    <p
                      className={`text-[0.7rem] font-semibold uppercase tracking-[0.08em] ${
                        produto.personalizado ? 'text-verde-forte' : 'text-carvao-claro'
                      }`}
                    >
                      {produto.personalizado
                        ? 'Sob medida'
                        : produto.atacado
                          ? 'Pronta entrega · varejo e atacado'
                          : 'Pronta entrega'}
                    </p>

                    <h3 className="mt-2 text-title text-carvao">{produto.nome}</h3>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-carvao-claro">
                      {produto.descricao}
                    </p>
                    <ul className="mt-5 flex-1 space-y-2 text-[0.875rem] text-carvao-claro">
                      {produto.detalhes.map((detalhe) => (
                        <li key={detalhe} className="flex items-start gap-2.5">
                          <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-verde" strokeWidth={2.5} />
                          {detalhe}
                        </li>
                      ))}
                    </ul>

                    {produto.personalizado && (
                      <p className="mt-6 border-t border-carvao/10 pt-4 text-[0.8125rem] text-carvao-claro">
                        Pedido mínimo de{' '}
                        <strong className="font-semibold text-carvao">
                          {site.comercial.pedidoMinimo} {site.comercial.unidade}
                        </strong>{' '}
                        deste produto.
                      </p>
                    )}

                    {produto.href && (
                      <Link
                        href={produto.href}
                        className="mt-5 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-carvao-claro transition-colors hover:text-verde-forte"
                      >
                        Ver detalhes
                        <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                      </Link>
                    )}
                  </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className="mt-10 flex items-start gap-4 border border-dashed border-carvao/25 p-7">
              <Store aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-verde" strokeWidth={1.25} />
              <p className="text-[0.9375rem] leading-relaxed text-carvao-claro">
                Disponibilidade, modelos e numeração de bola, chuteira e tênis mudam conforme o
                estoque da semana. Mande uma mensagem no WhatsApp com o que você procura e a gente
                confirma na hora — ou passe na loja para experimentar.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Localizacao />
    </>
  );
}
