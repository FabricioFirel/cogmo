
export default function SeletorEstacao({
  estacoes = [],
  estacaoSelecionada = '',
  aoSelecionar
}) {
  return (
    <div className="seletor-estacao">
      <label htmlFor="estacao-monitoramento">
        Estação selecionada:
      </label>

      <select
        id="estacao-monitoramento"
        value={estacaoSelecionada}
        onChange={(evento) =>
          aoSelecionar?.(evento.target.value)
        }
      >
        <option value="">
          Selecione uma estação
        </option>

        {estacoes.map((estacao) => {
          const localizacao = [
            estacao.city,
            estacao.state
          ].filter(Boolean).join('/')

          return (
            <option key={estacao.id} value={estacao.id}>
              {estacao.name}
              {localizacao ? ` — ${localizacao}` : ''}
            </option>
          )
        })}
      </select>
    </div>
  )
}
