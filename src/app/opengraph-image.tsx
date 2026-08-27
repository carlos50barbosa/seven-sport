import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const alt = `${site.nome} — uniformes esportivos personalizados em ${site.endereco.cidade}/${site.endereco.estado}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * OG image: a Prancha de Mockup sobre o verde escuro da marca.
 * Gerada em build — nenhuma requisição externa em runtime.
 */
export default function OpenGraphImage() {
  const listras = [0, 1, 2, 3, 4];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(160deg, #0A2E16 0%, #061A0D 100%)',
          color: '#FFFFFF',
          padding: 64,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', width: 44, height: 6, background: '#1B8F3A' }} />
            <div style={{ display: 'flex', width: 26, height: 6, background: '#E1251B' }} />
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                letterSpacing: 6,
                color: '#C9A24A',
                fontWeight: 700,
              }}
            >
              SEVEN SPORT
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 74,
              lineHeight: 1.02,
              fontWeight: 800,
              marginTop: 30,
              letterSpacing: -2,
            }}
          >
            UNIFORME DO SEU TIME, DO JEITO QUE VOCÊ DESENHOU
          </div>

          <div style={{ display: 'flex', fontSize: 27, color: '#C7D5CB', marginTop: 26 }}>
            Camisa, shorts e meião personalizados · Arte digital antes de produzir
          </div>

          <div style={{ display: 'flex', fontSize: 24, color: '#8FA894', marginTop: 34 }}>
            {site.endereco.cidade}/{site.endereco.estado} · {site.telefone.formatado}
          </div>
        </div>

        {/* prancha de mockup reduzida */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: 340,
            height: 440,
            background: '#FFFFFF',
            padding: 24,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 14,
              top: 14,
              width: 30,
              height: 30,
              borderLeft: '4px solid #1B8F3A',
              borderTop: '4px solid #1B8F3A',
              display: 'flex',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 14,
              bottom: 84,
              width: 30,
              height: 30,
              borderRight: '4px solid #E1251B',
              borderBottom: '4px solid #E1251B',
              display: 'flex',
            }}
          />

          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {/* camisa listrada */}
            <div style={{ display: 'flex', width: 200, height: 190, background: '#F4F5F3' }}>
              {listras.map((n) => (
                <div
                  key={n}
                  style={{
                    display: 'flex',
                    width: 20,
                    height: '100%',
                    marginLeft: n === 0 ? 10 : 20,
                    background: '#1B8F3A',
                  }}
                />
              ))}
            </div>
            {/* calção */}
            <div style={{ display: 'flex', width: 150, height: 78, background: '#1B8F3A' }} />
          </div>

          <div
            style={{
              display: 'flex',
              borderTop: '1px solid rgba(20,24,27,.12)',
              paddingTop: 16,
              fontSize: 30,
              fontWeight: 800,
              color: '#14181B',
              letterSpacing: -0.5,
            }}
          >
            SEU TIME AQUI
          </div>
        </div>
      </div>
    ),
    size,
  );
}
