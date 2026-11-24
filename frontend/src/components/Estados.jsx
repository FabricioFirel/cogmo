// Os três estados que toda tela que busca dados precisa tratar:
// esperando a resposta, falha na busca e resposta sem conteúdo.

export function Carregando({ texto = 'Carregando…', altura = 200 }) {
  return (
    <div className="estado" style={{ minHeight: altura }} role="status" aria-live="polite">
      <span className="estado-girando" aria-hidden="true" />
      <p>{texto}</p>
    </div>
  )
}

export function Erro({ erro, aoTentarDeNovo, titulo = 'Não foi possível carregar' }) {
  return (
    <div className="estado estado-erro" role="alert">
      <strong>{titulo}</strong>
      <p>{erro?.message ?? 'Verifique se a API está rodando e tente de novo.'}</p>
      {aoTentarDeNovo && (
        <button type="button" className="estado-botao" onClick={aoTentarDeNovo}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export function Vazio({ titulo = 'Sem dados para mostrar', texto }) {
  return (
    <div className="estado">
      <strong>{titulo}</strong>
      {texto && <p>{texto}</p>}
    </div>
  )
}
