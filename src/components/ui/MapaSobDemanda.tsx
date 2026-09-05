'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { site } from '@/data/site';

/**
 * O mapa do Google só entra na página depois de um clique.
 *
 * O motivo é de privacidade. O iframe do Maps é conteúdo de TERCEIRO: no
 * instante em que ele carrega, o Google grava cookies próprios no navegador de
 * quem visita, e a Seven Sport não tem como controlar nem descrever o que é
 * gravado. Fora esse iframe o site não guarda absolutamente nada no navegador
 * — sem análise de audiência, sem pixel, sem localStorage —, e é justamente
 * isso que dispensa o site de ter banner de consentimento. Carregar o mapa sob
 * demanda é o que mantém essa frase verdadeira: enquanto ninguém clica, não
 * existe cookie de terceiro nenhum, e quem clica já sabe o que está aceitando.
 *
 * De quebra some da carga inicial o recurso mais pesado da seção. O embed do
 * Maps puxa centenas de KB de script e imagem para dizer o que o endereço ao
 * lado já diz, e quem realmente vai à loja usa o botão "Traçar rota", que abre
 * o aplicativo do celular — melhor no trânsito do que um mapa preso dentro de
 * uma página.
 */
export function MapaSobDemanda() {
  const [carregado, setCarregado] = useState(false);
  const mapa = useRef<HTMLIFrameElement>(null);

  // O botão desaparece no clique. Sem isto o foco do teclado voltaria para o
  // começo do documento, e quem navega sem mouse perderia de vista justamente
  // o mapa que acabou de pedir.
  useEffect(() => {
    if (carregado) mapa.current?.focus();
  }, [carregado]);

  if (carregado) {
    return (
      <iframe
        ref={mapa}
        title={`Mapa da localização da ${site.nome} em ${site.endereco.cidade}`}
        src={site.mapa.embed}
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full grayscale-[.35]"
      />
    );
  }

  return (
    /*
      O rótulo acessível é explícito porque o texto visível, lido inteiro e em
      sequência, viraria uma frase longa e confusa no leitor de tela. Ele começa
      por "Carregar o mapa" — o mesmo texto do botão — para quem usa comando de
      voz conseguir acioná-lo pelo que está escrito na tela.
    */
    <button
      type="button"
      onClick={() => setCarregado(true)}
      aria-label={`Carregar o mapa do Google com a localização da ${site.nome} em ${site.endereco.cidade}. Ao carregar, o Google pode gravar cookies no seu navegador.`}
      className="group relative block h-full w-full"
    >
      <PlantaDeRuas />
      {/*
        Véu em degradê, e não chapado: no centro ele fica quase opaco, para o
        texto e o botão terem fundo limpo; nas bordas quase some, que é onde a
        planta de ruas precisa aparecer para o quadro se ler como mapa. Um véu
        de opacidade única faz um ou outro — ou apaga o desenho, ou come a
        legibilidade do texto.
      */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,245,243,0.95)_25%,rgba(244,245,243,0.45)_100%)]"
      />

      <span className="relative flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-vermelho text-white shadow-[0_14px_30px_-16px_rgba(225,37,27,.95)]">
          <MapPin aria-hidden="true" className="h-6 w-6" strokeWidth={2} />
        </span>

        <span className="text-[0.9375rem] leading-relaxed text-carvao">
          {site.endereco.rua}
          <br />
          {site.endereco.bairro} — {site.endereco.cidade}/{site.endereco.estado}
        </span>

        <span className="inline-flex items-center gap-2.5 rounded-sm bg-carvao px-6 py-3.5 text-[0.875rem] font-semibold uppercase tracking-[0.06em] text-white transition-colors duration-200 ease-prancha group-hover:bg-verde-forte">
          Carregar o mapa
        </span>

        <span className="max-w-[36ch] text-[0.75rem] leading-relaxed text-carvao-claro">
          O mapa é do Google e pode gravar cookies no seu navegador. Por isso só carrega se
          você pedir.
        </span>
      </span>
    </button>
  );
}

/**
 * Planta de ruas decorativa: dá ao espaço a cara de mapa sem ser um, e sem
 * pedir um único byte a servidor de terceiro. É pura ornamentação, daí o
 * aria-hidden — a informação de verdade está no endereço ao lado e no rótulo
 * do botão, que é o que o leitor de tela anuncia.
 */
function PlantaDeRuas() {
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <rect width="400" height="300" className="fill-carvao/[0.13]" />
      {/* A mancha verde da praça é o que faz o olho ler "mapa" antes de ler o texto. */}
      <rect x="230" y="178" width="84" height="60" className="fill-verde/25" />
      <g className="stroke-osso" fill="none" strokeLinecap="square">
        {/* Avenidas */}
        <path d="M0 64h400M0 152h400M0 244h400" strokeWidth="13" />
        <path d="M58 0v300M186 0v300M318 0v300" strokeWidth="13" />
        <path d="M-20 288L292 -24" strokeWidth="17" />
        {/* Ruas menores, para o quarteirão não ficar grande demais */}
        <path d="M0 108h400M0 200h400M120 0v300M252 0v300" strokeWidth="6" />
      </g>
    </svg>
  );
}
