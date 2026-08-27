import { site } from '@/data/site';

/**
 * Monta o link do WhatsApp com a mensagem já codificada.
 * encodeURIComponent preserva acentos e quebras de linha (%0A) corretamente.
 */
export function buildWhatsAppUrl(mensagem: string): string {
  const texto = encodeURIComponent(mensagem.trim());
  return `https://wa.me/${site.telefone.digitos}?text=${texto}`;
}
