import { Clock, Instagram, MapPin, Navigation } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Reveal } from '@/components/ui/Reveal';
import { WhatsAppIcon } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { MapaSobDemanda } from '@/components/ui/MapaSobDemanda';
import { mensagens, site } from '@/data/site';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function Localizacao() {
  return (
    <section id="localizacao" className="scroll-mt-24 border-t border-carvao/10 py-20 lg:py-28">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <SectionTitle
          marcador="Onde estamos"
          titulo="Loja física em Taboão da Serra"
          descricao="Passe na loja para ver o tecido, experimentar chuteira e fechar o uniforme do time pessoalmente."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <div className="space-y-8">
              <div className="flex gap-4">
                <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-verde" strokeWidth={1.5} />
                <div>
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-carvao-claro">
                    Endereço
                  </h3>
                  <address className="mt-2 not-italic leading-relaxed text-carvao">
                    {site.endereco.rua}
                    <br />
                    {site.endereco.bairro} — {site.endereco.cidade}/{site.endereco.estado}
                    <br />
                    CEP {site.endereco.cep}
                  </address>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-verde" strokeWidth={1.5} />
                <div>
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-carvao-claro">
                    Horário de atendimento
                  </h3>
                  {site.horarios.confirmado ? (
                    <ul className="mt-2 space-y-1 text-carvao">
                      {site.horarios.lista.map((h) => (
                        <li key={h.dias} className="flex justify-between gap-6 sm:justify-start">
                          <span className="text-carvao-claro">{h.dias}</span>
                          <span className="font-medium">{h.horario}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 leading-relaxed text-carvao">
                      Confirme o horário do dia pelo WhatsApp antes de vir — a gente responde na
                      hora.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Instagram aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-verde" strokeWidth={1.5} />
                <div>
                  <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-carvao-claro">
                    Instagram
                  </h3>
                  <a
                    href={site.redes.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-carvao underline-offset-4 transition-colors hover:text-verde-forte hover:underline"
                  >
                    {site.redes.instagram.usuario}
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href={site.mapa.rota} variante="secundario" tamanho="md">
                  <Navigation aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
                  Traçar rota
                </Button>
                <Button
                  href={buildWhatsAppUrl(mensagens.localizacao)}
                  variante="verde"
                  tamanho="md"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Confirmar horário
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="relative h-[340px] overflow-hidden border border-carvao/15 sm:h-[420px]">
              <MapaSobDemanda />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
