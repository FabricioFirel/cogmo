
import {
  IconeAgua,
  IconeChuva,
  IconeMonitoramento
} from './Icones'

export default function Resumo({ resumo }) {
  const nivel = resumo?.level_m?.value
  const chuvaAtual = resumo?.rain_mm_h?.value
  const chuvaAcumulada = resumo?.rain_24h_mm

  const formatarValor = (valor, casasDecimais, unidade) => {
    if (valor === null || valor === undefined) {
      return '—'
    }

    if (!Number.isFinite(valor)) {
      return '—'
    }

    return `${valor.toFixed(casasDecimais)} ${unidade}`
  }

  const estiloTitulo = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }

  return (
    <>
      <article className="cartao">
        <span style={estiloTitulo}>
          <IconeAgua tamanho={22} cor="#0284a8" />
          Nível do rio
        </span>

        <strong>
          {formatarValor(nivel, 2, 'm')}
        </strong>
      </article>

      <article className="cartao">
        <span style={estiloTitulo}>
          <IconeChuva tamanho={22} cor="#0284a8" />
          Precipitação atual
        </span>

        <strong>
          {formatarValor(chuvaAtual, 1, 'mm/h')}
        </strong>
      </article>

      <article className="cartao">
        <span style={estiloTitulo}>
          <IconeMonitoramento tamanho={22} cor="#0284a8" />
          Precipitação acumulada (24h)
        </span>

        <strong>
          {formatarValor(chuvaAcumulada, 1, 'mm')}
        </strong>
      </article>
    </>
  )
}
