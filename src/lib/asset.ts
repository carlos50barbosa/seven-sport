/**
 * Caminho de arquivo estático, já com o prefixo da subpasta.
 *
 * Por que isso existe: com `basePath`, o Next prefixa o ENDPOINT do otimizador
 * (`/seven-sport/_next/image`) mas NÃO prefixa o caminho que vai no parâmetro
 * `url=`. O otimizador então procura `/logo-marca.png` na raiz do servidor,
 * não acha e responde 400 — todas as imagens quebram, silenciosamente, só em
 * produção com subpasta.
 *
 * `asset()` resolve o parâmetro. Também vale para <img> comum e para o modo
 * `unoptimized`, onde o caminho público é justamente o prefixado.
 *
 * Com NEXT_PUBLIC_BASE_PATH vazio (domínio próprio), devolve o caminho intacto.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function asset(caminho: string): string {
  return `${basePath}${caminho}`;
}
