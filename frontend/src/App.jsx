import { useState } from 'react'
import { buscarEstacoes, buscarResumo, buscarSerie } from './api'
import { useApi } from './useApi'
import { Carregando, Erro, Vazio } from './components/Estados'
import { IconeAgua, IconeChuva, IconeEstacao, IconeMonitoramento } from './components/Icones'
import Graficos from './components/Graficos'
import './App.css'

const periodos = [12, 24, 48]
const dataUtc = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
})

function Leitura({ leitura, unidade, precisao }) {
  const valor = leitura?.value
  return (
    <>
      <div className="leitura">
        <strong>{Number.isFinite(valor) ? valor.toLocaleString('pt-BR', {
          minimumFractionDigits: precisao, maximumFractionDigits: precisao,
        }) : '—'}</strong>
        <span>{unidade}</span>
      </div>
      {leitura?.observed_at && (
        <time dateTime={leitura.observed_at}>{dataUtc.format(new Date(leitura.observed_at))} UTC</time>
      )}
    </>
  )
}

function Resumo({ estacao }) {
  const resumo = useApi(() => buscarResumo(estacao.id), [estacao.id])
  const dados = resumo.dados

  return (
    <aside className="resumo" aria-label="Últimas leituras">
      <div className="rotulo"><IconeEstacao tamanho={17} /> Estação selecionada</div>
      <h2>{estacao.name}</h2>
      <p className="local">{[estacao.river, [estacao.city, estacao.state].filter(Boolean).join(' – ')].filter(Boolean).join(' · ')}</p>

      {resumo.carregando ? <Carregando texto="Carregando resumo…" altura={180} />
        : resumo.erro ? <Erro erro={resumo.erro} titulo="Resumo indisponível" aoTentarDeNovo={resumo.tentarDeNovo} />
        : (
          <>
            <article className="nivel-atual">
              <div className="rotulo"><IconeAgua tamanho={20} /> Nível do rio</div>
              <Leitura leitura={dados?.level_m} unidade="m" precisao={2} />
            </article>
            <article className="chuva-atual">
              <div className="rotulo"><IconeChuva tamanho={20} /> Chuva atual</div>
              <Leitura leitura={dados?.rain_mm_h} unidade="mm/h" precisao={1} />
            </article>
          </>
        )}
    </aside>
  )
}

function Historico({ id, horas }) {
  const serie = useApi((tentativa) => buscarSerie(id, horas, tentativa), [id, horas])

  if (serie.carregando) return <Carregando texto="Carregando histórico…" altura={280} />
  if (serie.erro) return <Erro erro={serie.erro} titulo="Histórico indisponível" aoTentarDeNovo={serie.tentarDeNovo} />
  if (!serie.dados?.points.length) return <Vazio titulo="Sem leituras no período" />
  return <Graficos leituras={serie.dados.points} />
}

export default function App() {
  const [id, selecionar] = useState('')
  const [horas, definirHoras] = useState(12)
  const lista = useApi(buscarEstacoes, [])
  const estacoes = lista.dados ?? []
  const estacao = estacoes.find((item) => item.id === id) ?? estacoes[0]

  return (
    <main className="app">
      <header className="marca">
        <span className="marca-icone"><IconeAgua tamanho={22} /></span>
        <span>Cogmo</span>
        <span className="marca-contexto">Monitoramento hidrológico</span>
      </header>

      <div className="cabecalho">
        <h1>Painel de estações</h1>
        {estacao && (
          <div className="seletor">
            <label htmlFor="estacao">Estação</label>
            <select id="estacao" value={estacao.id} onChange={(event) => selecionar(event.target.value)}>
              {estacoes.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.id}</option>)}
            </select>
          </div>
        )}
      </div>

      {lista.carregando ? <Carregando texto="Carregando estações…" altura={280} />
        : lista.erro ? <Erro erro={lista.erro} titulo="Estações indisponíveis" aoTentarDeNovo={lista.tentarDeNovo} />
        : !estacao ? <Vazio titulo="Nenhuma estação cadastrada" />
        : (
          <div className="painel">
            <Resumo key={estacao.id} estacao={estacao} />
            <section className="historico" aria-labelledby="titulo-historico">
              <header className="historico-cabecalho">
                <h2 id="titulo-historico"><IconeMonitoramento tamanho={19} /> Histórico</h2>
                <div className="periodos" role="group" aria-label="Período do histórico">
                  {periodos.map((periodo) => (
                    <button key={periodo} type="button" aria-pressed={horas === periodo}
                      onClick={() => definirHoras(periodo)}>{periodo} h</button>
                  ))}
                </div>
              </header>
              <Historico key={estacao.id + ':' + horas} id={estacao.id} horas={horas} />
            </section>
          </div>
        )}

      <footer>Estações fictícias e dados simulados. Uso exclusivamente demonstrativo.</footer>
    </main>
  )
}
