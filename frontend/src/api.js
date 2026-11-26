// Conversa com a API do Django. O caminho é relativo de propósito: o proxy
// do Vite repassa tudo que começa com /api para o backend.
import { buscarDadosSimulados } from './mockApi.js'

const BASE = import.meta.env.VITE_API_URL ?? ''
const MODO = import.meta.env.VITE_API_MODE
const CENARIO = import.meta.env.VITE_MOCK_SCENARIO ?? 'normal'

async function pegar(caminho, tentativa = 0) {
  if (MODO === 'mock') return buscarDadosSimulados(caminho, CENARIO, tentativa)

  const resposta = await fetch(`${BASE}${caminho}`)

  if (!resposta.ok) {
    throw new Error(`A API respondeu com erro ${resposta.status}`)
  }

  return resposta.json()
}

export const buscarEstacoes = () => pegar('/api/stations')

export const buscarResumo = (id) =>
  pegar(`/api/stations/${encodeURIComponent(id)}/summary`)

export const buscarSerie = (id, horas, tentativa) =>
  pegar(`/api/stations/${encodeURIComponent(id)}/series?hours=${horas}`, tentativa)
