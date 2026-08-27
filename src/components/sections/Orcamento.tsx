'use client';

import { useId, useState, type FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

type Campos = {
  nome: string;
  time: string;
  tipo: string;
  quantidade: string;
  prazo: string;
  observacoes: string;
};

type Erros = Partial<Record<keyof Campos, string>>;

const inicial: Campos = {
  nome: '',
  time: '',
  tipo: 'Futebol de campo',
  quantidade: '',
  prazo: '',
  observacoes: '',
};

const tipos = ['Futebol de campo', 'Society', 'Futsal', 'Outro'];

/** O que acontece depois que a mensagem é enviada — reduz a ansiedade de clicar. */
const depois = [
  'A gente responde no WhatsApp com as opções de modelo e tecido.',
  'Você recebe a arte digital do uniforme, frente e costas.',
  'Ajusta o que quiser e só então a produção começa.',
];

function validar(campos: Campos): Erros {
  const erros: Erros = {};

  if (!campos.nome.trim()) erros.nome = 'Informe o seu nome.';
  if (!campos.time.trim()) erros.time = 'Informe o nome do time.';

  const qtd = Number(campos.quantidade);
  const minimo = site.comercial.pedidoMinimo;
  if (!campos.quantidade.trim()) {
    erros.quantidade = 'Informe a quantidade de kits.';
  } else if (!Number.isFinite(qtd)) {
    erros.quantidade = 'Informe a quantidade em números.';
  } else if (qtd < minimo) {
    erros.quantidade = `O pedido mínimo é de ${minimo} ${site.comercial.unidade} por produto.`;
  }

  return erros;
}

/** Monta a mensagem do pedido. Acentos e quebras de linha são preservados no encode. */
export function montarMensagem(campos: Campos): string {
  const linhas = [
    `Olá, Seven Sport! Sou ${campos.nome.trim()} e quero um orçamento de uniforme.`,
    `Time: ${campos.time.trim()}`,
    `Modalidade: ${campos.tipo}`,
    `Quantidade: ${campos.quantidade.trim()} kits`,
    `Prazo: ${campos.prazo.trim() || 'a combinar'}`,
  ];

  if (campos.observacoes.trim()) {
    linhas.push(`Observações: ${campos.observacoes.trim()}`);
  }

  return linhas.join('\n');
}

const classeCampo =
  'w-full rounded-sm border bg-white px-4 py-3.5 text-body text-carvao placeholder:text-carvao-claro/60 transition-colors focus:border-verde';

/**
 * Fica FORA do componente de propósito: declarada dentro, viraria um tipo novo
 * a cada render e o React remontaria o role="alert", fazendo o leitor de tela
 * reanunciar o erro a cada tecla digitada.
 */
function Erro({ id, mensagem }: { id: string; mensagem?: string }) {
  if (!mensagem) return null;

  return (
    <p
      id={id}
      role="alert"
      className="mt-2 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-vermelho"
    >
      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2} />
      {mensagem}
    </p>
  );
}

export function Orcamento() {
  const [campos, setCampos] = useState<Campos>(inicial);
  const [erros, setErros] = useState<Erros>({});
  const id = useId();

  const atualizar = (chave: keyof Campos) => (valor: string) => {
    setCampos((antigo) => ({ ...antigo, [chave]: valor }));
    setErros((antigo) => ({ ...antigo, [chave]: undefined }));
  };

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const encontrados = validar(campos);
    setErros(encontrados);

    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) {
      document.getElementById(`${id}-${primeiro}`)?.focus();
      return;
    }

    const url = buildWhatsAppUrl(montarMensagem(campos));
    const janela = window.open(url, '_blank', 'noopener,noreferrer');
    if (!janela) window.location.href = url;
  };

  /**
   * `ajuda` entra sempre no aria-describedby, com ou sem erro: o leitor de tela
   * precisa ouvir o pedido mínimo antes de digitar, não só depois de errar.
   */
  const campoProps = (chave: keyof Campos, opcoes?: { ajuda?: boolean; obrigatorio?: boolean }) => {
    const descritores = [
      erros[chave] ? `${id}-${chave}-erro` : null,
      opcoes?.ajuda ? `${id}-${chave}-ajuda` : null,
    ].filter(Boolean);

    return {
      id: `${id}-${chave}`,
      name: chave,
      value: campos[chave],
      required: opcoes?.obrigatorio,
      'aria-invalid': erros[chave] ? (true as const) : undefined,
      'aria-describedby': descritores.length ? descritores.join(' ') : undefined,
      className: `${classeCampo} ${erros[chave] ? 'border-vermelho' : 'border-carvao/20'}`,
    };
  };

  return (
    <section id="orcamento" className="scroll-mt-24 border-t border-carvao/10 bg-white py-20 lg:py-28">
      <div className="mx-auto grid max-w-conteudo gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionTitle
            marcador="Orçamento"
            titulo="Monte o seu pedido em 30 segundos"
            descricao="Preencha os campos e o site abre o WhatsApp com a mensagem pronta. Você só aperta enviar — nada fica guardado aqui."
          />

          <Reveal delay={60}>
            <ol className="mt-10 space-y-5 border-t border-carvao/10 pt-8">
              {depois.map((passo, i) => (
                <li key={passo} className="flex gap-4">
                  <span className="font-expanded text-[0.8125rem] leading-6 text-dourado-escuro">
                    0{i + 1}
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-carvao-claro">{passo}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <form onSubmit={enviar} noValidate className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor={`${id}-nome`} className="mb-2 block text-[0.875rem] font-semibold text-carvao">
                Seu nome <span className="text-vermelho">*</span>
              </label>
              <input
                type="text"
                autoComplete="name"
                placeholder="Ex.: Carlos"
                {...campoProps('nome', { obrigatorio: true })}
                onChange={(e) => atualizar('nome')(e.target.value)}
              />
              <Erro id={`${id}-nome-erro`} mensagem={erros.nome} />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor={`${id}-time`} className="mb-2 block text-[0.875rem] font-semibold text-carvao">
                Nome do time <span className="text-vermelho">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex.: Grêmio Cacimbinha"
                {...campoProps('time', { obrigatorio: true })}
                onChange={(e) => atualizar('time')(e.target.value)}
              />
              <Erro id={`${id}-time-erro`} mensagem={erros.time} />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor={`${id}-tipo`} className="mb-2 block text-[0.875rem] font-semibold text-carvao">
                Modalidade
              </label>
              <select
                {...campoProps('tipo')}
                onChange={(e) => atualizar('tipo')(e.target.value)}
              >
                {tipos.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label
                htmlFor={`${id}-quantidade`}
                className="mb-2 block text-[0.875rem] font-semibold text-carvao"
              >
                Quantidade de kits <span className="text-vermelho">*</span>
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={site.comercial.pedidoMinimo}
                step={1}
                placeholder={`Ex.: ${site.comercial.pedidoMinimo + 8}`}
                {...campoProps('quantidade', { ajuda: true, obrigatorio: true })}
                onChange={(e) => atualizar('quantidade')(e.target.value)}
              />
              <Erro id={`${id}-quantidade-erro`} mensagem={erros.quantidade} />
              <p id={`${id}-quantidade-ajuda`} className="mt-2 text-[0.8125rem] text-carvao-claro">
                Mínimo de {site.comercial.pedidoMinimo} {site.comercial.unidade} por produto.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${id}-prazo`} className="mb-2 block text-[0.875rem] font-semibold text-carvao">
                Precisa para quando
              </label>
              <input
                type="text"
                placeholder="Ex.: até o fim do mês, para o campeonato"
                {...campoProps('prazo')}
                onChange={(e) => atualizar('prazo')(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={`${id}-observacoes`}
                className="mb-2 block text-[0.875rem] font-semibold text-carvao"
              >
                Observações
              </label>
              <textarea
                rows={4}
                placeholder="Cores, escudo, se já tem arte pronta, nomes e números..."
                {...campoProps('observacoes')}
                onChange={(e) => atualizar('observacoes')(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm bg-vermelho px-7 py-4 text-[0.9375rem] font-semibold uppercase tracking-[0.06em] text-white transition-all duration-200 ease-prancha hover:-translate-y-0.5 hover:bg-vermelho-escuro sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Enviar no WhatsApp
              </button>
              <p className="mt-3 text-[0.8125rem] text-carvao-claro">
                Campos com <span className="text-vermelho">*</span> são obrigatórios. O site não
                armazena nenhum dado: a mensagem vai direto para a conversa.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
