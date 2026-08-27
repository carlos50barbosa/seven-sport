import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { mensagens } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-[var(--header-h)]">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <p className="font-expanded text-6xl text-dourado-escuro">404</p>
        <h1 className="mt-5 max-w-2xl text-display-lg text-carvao">
          Essa página saiu de campo
        </h1>
        <p className="mt-5 max-w-xl text-body-lg text-carvao-claro">
          O endereço que você abriu não existe mais. Volte para o início ou chame a gente no
          WhatsApp que resolvemos por lá.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/" variante="secundario">
            Voltar para o início
          </Button>
          <Button href={buildWhatsAppUrl(mensagens.contato)}>
            <WhatsAppIcon className="h-5 w-5" />
            Falar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}
