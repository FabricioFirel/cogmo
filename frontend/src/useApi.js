import { useCallback, useEffect, useState } from 'react'

// Guarda os três estados de uma chamada à API: carregando, erro e dados.
// O tentarDeNovo refaz a busca, para o botão de nova tentativa.
export function useApi(funcao, dependencias = []) {
  const [estado, setEstado] = useState({ carregando: true, erro: null, dados: null })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    setEstado((anterior) => ({ ...anterior, carregando: true, erro: null }))

    funcao(tentativa)
      .then((dados) => ativo && setEstado({ carregando: false, erro: null, dados }))
      .catch((erro) => ativo && setEstado({ carregando: false, erro, dados: null }))

    // Se o componente sair da tela antes da resposta, não atualiza mais nada.
    return () => {
      ativo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, tentativa])

  const tentarDeNovo = useCallback(() => setTentativa((anterior) => anterior + 1), [])

  return { ...estado, tentarDeNovo }
}
