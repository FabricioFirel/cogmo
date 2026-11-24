
export default function SeletorJanela({
  periodoSelecionado = 3,
  aoAlterarPeriodo
}) {
  const periodos = [3, 12, 24]

  return (
    <div className="seletor-janela">
      <label htmlFor="periodo-monitoramento">
        Período de monitoramento:
      </label>

      <select
        id="periodo-monitoramento"
        value={periodoSelecionado}
        onChange={(evento) =>
          aoAlterarPeriodo?.(Number(evento.target.value))
        }
      >
        {periodos.map((periodo) => (
          <option key={periodo} value={periodo}>
            Últimas {periodo} horas
          </option>
        ))}
      </select>
    </div>
  )
}