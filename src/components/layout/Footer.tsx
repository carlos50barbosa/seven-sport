import Link from 'next/link';
import { Instagram, MapPin, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { MockupBoard } from '@/components/ui/MockupBoard';
import { ThreadsIcon, WhatsAppIcon } from '@/components/ui/Icons';
import { mensagens, site } from '@/data/site';
import { portfolio } from '@/data/conteudo';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

const paginas = [
  { rotulo: 'Início', href: '/' },
  { rotulo: 'Uniformes personalizados', href: '/uniformes' },
  { rotulo: 'Uniforme corporativo', href: '/uniformes#corporativo' },
  { rotulo: 'Bolas, chuteiras e tênis', href: '/produtos' },
  { rotulo: 'Contato e localização', href: '/contato' },
];

const secoes = [
  { rotulo: 'O que fazemos', href: '/#servicos' },
  { rotulo: 'Uniformes que já fizemos', href: '/#galeria' },
  { rotulo: 'Como funciona', href: '/#processo' },
  { rotulo: 'Pedir orçamento', href: '/#orcamento' },
];

export function Footer() {
  const destaque = portfolio[0];

  return (
    <footer className="dark-section bg-carvao text-white/70">
      <div className="mx-auto max-w-conteudo px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr_1fr_auto]">
          <div>
            <Logo escuro tamanho="empilhado" />
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed">
              Uniformes esportivos e corporativos personalizados, agasalhos, bermudas, bolas,
              chuteiras e tênis. Loja física em {site.endereco.cidade}/{site.endereco.estado}.
            </p>

            <ul className="mt-6 space-y-3 text-[0.9375rem]">
              <li>
                <a
                  href={buildWhatsAppUrl(mensagens.contato)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0 text-verde-claro" />
                  {site.telefone.formatado}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${site.telefone.e164}`}
                  className="inline-flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-verde-claro" strokeWidth={1.75} />
                  Ligar para a loja
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-verde-claro" strokeWidth={1.75} />
                <address className="not-italic leading-relaxed">
                  {site.endereco.rua}
                  <br />
                  {site.endereco.bairro} — {site.endereco.cidade}/{site.endereco.estado}
                  <br />
                  CEP {site.endereco.cep}
                </address>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={site.redes.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram da Seven Sport, ${site.redes.instagram.usuario}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 transition-colors hover:border-dourado hover:text-dourado"
              >
                <Instagram aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
              </a>
              <a
                href={site.redes.threads.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Threads da Seven Sport, ${site.redes.threads.usuario}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 transition-colors hover:border-dourado hover:text-dourado"
              >
                <ThreadsIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Páginas">
            <h2 className="text-caption text-dourado font-expanded">PÁGINAS</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {paginas.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Seções">
            <h2 className="text-caption text-dourado font-expanded">SEÇÕES</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {secoes.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden w-[180px] xl:block">
            <MockupBoard uniforme={destaque} tamanho="mini" />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.nome}. Todos os direitos reservados.
            {site.empresa.razaoSocial ? ` · ${site.empresa.razaoSocial}` : ''}
            {site.empresa.cnpj ? ` · CNPJ ${site.empresa.cnpj}` : ''}
          </p>
          <p>
            Desenvolvido por{' '}
            <a
              href={site.desenvolvidoPor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-dourado hover:underline"
            >
              {site.desenvolvidoPor.nome}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
