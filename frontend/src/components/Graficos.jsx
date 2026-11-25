import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const TINTA = '#102c46'
const TINTA_FRACA = '#64748b'
const GRADE = '#e2e8f0'
const SERIE = '#0e7490'
const ALERTA = '#b91c1c'

function horaUtc(iso) {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

function dataHoraUtc(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

function Dica({ active, payload, label, unidade, casas }) {
  if (!active || !payload?.length) return null

  const valor = payload[0].value

  return (
    <div className="dica-grafico">
      <p className="dica-hora">{dataHoraUtc(label)} UTC</p>
      <p className="dica-valor">
        {Number.isFinite(valor)
          ? `${valor.toFixed(casas).replace('.', ',')} ${unidade}`
          : 'Sem leitura'}
      </p>
    </div>
  )
}

export default function Graficos({ leituras = [], nivelAlerta = null }) {
  // O Recharts precisa de null, não de undefined, para deixar o buraco na série.
  const pontos = leituras.map((leitura) => ({
    observed_at: leitura.observed_at,
    level_m: Number.isFinite(leitura.level_m) ? leitura.level_m : null,
    rain_mm_h: Number.isFinite(leitura.rain_mm_h) ? leitura.rain_mm_h : null,
  }))

  const niveis = pontos.map((p) => p.level_m).filter(Number.isFinite)
  const chuvas = pontos.map((p) => p.rain_mm_h).filter(Number.isFinite)
  const invalidas = pontos.filter((p) => p.level_m === null || p.rain_mm_h === null).length

  // O nível do rio não começa no zero: a variação some se o eixo partir da base.
  // Uma folga de 20 cm de cada lado, incluindo a cota de alerta quando ela cabe.
  const limites = [...niveis, ...(nivelAlerta ? [nivelAlerta] : [])]
  const dominioNivel = limites.length
    ? [
        Math.floor((Math.min(...limites) - 0.2) * 10) / 10,
        Math.ceil((Math.max(...limites) + 0.2) * 10) / 10,
      ]
    : [0, 1]

  const eixoX = {
    dataKey: 'observed_at',
    tickFormatter: horaUtc,
    tick: { fill: TINTA_FRACA, fontSize: 12 },
    tickLine: false,
    axisLine: { stroke: GRADE },
    minTickGap: 40,
  }

  return (
    <section className="graficos">
      <h2>Gráficos de Monitoramento</h2>
      <p>Horários em UTC. Passe o cursor sobre o gráfico para ver cada leitura.</p>

      <div className="graficos-container">
        <article className="grafico-card">
          <header className="grafico-topo">
            <h3>Nível do rio</h3>
            <span className="grafico-unidade">metros</span>
          </header>

          {niveis.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={pontos} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
                  <CartesianGrid stroke={GRADE} vertical={false} />
                  <XAxis {...eixoX} />
                  <YAxis
                    domain={dominioNivel}
                    tick={{ fill: TINTA_FRACA, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip
                    content={<Dica unidade="m" casas={2} />}
                    cursor={{ stroke: TINTA_FRACA, strokeDasharray: '3 3' }}
                  />
                  {nivelAlerta && (
                    <ReferenceLine
                      y={nivelAlerta}
                      stroke={ALERTA}
                      strokeDasharray="6 4"
                      label={{
                        value: `Cota de alerta ${nivelAlerta.toFixed(2).replace('.', ',')} m`,
                        position: 'insideTopRight',
                        fill: ALERTA,
                        fontSize: 12,
                      }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="level_m"
                    stroke={SERIE}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              {invalidas > 0 && (
                <p className="grafico-observacao">
                  As falhas na linha são {invalidas} leitura{invalidas > 1 ? 's' : ''} inválida
                  {invalidas > 1 ? 's' : ''} no período.
                </p>
              )}
            </>
          ) : (
            <p className="sem-dados">Aguardando dados do nível do rio.</p>
          )}
        </article>

        <article className="grafico-card">
          <header className="grafico-topo">
            <h3>Precipitação</h3>
            <span className="grafico-unidade">mm/h</span>
          </header>

          {chuvas.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={pontos} margin={{ top: 8, right: 16, bottom: 0, left: -8 }}>
                  <CartesianGrid stroke={GRADE} vertical={false} />
                  <XAxis {...eixoX} />
                  <YAxis
                    tick={{ fill: TINTA_FRACA, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={48}
                  />
                  <Tooltip
                    content={<Dica unidade="mm/h" casas={1} />}
                    cursor={{ fill: '#0e749012' }}
                  />
                  <Bar dataKey="rain_mm_h" fill={SERIE} radius={[4, 4, 0, 0]} maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>

              <p className="grafico-observacao">
                Barra ausente quer dizer 0,0 mm/h — sem chuva naquela hora.
              </p>
            </>
          ) : (
            <p className="sem-dados">Aguardando dados de precipitação.</p>
          )}
        </article>
      </div>
    </section>
  )
}
