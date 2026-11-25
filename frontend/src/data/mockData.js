
export const estacoes = [
  {
    id: 'EST-001',
    name: 'Ponte Velha',
    river: 'Rio Aurora',
    city: 'Vale Verde',
    state: 'MG',
    latitude: -19.912,
    longitude: -43.941,
    alert_level_m: 4.5,
    last_observation_at: '2026-11-11T00:00:00Z',
  },
  {
    id: 'EST-005',
    name: 'EST-005 (sem leituras)',
    river: null,
    city: null,
    state: null,
    latitude: null,
    longitude: null,
    alert_level_m: null,
    last_observation_at: null,
  },
]

export const resumoEstacao = {
  station: estacoes[0],
  last_observation_at: '2026-11-11T00:00:00Z',
  level_m: {
    value: 2.56,
    observed_at: '2026-11-10T23:00:00Z'
  },
  rain_mm_h: {
    value: 0.0,
    observed_at: '2026-11-11T00:00:00Z'
  },
  rain_24h_mm: 1.1,
  level_trend: 'descendo',
  status: 'normal',
  invalid_readings_24h: 1
}

export const serieEstacao = {
  station_id: 'EST-001',
  hours: 3,
  start: '2026-11-10T22:00:00Z',
  end: '2026-11-11T00:00:00Z',
  count: 3,
  points: [
    {
      observed_at: '2026-11-10T22:00:00Z',
      level_m: 2.58,
      rain_mm_h: 0.0
    },
    {
      observed_at: '2026-11-10T23:00:00Z',
      level_m: 2.56,
      rain_mm_h: 0.0
    },
    {
      observed_at: '2026-11-11T00:00:00Z',
      level_m: null,
      rain_mm_h: 0.0
    }
  ]
}

// Cenário de teste: estação sem nenhuma leitura.
export const resumoEstacaoSemDados = {
  station: estacoes[1],
  last_observation_at: null,
  level_m: null,
  rain_mm_h: null,
  rain_24h_mm: null,
  level_trend: null,
  status: 'sem_dados',
  invalid_readings_24h: 0
}

export const serieEstacaoSemDados = {
  station_id: 'EST-005',
  hours: 12,
  start: null,
  end: null,
  count: 0,
  points: []
}