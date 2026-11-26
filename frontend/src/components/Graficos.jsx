import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

const horaUtc = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
})
const numero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

function formatarHora(iso) {
  return horaUtc.format(new Date(iso)).replace(', ', ' ')
}

function Grafico({ leituras, metrica, titulo, unidade, cor, barras }) {
  const Chart = barras ? BarChart : AreaChart
  const temDados = leituras.some((leitura) => Number.isFinite(leitura[metrica]))
  const primeira = leituras[0]?.observed_at
  const ultima = leituras.at(-1)?.observed_at

  return (
    <article className="grafico">
      <h3><span style={{ backgroundColor: cor }} />{titulo} <small>{unidade}</small></h3>
      {temDados ? (
        <div className="grafico-area">
          <ResponsiveContainer width="100%" height="100%">
            <Chart data={leituras} margin={{ top: 8, right: 16, bottom: 0, left: 0 }} accessibilityLayer>
              {!barras && (
                <defs><linearGradient id="nivel" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={cor} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={cor} stopOpacity={0.02} />
                </linearGradient></defs>
              )}
              <CartesianGrid vertical={false} stroke="#e5eef6" />
              <XAxis dataKey="observed_at" tickFormatter={formatarHora} minTickGap={30}
                tick={{ fill: '#4a6680', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis width={36} tickCount={4} tickFormatter={(valor) => numero.format(valor)}
                tick={{ fill: '#4a6680', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip labelFormatter={(iso) => formatarHora(iso) + ' UTC'} filterNull={false}
                formatter={(valor) => [Number.isFinite(valor) ? numero.format(valor) + ' ' + unidade : 'Sem leitura', titulo]} />
              {barras ? (
                <Bar dataKey={metrica} fill={cor} maxBarSize={20} radius={[4, 4, 0, 0]} isAnimationActive={false} />
              ) : (
                <Area dataKey={metrica} stroke={cor} strokeWidth={2.5} fill="url(#nivel)"
                  connectNulls={false} dot={{ r: 2 }} isAnimationActive={false} />
              )}
            </Chart>
          </ResponsiveContainer>
        </div>
      ) : <p className="grafico-vazio">Sem leituras válidas para esta métrica.</p>}
      {temDados && <p className="grafico-periodo">{formatarHora(primeira)} – {formatarHora(ultima)} UTC</p>}
    </article>
  )
}

export default function Graficos({ leituras }) {
  const horaEmMilissegundos = 60 * 60 * 1000
  const pontos = []

  for (const leitura of leituras) {
    const anterior = pontos.at(-1)
    if (anterior) {
      const atual = Date.parse(leitura.observed_at)
      let ausente = Date.parse(anterior.observed_at) + horaEmMilissegundos
      while (ausente < atual) {
        // O horário fica visível no gráfico, sem atribuir um valor à lacuna.
        pontos.push({ observed_at: new Date(ausente).toISOString(), level_m: null, rain_mm_h: null })
        ausente += horaEmMilissegundos
      }
    }
    pontos.push(leitura)
  }

  return (
    <div className="graficos">
      <Grafico leituras={pontos} metrica="level_m" titulo="Nível do rio" unidade="m" cor="#1478dc" />
      <Grafico leituras={pontos} metrica="rain_mm_h" titulo="Precipitação" unidade="mm/h" cor="#159395" barras />
    </div>
  )
}
