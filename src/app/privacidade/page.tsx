import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { mensagens, site } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Data da VERSÃO DO TEXTO, não do build: só muda quando o conteúdo desta
 * política mudar.
 *
 * ⚠ Se o site algum dia passar a usar análise de audiência, pixel de rede
 * social, formulário que grave dados em servidor ou qualquer cookie além dos
 * dois descritos aqui, esta página muda ANTES de a novidade ir ao ar — e aí a
 * resposta sobre precisar ou não de banner de consentimento passa a ser outra.
 */
const atualizadoEm = '5 de setembro de 2026';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: `Como a ${site.nome} trata os seus dados: o site não usa análise de audiência, não usa pixel de publicidade e não grava cookies. O atendimento é todo pelo WhatsApp.`,
  alternates: { canonical: `${site.url}/privacidade` },
  openGraph: {
    title: `Política de privacidade — ${site.nome}`,
    description:
      'Este site não rastreia quem o visita. Veja em detalhe o que é coletado e o que não é.',
    url: `${site.url}/privacidade`,
  },
};

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="border-t border-carvao/10 pt-9">
      <h2 className="text-title text-carvao">{titulo}</h2>
      <div className="mt-5 space-y-4 leading-relaxed text-carvao-claro">{children}</div>
    </section>
  );
}

function Lista({ children }: { children: ReactNode }) {
  return <ul className="space-y-3">{children}</ul>;
}

function Item({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden="true" className="mt-[0.65em] h-[3px] w-3 shrink-0 bg-vermelho" />
      <span>{children}</span>
    </li>
  );
}

/** Destaque de termo dentro de um item da lista, sem virar título. */
function Termo({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-carvao">{children}</strong>;
}

export default function PrivacidadePage() {
  return (
    <>
      <section className="pb-12 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <p className="marcador-secao text-vermelho-escuro">Privacidade</p>
          <h1 className="mt-5 max-w-3xl text-display-lg text-carvao">
            O que este site sabe sobre você
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-carvao-claro">
            Quase nada. Esta página existe para mostrar isso em detalhe — e não para esconder o
            contrário embaixo de vinte parágrafos de texto jurídico.
          </p>
          <p className="mt-7 text-[0.8125rem] uppercase tracking-[0.08em] text-carvao-claro">
            Atualizada em {atualizadoEm}
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="border-l-[3px] border-vermelho bg-white p-7 sm:p-8">
              <h2 className="text-title text-carvao">Em resumo</h2>
              <p className="mt-4 leading-relaxed text-carvao-claro">
                A {site.nome} não rastreia quem visita este site. Não há Google Analytics, não há
                pixel do Facebook ou do Instagram, não há cookie de publicidade e nada é gravado no
                seu navegador para acompanhar a sua navegação. Os únicos dados pessoais que chegam
                até nós são os que você mesmo escreve e envia pelo WhatsApp.
              </p>
            </div>

            <div className="mt-12 space-y-12">
              <Secao titulo="Quem é o responsável pelos seus dados">
                <p>
                  O controlador dos dados, na definição da Lei Geral de Proteção de Dados (Lei
                  13.709/2018), é:
                </p>
                <Lista>
                  <Item>
                    <Termo>{site.empresa.razaoSocial}</Termo>, que atende pelo nome de {site.nome}
                  </Item>
                  <Item>CNPJ {site.empresa.cnpj}</Item>
                  <Item>
                    {site.endereco.rua} — {site.endereco.bairro}, {site.endereco.cidade}/
                    {site.endereco.estado}, CEP {site.endereco.cep}
                  </Item>
                  <Item>
                    Canal de contato para assuntos de privacidade: o WhatsApp da loja,{' '}
                    {site.telefone.formatado}
                  </Item>
                </Lista>
              </Secao>

              <Secao titulo="O que este site não faz">
                <p>
                  Vale começar pela lista do que não existe aqui, porque é o que costuma existir na
                  maioria dos sites:
                </p>
                <Lista>
                  <Item>
                    Não há ferramenta de análise de audiência — nem Google Analytics, nem Google Tag
                    Manager, nem equivalente.
                  </Item>
                  <Item>
                    Não há pixel de publicidade nem remarketing. Você não vai ser perseguido por
                    anúncio de uniforme depois de sair daqui.
                  </Item>
                  <Item>
                    O site não grava cookie próprio nenhum, e também não usa o armazenamento local
                    do navegador.
                  </Item>
                  <Item>
                    Não há cadastro, login, carrinho nem pagamento. Não pedimos CPF, e-mail, data de
                    nascimento nem dado de cartão em lugar algum.
                  </Item>
                  <Item>
                    As fontes tipográficas ficam hospedadas no nosso próprio servidor. Abrir a
                    página não gera nenhuma chamada ao Google por causa delas.
                  </Item>
                </Lista>
              </Secao>

              <Secao titulo="Cookies">
                <p>
                  Cookies são pequenos arquivos que um site guarda no seu navegador. Este site não
                  guarda nenhum por conta própria. Existem apenas dois casos, e os dois estão
                  descritos aqui:
                </p>
                <Lista>
                  <Item>
                    <Termo>O mapa da loja.</Termo> O mapa que aparece na página de contato vem do
                    Google Maps, e o Google grava cookies dele no instante em que o mapa carrega.
                    Por isso o mapa não abre sozinho: no lugar dele aparece um botão e, enquanto
                    você não clicar, nenhum cookie do Google entra no seu navegador. Para chegar até
                    a loja sem carregar o mapa, use o botão &ldquo;Traçar rota&rdquo;, que apenas
                    abre um endereço em outra aba.
                  </Item>
                  <Item>
                    <Termo>O painel interno.</Termo> A equipe da loja atualiza o conteúdo do site
                    por um painel de acesso restrito, que usa um cookie de sessão para manter
                    conectado quem já entrou com a senha. Ele é estritamente necessário para o
                    painel funcionar, expira sozinho e nunca é criado na navegação de quem visita o
                    site.
                  </Item>
                </Lista>
                <p>
                  É por isso que você não encontra aqui aquela janela de aceite de cookies: não há
                  rastreamento para você autorizar ou recusar, e o único conteúdo de terceiro do
                  site já espera o seu clique antes de carregar.
                </p>
              </Secao>

              <Secao titulo="O formulário de orçamento">
                <p>
                  No formulário da página de contato pedimos o seu nome, o nome do time, a
                  modalidade, a quantidade de kits, o prazo desejado e as observações que você
                  quiser escrever.
                </p>
                <p>
                  Esses campos não são enviados para servidor nenhum. Ao clicar em enviar, o próprio
                  navegador monta uma mensagem de texto com o que você escreveu e abre o WhatsApp
                  com ela pronta — os dados saem do seu aparelho direto para a conversa, sem passar
                  por banco de dados nosso e sem ficar registrados no site. Se você fechar o
                  WhatsApp sem enviar, nada chega até nós.
                </p>
                <p>
                  Enviada a mensagem, a conversa passa a estar sujeita também aos termos e à
                  política de privacidade do WhatsApp, que é um serviço da Meta.
                </p>
              </Secao>

              <Secao titulo="Registros de acesso do servidor">
                <p>
                  Como todo site na internet, o servidor que entrega estas páginas registra os
                  acessos: endereço IP, data e hora, página aberta e tipo de navegador. Esse
                  registro é automático, serve para manter o site no ar e protegê-lo contra abuso, e
                  não é usado para montar perfil de ninguém nem cruzado com qualquer outra
                  informação.
                </p>
              </Secao>

              <Secao titulo="Para que usamos os dados, e com que base legal">
                <Lista>
                  <Item>
                    <Termo>Para responder ao seu pedido e produzir o uniforme.</Termo> O que você
                    nos manda pelo WhatsApp serve para orçar, desenhar a arte, produzir e entregar o
                    pedido. A base legal é a execução do contrato e os procedimentos preliminares
                    pedidos por você (art. 7º, V, da LGPD).
                  </Item>
                  <Item>
                    <Termo>Para manter o site funcionando e seguro.</Termo> É o caso dos registros
                    de acesso do servidor. A base legal é o legítimo interesse (art. 7º, IX, da
                    LGPD).
                  </Item>
                </Lista>
                <p>
                  Não usamos os seus dados para publicidade, não montamos lista de disparo em massa
                  e não tomamos nenhuma decisão sobre você de forma automatizada.
                </p>
              </Secao>

              <Secao titulo="Com quem os dados são compartilhados">
                <p>
                  A {site.nome} não vende, não aluga e não cede os seus dados para terceiros usarem
                  como quiserem. O contato com outras empresas se limita ao necessário para o
                  atendimento acontecer:
                </p>
                <Lista>
                  <Item>
                    <Termo>WhatsApp (Meta)</Termo>, que é o canal por onde a conversa acontece.
                  </Item>
                  <Item>
                    <Termo>Google</Termo>, apenas se você clicar para carregar o mapa da loja.
                  </Item>
                  <Item>
                    <Termo>A empresa que hospeda o site</Termo>, que mantém o servidor onde estas
                    páginas ficam.
                  </Item>
                  <Item>
                    <Termo>Autoridades públicas</Termo>, quando houver obrigação legal ou ordem
                    judicial.
                  </Item>
                </Lista>
              </Secao>

              <Secao titulo="Nomes e números na camisa">
                <p>
                  Para personalizar o uniforme, o time costuma nos mandar a lista de nomes e números
                  de quem vai jogar — e, em time de base, essa lista inclui menores de idade. Quem
                  envia a lista precisa ter a autorização dos responsáveis para isso.
                </p>
                <p>
                  Do nosso lado, a lista é usada só para produzir aquele pedido, em nenhuma outra
                  finalidade, e pode ser apagada a qualquer momento a pedido de quem enviou. Este
                  site, por si só, não coleta nada disso: os nomes chegam pelo WhatsApp, no meio da
                  conversa.
                </p>
              </Secao>

              <Secao titulo="Por quanto tempo guardamos">
                <p>
                  As conversas de WhatsApp e os arquivos de arte ficam guardados enquanto durar o
                  atendimento, e depois pelo tempo necessário para dar suporte a uma reposição do
                  time e para cumprir os prazos legais de guarda dos documentos fiscais do pedido.
                  Passado esse prazo, ou antes dele a pedido seu, o material é apagado.
                </p>
              </Secao>

              <Secao titulo="Os seus direitos">
                <p>
                  A LGPD garante a você, a qualquer momento e sem custo, o direito de pedir (art.
                  18):
                </p>
                <Lista>
                  <Item>a confirmação de que tratamos dados seus, e o acesso a eles;</Item>
                  <Item>a correção de dados incompletos, desatualizados ou errados;</Item>
                  <Item>
                    a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados
                    fora da lei;
                  </Item>
                  <Item>a portabilidade dos dados para outro fornecedor;</Item>
                  <Item>a eliminação dos dados tratados com o seu consentimento;</Item>
                  <Item>
                    a informação sobre com quem compartilhamos os seus dados e sobre o que acontece
                    se você não consentir;
                  </Item>
                  <Item>a revogação do consentimento.</Item>
                </Lista>
                <p>
                  Para exercer qualquer um deles, é só chamar no WhatsApp da loja ou passar no
                  endereço. Respondemos no menor prazo possível, e sempre dentro do que a lei exige.
                  Você também pode reclamar diretamente à Autoridade Nacional de Proteção de Dados
                  (ANPD).
                </p>
              </Secao>

              <Secao titulo="Segurança">
                <p>
                  O site é servido por conexão criptografada (HTTPS), e o painel usado pela equipe
                  para atualizar o conteúdo é protegido por senha, com a sessão limitada no tempo.
                  Nenhum sistema é infalível, mas os dados que chegam até nós são poucos, ficam sob
                  controle direto da loja e não são espalhados por serviços de terceiros além do que
                  está descrito nesta página.
                </p>
              </Secao>

              <Secao titulo="Mudanças nesta política">
                <p>
                  Se algo mudar na forma como o site trata dados, esta página muda junto e a data no
                  topo é atualizada. A versão publicada aqui é sempre a que vale.
                </p>
              </Secao>
            </div>

            <div className="mt-14 border border-carvao/15 bg-white p-7 sm:p-8">
              <h2 className="text-title text-carvao">Ficou alguma dúvida?</h2>
              <p className="mt-4 leading-relaxed text-carvao-claro">
                Pergunte no mesmo canal em que a gente atende o resto. Se quiser que apaguemos algo
                que você já nos mandou, é só pedir.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button href={buildWhatsAppUrl(mensagens.contato)}>
                  <WhatsAppIcon className="h-5 w-5" />
                  {site.telefone.formatado}
                </Button>
                <Button
                  href={`tel:${site.telefone.e164}`}
                  variante="secundario"
                  aria-label={`Ligar para ${site.telefone.formatado}`}
                >
                  <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  Ligar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
