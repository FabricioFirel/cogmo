
function IconeBase({
  children,
  tamanho = 24,
  cor = 'currentColor',
  className = ''
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke={cor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function IconeAgua(props) {
  return (
    <IconeBase {...props}>
      <path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z" />
      <path d="M9 16a3 3 0 0 0 3 3" />
    </IconeBase>
  )
}

export function IconeChuva(props) {
  return (
    <IconeBase {...props}>
      <path d="M20 16.5a4.5 4.5 0 0 0-1.5-8.7A6 6 0 0 0 7 9a4 4 0 0 0-1 7.5" />
      <path d="m8 18-1 3" />
      <path d="m13 18-1 3" />
      <path d="m18 18-1 3" />
    </IconeBase>
  )
}

export function IconeEstacao(props) {
  return (
    <IconeBase {...props}>
      <path d="M12 21V10" />
      <path d="M8 21h8" />
      <circle cx="12" cy="7" r="3" />
      <path d="M5 4a10 10 0 0 0 0 6" />
      <path d="M19 4a10 10 0 0 1 0 6" />
    </IconeBase>
  )
}

export function IconeMonitoramento(props) {
  return (
    <IconeBase {...props}>
      <path d="M3 3v18h18" />
      <path d="m6 16 4-5 4 3 5-8" />
    </IconeBase>
  )
}

export function IconeAlerta(props) {
  return (
    <IconeBase {...props}>
      <path d="m12 3 10 18H2L12 3Z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </IconeBase>
  )
}