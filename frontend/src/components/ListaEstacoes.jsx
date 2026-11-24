
import SeloStatus from './SeloStatus'

export default function ListaEstacoes({
  estacoes = [],
  estacaoSelecionada,
  aoSelecionar
}) {
  return (
    <section className="lista-estacoes">
      <h2>Estações de monitoramento</h2>

      <p>
        Selecione uma estação para visualizar seus dados.
      </p>

      {estacoes.length === 0 ? (
        <p>Nenhuma estação disponível no momento.</p>
      ) : (
        <div className="estacoes">
          {estacoes.map((estacao) => {
            const semLeituras =
              estacao.last_observation_at == null

            const status = semLeituras
              ? 'sem_dados'
              : estacao.status ?? 'sem_dados'

            const localizacao = [
              estacao.city,
              estacao.state
            ].filter(Boolean).join('/')

            return (
              <button
                key={estacao.id}
                type="button"
                className={
                  estacaoSelecionada === estacao.id
                    ? 'estacao ativa'
                    : 'estacao'
                }
                onClick={() => aoSelecionar?.(estacao.id)}
              >
                <strong>{estacao.name}</strong>

                <span>
                  {[estacao.river, localizacao]
                    .filter(Boolean)
                    .join(' — ') || 'Localização não informada'}
                </span>

                <SeloStatus status={status} />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
