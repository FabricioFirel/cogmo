import { useEffect, useState } from 'react'

import ListaEstacoes from './components/ListaEstacoes'
import Graficos from './components/Graficos'
import SeletorJanela from './components/SeletorJanela'
import SeletorEstacao from './components/SeletorEstacao'
import Resumo from './components/Resumo'
import { IconeEstacao } from './components/Icones'
import { Carregando, Erro, Vazio } from './components/Estados'

import { buscarEstacoes, buscarResumo, buscarSerie } from './api'
import { useApi } from './useApi'

import './App.css'

// Busca o resumo de todas as estações só para mostrar a situação na lista.
// Se alguma falhar, a lista continua funcionando, apenas sem o selo daquela.
function useSituacoes(estacoes) {
  const [situacoes, setSituacoes] = useState({})

  useEffect(() => {
    if (!estacoes?.length) return
    let ativo = true

    Promise.allSettled(estacoes.map((estacao) => buscarResumo(estacao.id))).then(
      (resultados) => {
        if (!ativo) return

        const mapa = {}
        resultados.forEach((resultado, i) => {
          if (resultado.status === 'fulfilled') {
            mapa[estacoes[i].id] = resultado.value.status
          }
        })
        setSituacoes(mapa)
      },
    )

    return () => {
      ativo = false
    }
  }, [estacoes])

  return situacoes
}

function App() {
  const [estacaoSelecionada, setEstacaoSelecionada] = useState('')
  const [periodoSelecionado, setPeriodoSelecionado] = useState(12)

  const listagem = useApi(buscarEstacoes, [])
  const estacoes = listagem.dados ?? []
  const situacoes = useSituacoes(listagem.dados)

  // Seleciona a primeira estação assim que a lista chega, para a tela
  // nunca abrir sem nada selecionado.
  useEffect(() => {
    const lista = listagem.dados
    if (lista?.length && !estacaoSelecionada) {
      setEstacaoSelecionada(lista[0].id)
    }
  }, [listagem.dados, estacaoSelecionada])

  const resumo = useApi(
    () =>
      estacaoSelecionada
        ? buscarResumo(estacaoSelecionada)
        : Promise.resolve(null),
    [estacaoSelecionada],
  )

  const serie = useApi(
    () =>
      estacaoSelecionada
        ? buscarSerie(estacaoSelecionada, periodoSelecionado)
        : Promise.resolve(null),
    [estacaoSelecionada, periodoSelecionado],
  )

  const resumoAtual = resumo.dados
  // A API já devolve só a janela pedida, então não precisa filtrar aqui.
  const leituras = serie.dados?.points ?? []
  const semLeituras = resumoAtual?.status === 'sem_dados'

  const estacoesComStatus = estacoes.map((estacao) => ({
    ...estacao,
    status: situacoes[estacao.id] ?? 'sem_dados',
  }))

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

        {listagem.carregando && (
          <Carregando texto="Carregando estações…" altura={260} />
        )}

        {listagem.erro && (
          <Erro
            erro={listagem.erro}
            aoTentarDeNovo={listagem.tentarDeNovo}
            titulo="Não foi possível conectar à API"
          />
        )}

        {listagem.dados && estacoes.length === 0 && (
          <Vazio
            titulo="Nenhuma estação cadastrada"
            texto="Rode python manage.py load_csv na pasta backend para popular o banco."
          />
        )}

        {estacoes.length > 0 && (
          <>
            <div className="cartoes">
              <article className="cartao">
                <span>
                  <IconeEstacao tamanho={22} cor="#0284a8" />
                  Estações monitoradas
                </span>

                <strong>{estacoes.length}</strong>
              </article>

              {resumo.carregando ? (
                <Carregando texto="Carregando resumo…" altura={120} />
              ) : (
                <Resumo resumo={resumoAtual} />
              )}
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

            {serie.erro ? (
              <Erro
                erro={serie.erro}
                aoTentarDeNovo={serie.tentarDeNovo}
                titulo="Não foi possível carregar as leituras"
              />
            ) : serie.carregando ? (
              <Carregando texto="Carregando leituras…" altura={260} />
            ) : semLeituras || leituras.length === 0 ? (
              <Vazio
                titulo="Sem leituras disponíveis"
                texto="Esta estação ainda não possui registros de nível do rio ou precipitação."
              />
            ) : (
              <Graficos leituras={leituras} />
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default App
