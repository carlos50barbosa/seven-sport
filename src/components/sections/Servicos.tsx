import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { DesenhoProduto, type TipoDesenho } from '@/components/ui/DesenhoProduto';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';

const servicos: {
  desenho: TipoDesenho;
  titulo: string;
  texto: string;
  href: string;
  linkRotulo: string;
}[] = [
  {
    desenho: 'camisa',
    titulo: 'Uniforme esportivo completo',
    texto: 'Camisa, shorts e meião, com escudo, nome e número de cada jogador do elenco.',
    href: '/uniformes',
    linkRotulo: 'Ver detalhes dos uniformes esportivos',
  },
  {
    desenho: 'agasalho',
    titulo: 'Agasalhos e bermudas',
    texto: 'Agasalho esportivo do time e bermuda de passeio, na mesma identidade do uniforme.',
    href: '/uniformes',
    linkRotulo: 'Ver agasalhos e bermudas',
  },
  {
    desenho: 'polo',
    titulo: 'Uniforme corporativo',
    texto: 'Camisa e camiseta com a marca da empresa, para a equipe, a loja ou o evento.',
    href: '/uniformes#corporativo',
    linkRotulo: 'Ver uniformes corporativos',
  },
  {
    desenho: 'chuteira',
    titulo: 'Bolas, chuteiras e tênis',
    texto: 'Artigos esportivos de prateleira, na loja em Taboão da Serra.',
    href: '/produtos',
    linkRotulo: 'Ver produtos da loja',
  },
];

export function Servicos() {
  return (
    <section id="servicos" className="scroll-mt-24 border-t border-carvao/10 py-20 lg:py-28">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <SectionTitle
          marcador="O que fazemos"
          titulo="Do time de várzea ao uniforme da empresa"
          descricao="O nicho principal é uniforme esportivo, produzido sob medida para o seu grupo. Nada de estoque pronto: você escolhe modelo, tecido, cores e o que vai escrito em cada peça."
        />

        <div className="mt-14 grid gap-px overflow-hidden border border-carvao/10 bg-carvao/10 sm:grid-cols-2 lg:grid-cols-4">
          {servicos.map((servico, i) => (
              <Reveal key={servico.titulo} delay={i * 60}>
                <Link
                  href={servico.href}
                  aria-label={servico.linkRotulo}
                  className="group flex h-full flex-col bg-osso p-7 transition-colors duration-200 hover:bg-white"
                >
                  <div className="h-24 w-24 transition-transform duration-300 ease-prancha group-hover:-translate-y-1">
                    <DesenhoProduto tipo={servico.desenho} />
                  </div>
                  <h3 className="mt-5 text-title text-carvao">{servico.titulo}</h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-carvao-claro">
                    {servico.texto}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-carvao-claro transition-colors group-hover:text-vermelho">
                    Saiba mais
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Link>
              </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
