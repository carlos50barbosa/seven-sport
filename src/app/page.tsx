import { Hero } from '@/components/sections/Hero';
import { Servicos } from '@/components/sections/Servicos';
import { Galeria } from '@/components/sections/Galeria';
import { Processo } from '@/components/sections/Processo';
import { Diferenciais } from '@/components/sections/Diferenciais';
import { Orcamento } from '@/components/sections/Orcamento';
import { Localizacao } from '@/components/sections/Localizacao';

export default function Home() {
  return (
    <>
      <Hero />
      <Servicos />
      <Galeria />
      <Processo />
      <Diferenciais />
      <Orcamento />
      <Localizacao />
    </>
  );
}
