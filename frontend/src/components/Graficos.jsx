
function formatarHorario(data) {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  })
}

export default function Graficos({ leituras = [] }) {
  const niveisValidos = leituras
    .map((leitura) => leitura.level_m)
    .filter((nivel) => Number.isFinite(nivel))

  const chuvasValidas = leituras
    .map((leitura) => leitura.rain_mm_h)
    .filter((chuva) => Number.isFinite(chuva))

  const maiorNivel = niveisValidos.length > 0
    ? Math.max(...niveisValidos, 1)
    : 1

  const maiorChuva = chuvasValidas.length > 0
    ? Math.max(...chuvasValidas, 1)
    : 1

  return (
    <section className="graficos">
      <h2>Gráficos de Monitoramento</h2>

      <p>
        Acompanhe as variações do nível do rio
        e da precipitação.
      </p>

      <div className="graficos-container">
        <article className="grafico-card">
          <h3>Nível do Rio (m)</h3>

          {niveisValidos.length > 0 ? (
            <div className="barras-grafico">
              {leituras.map((leitura) => (
                <div
                  className="barra-item"
                  key={leitura.observed_at}
                >
                  <span className="barra-valor">
                    {Number.isFinite(leitura.level_m)
                      ? `${leitura.level_m.toFixed(2)} m`
                      : 'Sem leitura'}
                  </span>

                  <div className="barra-trilha">
                    {Number.isFinite(leitura.level_m) && (
                      <div
                        className="barra-nivel"
                        style={{
                          height: `${
                            (leitura.level_m / maiorNivel) * 100
                          }%`
                        }}
                      />
                    )}
                  </div>

                  <span className="barra-horario">
                    {formatarHorario(leitura.observed_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="sem-dados">
              Aguardando dados do nível do rio.
            </p>
          )}
        </article>

        <article className="grafico-card">
          <h3>Precipitação (mm/h)</h3>

          <p className="grafico-observacao">
            Valores de 0,0 mm/h indicam ausência de chuva no horário.
          </p>

          {chuvasValidas.length > 0 ? (
            <div className="barras-grafico">
              {leituras.map((leitura) => (
                <div
                  className="barra-item"
                  key={leitura.observed_at}
                >
                  <span className="barra-valor">
                    {Number.isFinite(leitura.rain_mm_h)
                      ? `${leitura.rain_mm_h.toFixed(1)} mm/h`
                      : 'Sem leitura'}
                  </span>

                  <div className="barra-trilha">
                    {Number.isFinite(leitura.rain_mm_h) && (
                      <div
                        className="barra-nivel barra-chuva"
                        style={{
                          height: `${
                            (leitura.rain_mm_h / maiorChuva) * 100
                          }%`
                        }}
                      />
                    )}
                  </div>

                  <span className="barra-horario">
                    {formatarHorario(leitura.observed_at)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="sem-dados">
              Aguardando dados de precipitação.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}
