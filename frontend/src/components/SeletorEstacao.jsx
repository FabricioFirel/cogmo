
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

        {estacoes.map((estacao) => (
          <option key={estacao.id} value={estacao.id}>
            {estacao.name} — {estacao.city}/{estacao.state}
          </option>
        ))}
      </select>
    </div>
  )
}
