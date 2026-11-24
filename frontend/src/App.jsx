
import { useState } from 'react'
import ListaEstacoes from './components/ListaEstacoes'
import Graficos from './components/Graficos'
import SeletorJanela from './components/SeletorJanela'
import SeletorEstacao from './components/SeletorEstacao'
import { estacoes, resumoEstacao, serieEstacao } from './data/mockData'
import './App.css'

function App() {
  const [estacaoSelecionada, setEstacaoSelecionada] = useState(
    estacoes[0]?.id ?? ''
  )

  const [periodoSelecionado, setPeriodoSelecionado] = useState(3)

  // Os dados de exemplo pertencem somente à estação EST-001.
  const possuiResumo =
    estacaoSelecionada === resumoEstacao.station.id

  const possuiSerie =
    estacaoSelecionada === serieEstacao.station_id &&
    periodoSelecionado === serieEstacao.hours

  const resumoAtual = possuiResumo ? resumoEstacao : null
  const leituras = possuiSerie ? serieEstacao.points : []

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
          Acompanhe os níveis dos rios e os índices
          de precipitação das estações.
        </p>

        <div className="cartoes">
          <article className="cartao">
            <span>Estações monitoradas</span>
            <strong>{estacoes.length}</strong>
          </article>

          <article className="cartao">
            <span>Nível do rio</span>
            <strong>
              {resumoAtual?.level_m?.value != null
                ? `${resumoAtual.level_m.value.toFixed(2)} m`
                : '—'}
            </strong>
          </article>

          <article className="cartao">
            <span>Precipitação</span>
            <strong>
              {resumoAtual?.rain_mm_h?.value != null
                ? `${resumoAtual.rain_mm_h.value.toFixed(1)} mm/h`
                : '—'}
            </strong>
          </article>
        </div>

        <ListaEstacoes
          estacoes={estacoes}
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

        {!possuiSerie && (
          <p className="aviso-periodo">
            Ainda não temos dados de exemplo para esta
            estação no período selecionado.
          </p>
        )}

        <Graficos leituras={leituras} />
      </section>
    </main>
  )
}

export default App
