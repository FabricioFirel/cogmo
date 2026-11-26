const estacoes = [
  { id: 'EST-001', name: 'Ponte Velha', river: 'Rio Aurora', city: 'Vale Verde', state: 'MG' },
  { id: 'EST-002', name: 'Cachoeira Alta', river: 'Rio Aurora', city: 'Serra Azul', state: 'MG' },
  { id: 'EST-003', name: 'Porto do Sol', river: 'Rio Jaguará', city: 'Campo Belo', state: 'SP' },
]

const fim = Date.UTC(2026, 10, 1, 18)
const hora = 60 * 60 * 1000

function gerarLeituras(horas, indiceEstacao) {
  return Array.from({ length: horas }, (_, indice) => {
    const horasAtras = horas - 1 - indice
    return {
      observed_at: new Date(fim - horasAtras * hora).toISOString(),
      level_m: Number((2 + indiceEstacao * 0.4 + 0.14 * Math.sin(horasAtras / 5)).toFixed(2)),
      rain_mm_h: horasAtras % 9 < 2 ? (1 + horasAtras % 4) * 0.5 : 0,
    }
  })
}

export async function buscarDadosSimulados(caminho, cenario, tentativa = 0) {
  if (cenario === 'espera') await new Promise((resolver) => setTimeout(resolver, 1800))

  const url = new URL(caminho, 'http://localhost')
  if (url.pathname === '/api/stations') {
    return estacoes.map((estacao) => ({ ...estacao, simulated: true }))
  }

  const [, , , id, recurso] = url.pathname.split('/')
  const indiceEstacao = estacoes.findIndex((estacao) => estacao.id === id)
  if (indiceEstacao < 0) throw new Error('Estação indisponível.')

  if (recurso === 'summary') {
    const [leitura] = gerarLeituras(1, indiceEstacao)
    return {
      simulated: true,
      level_m: { value: leitura.level_m, observed_at: leitura.observed_at },
      rain_mm_h: { value: leitura.rain_mm_h, observed_at: leitura.observed_at },
    }
  }

  if (cenario === 'erro' && tentativa === 0) {
    throw new Error('Falha simulada ao carregar o histórico.')
  }

  const horas = Number(url.searchParams.get('hours') ?? 24)
  return {
    simulated: true,
    points: cenario === 'vazio' ? [] : gerarLeituras(horas, indiceEstacao),
  }
}
