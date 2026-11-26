
const configuracoes = {
  normal: {
    texto: 'Normal',
    cor: '#166534',
    fundo: '#dcfce7'
  },
  atencao: {
    texto: 'Atenção',
    cor: '#92400e',
    fundo: '#fef3c7'
  },
  alerta: {
    texto: 'Alerta',
    cor: '#991b1b',
    fundo: '#fee2e2'
  },
  sem_dados: {
    texto: 'Sem dados',
    cor: '#475569',
    fundo: '#e2e8f0'
  }
}

export default function SeloStatus({ status = 'sem_dados' }) {
  const configuracao =
    configuracoes[status] ?? configuracoes.sem_dados

  return (
    <span
      className={`selo-status selo-${status}`}
      style={{
        display: 'inline-block',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: configuracao.cor,
        backgroundColor: configuracao.fundo
      }}
    >
      {configuracao.texto}
    </span>
  )
}
