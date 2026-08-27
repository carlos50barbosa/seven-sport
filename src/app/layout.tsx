import type { Metadata, Viewport } from 'next';
import { Archivo, Big_Shoulders } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { site } from '@/data/site';
import './globals.css';

/**
 * Display condensado, atlético — letreiro de camisa.
 * A família chamava-se "Big Shoulders Display" no Google Fonts e foi
 * renomeada para "Big Shoulders" (mesmo desenho, agora com eixo óptico).
 */
const display = Big_Shoulders({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-display',
  display: 'swap',
  // O Next não tem métricas desta família (foi renomeada no Google Fonts),
  // então o fallback automático é desligado e apontamos condensadas locais.
  adjustFontFallback: false,
  fallback: ['Impact', 'Haettenschweiler', 'Arial Narrow', 'sans-serif'],
});

/**
 * Corpo de texto. Carregada como variável no eixo `wdth` para servir também
 * de "Archivo Expanded" (wdth 125) nos numerais — uma família, um download.
 */
const corpo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-corpo',
  display: 'swap',
});

const titulo = `${site.nome} — Uniformes Esportivos Personalizados em ${site.endereco.cidade}/${site.endereco.estado}`;
const descricao =
  'Uniformes esportivos personalizados: camisa, shorts, meião, agasalho e bermuda com o escudo e a numeração do seu time. Também uniforme corporativo para empresas, bolas, chuteiras e tênis. Loja física em Taboão da Serra/SP.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: titulo,
    template: `%s — ${site.nome}`,
  },
  description: descricao,
  applicationName: site.nome,
  authors: [{ name: site.nome }],
  keywords: [
    'uniforme personalizado Taboão da Serra',
    'uniforme de futebol personalizado SP',
    'camisa de time personalizada',
    'uniforme esportivo personalizado',
    'agasalho esportivo personalizado',
    'bermuda de passeio',
    'uniforme corporativo para empresas',
    'uniforme de empresa personalizado',
    'artigos esportivos Taboão da Serra',
    'bolas de futebol',
    'chuteiras e tênis',
    'meiões de futebol',
  ],
  alternates: { canonical: site.url },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: site.url,
    siteName: site.nome,
    title: titulo,
    description: descricao,
  },
  twitter: {
    card: 'summary_large_image',
    title: titulo,
    description: descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0A2E16',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportingGoodsStore',
  '@id': `${site.url}/#loja`,
  name: site.nome,
  alternateName: site.nomeCompleto,
  url: site.url,
  description: site.descricaoCurta,
  telephone: site.telefone.e164,
  priceRange: '$$',
  // Só entram no schema quando o dono confirmar os dados da empresa.
  ...(site.empresa.cnpj ? { taxID: site.empresa.cnpj } : {}),
  ...(site.empresa.razaoSocial ? { legalName: site.empresa.razaoSocial } : {}),
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${site.endereco.rua} - ${site.endereco.bairro}`,
    addressLocality: site.endereco.cidade,
    addressRegion: site.endereco.estado,
    postalCode: site.endereco.cep,
    addressCountry: site.endereco.pais,
  },
  areaServed: site.regioesAtendidas.map((nome) => ({ '@type': 'City', name: nome })),
  sameAs: [site.redes.instagram.url, site.redes.threads.url],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-sm focus:bg-carvao focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-osso"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
