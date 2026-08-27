import type { Metadata } from 'next';
import { Briefcase, Check } from 'lucide-react';
import { DesenhoProduto, type TipoDesenho } from '@/components/ui/DesenhoProduto';
import { AmostraEscudo, AmostraTecido } from '@/components/ui/Amostras';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { MockupBoard } from '@/components/ui/MockupBoard';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Galeria } from '@/components/sections/Galeria';
import { Processo } from '@/components/sections/Processo';
import { Orcamento } from '@/components/sections/Orcamento';
import { mensagens, site } from '@/data/site';
import { uniformeCorporativo, uniformeDestaque } from '@/data/conteudo';
import { escudos, tecidos } from '@/data/acabamentos';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Uniformes esportivos e corporativos personalizados',
  description:
    'Camisa, shorts, meião, agasalho esportivo e bermuda de passeio personalizados para o seu time, além de uniforme corporativo para empresas. Arte digital antes da produção, em Taboão da Serra/SP.',
  alternates: { canonical: `${site.url}/uniformes` },
  openGraph: {
    title: `Uniformes esportivos e corporativos — ${site.nome}`,
    description:
      'Camisa, shorts, meião, agasalhos e bermudas sob medida para o seu time — e uniforme corporativo para empresas.',
    url: `${site.url}/uniformes`,
  },
};

const pecas: { desenho: TipoDesenho; titulo: string; itens: string[] }[] = [
  {
    desenho: 'camisa',
    titulo: 'Camisa',
    itens: [
      'Gola careca, polo ou V',
      'Manga curta ou regata',
      'Escudo sublimado, bordado, patch 3D ou emborrachado',
      'Nome e número por jogador',
      'Espaço para patrocinadores',
    ],
  },
  {
    desenho: 'shorts',
    titulo: 'Shorts (calção)',
    itens: [
      'Modelagem campo, society ou futsal',
      'Numeração combinando com a camisa',
      'Cordão interno e bolso opcional',
      'Tamanhos infantil ao adulto',
    ],
  },
  {
    desenho: 'meiao',
    titulo: 'Meião',
    itens: [
      'Cores lisas ou combinadas ao kit',
      'Punho reforçado',
      'Pode ser pedido separado do kit',
      'Fecha o kit completo do time',
    ],
  },
  {
    desenho: 'agasalho',
    titulo: 'Agasalho esportivo',
    itens: [
      'Jaqueta e calça em conjunto',
      'Ou peça avulsa, só a jaqueta',
      'Escudo, nome do time e do atleta',
      'Para aquecimento, viagem e frio',
    ],
  },
  {
    desenho: 'bermuda',
    titulo: 'Bermuda de passeio',
    itens: [
      'Para usar fora de campo',
      'Cor lisa ou com a identidade do time',
      'Sozinha ou junto com o kit',
      'Vários tamanhos',
    ],
  },
];

const modalidades = [
  {
    nome: 'Futebol de campo',
    texto:
      'Modelagem tradicional, tecido com boa respirabilidade para jogo em grama. Kit completo com camisa, shorts e meião.',
  },
  {
    nome: 'Society',
    texto:
      'Peça um pouco mais justa, pensada para jogos rápidos em grama sintética. Muito procurada por times de empresa.',
  },
  {
    nome: 'Futsal',
    texto:
      'Modelagem e tecido de quadra: mais leve, com secagem rápida. Numeração também no shorts.',
  },
  {
    nome: 'Escolinhas e grupos',
    texto:
      'Pedidos grandes com numeração sequencial, controle por lista de nomes e reposição de peças depois.',
  },
];

const corporativo = [
  'Camisa polo, camiseta e camisa de manga longa',
  'Logo da empresa aplicado em bordado ou estampa',
  'Nome do funcionário e do setor em cada peça',
  'Reposição depois, mantendo o mesmo padrão',
];

export default function UniformesPage() {
  return (
    <>
      <section className="pb-16 pt-[calc(var(--header-h)+3rem)] lg:pb-20 lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto grid max-w-conteudo items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="marcador-secao text-vermelho-escuro">Uniformes personalizados</p>
            <h1 className="mt-5 text-display-lg text-carvao">
              Camisa, shorts e meião com a cara do seu time
            </h1>
            <p className="mt-6 max-w-xl text-body-lg text-carvao-claro">
              A gente produz o kit inteiro sob medida: você escolhe o modelo, o tecido e as cores, e
              a gente aplica escudo, nome do time e a numeração de cada jogador. Também fazemos
              agasalho esportivo, bermuda de passeio e uniforme corporativo para empresas. A arte
              digital vem antes — nada é costurado sem a sua aprovação.
            </p>

            <ul className="mt-8 space-y-2.5 text-[0.9375rem] text-carvao-claro">
              {[
                'Kit completo ou peças separadas',
                `Pedido mínimo de ${site.comercial.pedidoMinimo} ${site.comercial.unidade} por produto`,
                'Retirada em Taboão da Serra ou envio para todo o Brasil',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-verde" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>

            <Button href={buildWhatsAppUrl(mensagens.uniformes)} className="mt-9">
              <WhatsAppIcon className="h-5 w-5" />
              Pedir orçamento no WhatsApp
            </Button>
          </div>

          <MockupBoard
            uniforme={uniformeDestaque}
            tamanho="hero"
            className="mx-auto max-w-[400px]"
            prioridade
          />
        </div>
      </section>

      <section className="border-t border-carvao/10 py-20 lg:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <SectionTitle
            marcador="As peças"
            titulo="O que a gente produz sob medida"
            descricao="Tudo é combinado no atendimento. Se o seu time quiser algo fora do padrão, é só falar."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pecas.map((peca, i) => (
              <Reveal key={peca.titulo} delay={i * 60}>
                <div className="h-full border border-carvao/10 bg-white p-8">
                  <div className="mx-auto h-40 w-40">
                    <DesenhoProduto tipo={peca.desenho} />
                  </div>
                  <h3 className="mt-4 text-title text-carvao">{peca.titulo}</h3>
                  <ul className="mt-5 space-y-2.5 text-[0.9375rem] text-carvao-claro">
                    {peca.itens.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-verde" strokeWidth={2.5} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="tecidos" className="scroll-mt-24 border-t border-carvao/10 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <SectionTitle
            marcador="Tecidos"
            titulo="Em que malha o seu uniforme vai ser feito"
            descricao="Na hora do orçamento a gente mostra as opções e você escolhe. Se quiser, passe na loja para pegar o tecido na mão antes de fechar."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tecidos.map((tecido, i) => (
              <Reveal key={tecido.slug} delay={i * 60}>
                <div className="flex h-full flex-col border border-carvao/10 bg-osso p-7">
                  <div className="h-28">
                    <AmostraTecido textura={tecido.textura} />
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <h3 className="text-title text-carvao">{tecido.nome}</h3>
                    {tecido.premium && (
                      <span className="font-expanded rounded-sm border border-dourado-escuro px-2 py-0.5 text-[0.625rem] uppercase tracking-[0.08em] text-dourado-escuro">
                        Premium
                      </span>
                    )}
                  </div>

                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-carvao-claro">
                    {tecido.descricao}
                  </p>
                  <p className="mt-5 border-t border-carvao/10 pt-4 text-[0.75rem] uppercase tracking-[0.08em] text-carvao-claro">
                    {tecido.usoPrincipal}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="escudos" className="scroll-mt-24 border-t border-carvao/10 py-20 lg:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <SectionTitle
            marcador="Escudos"
            titulo="Quatro jeitos de aplicar o escudo do time"
            descricao="O escudo pode ser impresso junto com o tecido ou aplicado por cima, com relevo. Muda o preço, o acabamento e a cara da camisa."
          />

          <div className="mt-14 grid gap-px border border-carvao/10 bg-carvao/10 sm:grid-cols-2 lg:grid-cols-4">
            {escudos.map((escudo, i) => (
              <Reveal key={escudo.slug} delay={i * 60}>
                <div className="flex h-full flex-col bg-white p-7">
                  <div className="h-28">
                    <AmostraEscudo tipo={escudo.slug} />
                  </div>
                  <h3 className="mt-6 text-title text-carvao">{escudo.nome}</h3>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-carvao-claro">
                    {escudo.descricao}
                  </p>
                  <p className="mt-5 border-t border-carvao/10 pt-4 text-[0.8125rem] text-carvao-claro">
                    {escudo.quandoUsar}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-carvao/10 bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <SectionTitle marcador="Modalidades" titulo="Para onde o seu time joga" />

          <div className="mt-14 grid gap-px border border-carvao/10 bg-carvao/10 sm:grid-cols-2">
            {modalidades.map((modalidade, i) => (
              <Reveal key={modalidade.nome} delay={i * 60}>
                <div className="h-full bg-white p-8">
                  <h3 className="text-title text-carvao">{modalidade.nome}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-carvao-claro">
                    {modalidade.texto}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="corporativo" className="scroll-mt-24 border-t border-carvao/10 py-20 lg:py-24">
        <div className="mx-auto grid max-w-conteudo gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <SectionTitle
              marcador="Uniforme corporativo"
              titulo="A marca da sua empresa vestida pela equipe"
              descricao="É uma categoria à parte do esportivo: camisa e camiseta com o logo do seu negócio, para a equipe do dia a dia, a loja, a feira ou o evento."
            />
            <Button
              href={buildWhatsAppUrl(mensagens.corporativo)}
              className="mt-9"
              tamanho="md"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Orçar uniforme da empresa
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Reveal delay={60}>
              <div className="flex h-full flex-col justify-center border border-carvao/10 bg-white p-8">
                <Briefcase aria-hidden="true" className="h-8 w-8 text-verde" strokeWidth={1.25} />
                <ul className="mt-7 space-y-3.5 text-[0.9375rem] text-carvao-claro">
                  {corporativo.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-verde" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <MockupBoard uniforme={uniformeCorporativo} tamanho="galeria" />
            </Reveal>
          </div>
        </div>
      </section>

      <Galeria />
      <Processo />
      <Orcamento />
    </>
  );
}
