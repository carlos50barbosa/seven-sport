import { site } from '@/data/site';

/**
 * Monta o link do WhatsApp com a mensagem já codificada.
 * encodeURIComponent preserva acentos e quebras de linha (%0A) corretamente.
 *
 * `digitos` é opcional e cai no número da loja: as dezenas de chamadas
 * existentes continuam valendo sem tocar em nenhuma. Só a página de contato e o
 * rodapé passam o número do designer, e passam explicitamente.
 */
export function buildWhatsAppUrl(mensagem: string, digitos: string = site.telefone.digitos): string {
  const texto = encodeURIComponent(mensagem.trim());
  return `https://wa.me/${digitos}?text=${texto}`;
}
