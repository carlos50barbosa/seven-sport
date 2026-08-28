'use client';

import { useMemo, useState } from 'react';
import { MockupBoard } from '@/components/ui/MockupBoard';
import {
  categoriasDoCatalogo,
  type CategoriaCatalogo,
  type Uniforme,
} from '@/data/portfolio';

type Filtro = CategoriaCatalogo | 'todos';

/**
 * A grade do catálogo, com filtro por modalidade.
 *
 * Todos os trabalhos vão para o HTML de uma vez, e o filtro só decide o que fica
 * visível. Isso importa por dois motivos: o Google enxerga o catálogo inteiro
 * mesmo com `output: 'export'`, e trocar de filtro é instantâneo, sem ida ao
 * servidor — que é o que o dono precisa mostrando a loja no celular para um
 * cliente na frente dele.
 *
 * Os cards NÃO usam `Reveal`. A animação de entrada depende de o elemento cruzar
 * a viewport uma vez; um item que reaparece por troca de filtro já estaria na
 * tela e nunca dispararia o observer, ficando invisível para sempre. Numa galeria
 * fixa o Reveal é ganho; aqui seria um bug esperando o primeiro clique.
 */
export function CatalogoGrade({ uniformes }: { uniformes: Uniforme[] }) {
  const [filtro, setFiltro] = useState<Filtro>('todos');

  // Só entra no filtro a gaveta que tem trabalho dentro — botão que devolve
  // "nenhum resultado" é ruído, ainda mais no celular, onde a fila já é longa.
  const gavetas = useMemo(() => {
    const contagem = new Map<CategoriaCatalogo, number>();
    for (const u of uniformes) contagem.set(u.categoria, (contagem.get(u.categoria) ?? 0) + 1);
    return categoriasDoCatalogo
      .filter((c) => contagem.has(c.id))
      .map((c) => ({ ...c, quantos: contagem.get(c.id)! }));
  }, [uniformes]);

  const visiveis = filtro === 'todos' ? uniformes : uniformes.filter((u) => u.categoria === filtro);

  const botao = (valor: Filtro, rotulo: string, quantos: number) => {
    const ativo = filtro === valor;
    return (
      <button
        key={valor}
        type="button"
        onClick={() => setFiltro(valor)}
        aria-pressed={ativo}
        className={`shrink-0 rounded-prancha border px-4 py-2 text-[0.9375rem] font-semibold transition-colors ${
          ativo
            ? 'border-verde-forte bg-verde-forte text-white'
            : 'border-carvao/20 bg-white text-carvao-claro hover:border-carvao hover:text-carvao'
        }`}
      >
        {rotulo}
        <span className={`ml-2 text-[0.8125rem] font-normal ${ativo ? 'text-white/70' : 'text-carvao-claro/70'}`}>
          {quantos}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* uma gaveta só não é escolha — o filtro seria decoração */}
      {gavetas.length > 1 && (
        <div
          role="group"
          aria-label="Filtrar por modalidade"
          className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {botao('todos', 'Todos', uniformes.length)}
          {gavetas.map((g) => botao(g.id, g.rotulo, g.quantos))}
        </div>
      )}

      <p aria-live="polite" className="mt-6 text-[0.9375rem] text-carvao-claro">
        {visiveis.length === uniformes.length
          ? `${uniformes.length} ${uniformes.length === 1 ? 'trabalho' : 'trabalhos'} no catálogo`
          : `Mostrando ${visiveis.length} de ${uniformes.length}`}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visiveis.map((uniforme) => (
          <MockupBoard key={uniforme.slug} uniforme={uniforme} tamanho="galeria" />
        ))}
      </div>
    </>
  );
}
