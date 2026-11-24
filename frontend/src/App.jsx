
import { useState } from 'react'

import ListaEstacoes from './components/ListaEstacoes'
import Graficos from './components/Graficos'
import SeletorJanela from './components/SeletorJanela'
import SeletorEstacao from './components/SeletorEstacao'
import Resumo from './components/Resumo'
import { IconeEstacao } from './components/Icones'
import { Vazio } from './components/Estados'

import {
  estacoes,
  resumoEstacao,
  serieEstacao,
  resumoEstacaoSemDados,
  serieEstacaoSemDados
} from './data/mockData'

import './App.css'

function App() {
  const [estacaoSelecionada, setEstacaoSelecionada] = useState(
    estacoes[0]?.id ?? ''
  )

  const [periodoSelecionado, setPeriodoSelecionado] = useState(12)

  const resumos = {
    'EST-001': resumoEstacao,
    'EST-005': resumoEstacaoSemDados
  }

  const series = {
    'EST-001': serieEstacao,
    'EST-005': serieEstacaoSemDados
  }

  const resumoAtual = resumos[estacaoSelecionada] ?? null
  const serieAtual = series[estacaoSelecionada] ?? null

  const semLeituras = resumoAtual?.status === 'sem_dados'

  const estacoesComStatus = estacoes.map((estacao) => ({
    ...estacao,
    status: resumos[estacao.id]?.status ?? 'sem_dados'
  }))

  // Mostra somente as leituras de exemplo existentes.
  const leituras = serieAtual?.points?.filter((leitura) => {
    const horario = new Date(leitura.observed_at).getTime()
    const fim = new Date(serieAtual.end).getTime()

    if (!Number.isFinite(horario) || !Number.isFinite(fim)) {
      return false
    }

    const inicio = fim - periodoSelecionado * 60 * 60 * 1000

    return horario >= inicio && horario <= fim
  }) ?? []

  return (
    <main className="app">
      <header className="cabecalho">
        <div>
          <h1>COGMO</h1>
          <p>Monitoramento Ambiental</p>
        </div>

        <span className="status-sistema">
          Sistema de monitoramento
        </span>
      </header>

      <section className="conteudo">
        <h2>Painel de Monitoramento</h2>

        <p>
          Acompanhe os níveis dos rios e os índices de
          precipitação das estações.
        </p>

        {/* Quatro cartões no mesmo grupo */}
        <div className="cartoes">
          <article className="cartao">
            <span>
              <IconeEstacao tamanho={22} cor="#0284a8" />
              Estações monitoradas
            </span>

            <strong>{estacoes.length}</strong>
          </article>

          <Resumo resumo={resumoAtual} />
        </div>

        <ListaEstacoes
          estacoes={estacoesComStatus}
          estacaoSelecionada={estacaoSelecionada}
          aoSelecionar={setEstacaoSelecionada}
        />

        <SeletorEstacao
          estacoes={estacoes}
          estacaoSelecionada={estacaoSelecionada}
          aoSelecionar={setEstacaoSelecionada}
        />

        <SeletorJanela
          periodoSelecionado={periodoSelecionado}
          aoAlterarPeriodo={setPeriodoSelecionado}
        />

        {semLeituras ? (
          <Vazio
            titulo="Sem leituras disponíveis"
            texto="Esta estação ainda não possui registros de nível do rio ou precipitação."
          />
        ) : (
          <>
            {leituras.length > 0 && (
              <p className="aviso-periodo">
                Exibindo apenas as leituras de exemplo disponíveis.
                O período completo ainda não possui dados.
              </p>
            )}

            <Graficos leituras={leituras} />
          </>
        )}
      </section>
    </main>
  )
}

export default App
