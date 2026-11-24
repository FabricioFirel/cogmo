
export default function ListaEstacoes({
  estacoes = [],
  estacaoSelecionada,
  aoSelecionar
}) {
  return (
    <section className="lista-estacoes">
      <h2>Estações de monitoramento</h2>
      <p>Selecione uma estação para visualizar seus dados.</p>

      {estacoes.length === 0 ? (
        <p>Nenhuma estação disponível no momento.</p>
      ) : (
        <div className="estacoes">
          {estacoes.map((estacao) => (
            <button
              key={estacao.id}
              type="button"
              className={
                estacaoSelecionada === estacao.id
                  ? "estacao ativa"
                  : "estacao"
              }
              onClick={() => aoSelecionar?.(estacao.id)}
            >
              <strong>{estacao.name}</strong>
              <span>
                {estacao.river} — {estacao.city}/{estacao.state}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
