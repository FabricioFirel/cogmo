
import './App.css'

function App() {
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
            <strong>05</strong>
          </article>

          <article className="cartao">
            <span>Nível do rio</span>
            <strong>2,45 m</strong>
          </article>

          <article className="cartao">
            <span>Precipitação</span>
            <strong>12,5 mm</strong>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App
