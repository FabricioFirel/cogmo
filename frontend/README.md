# Cogmo — frontend

Este diretório pode substituir o `frontend/` da branch `develop` do Cogmo. Mantenha o backend Django do projeto.

Com o backend já configurado, execute na raiz do repositório:

```powershell
python backend/manage.py migrate
python backend/manage.py load_csv
python backend/manage.py runserver
```

Em outro terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Abra o endereço apresentado pelo Vite. O servidor de desenvolvimento envia as chamadas `/api` ao Django em `http://127.0.0.1:8000`. Configure `API_PROXY_TARGET` em `.env.local` para apontar para outro servidor local. Em produção, disponibilize a API na mesma origem ou defina `VITE_API_URL` no build e configure o CORS no backend.

No painel, a janela de 12, 24 ou 48 horas termina na última leitura da estação, conforme o contrato da API. O painel apresenta horários em UTC e usa a última leitura válida de cada métrica no resumo.

## Demonstração sem o Django

Crie o arquivo `.env.local` na pasta `frontend` com as duas linhas abaixo e reinicie o Vite.

```dotenv
VITE_API_MODE=mock
VITE_MOCK_SCENARIO=normal
```

| Cenário | O que aparece |
| --- | --- |
| `normal` | Três estações, resumo e gráficos |
| `espera` | Indicadores de carregamento antes dos dados |
| `erro` | O histórico falha na primeira tentativa e carrega ao clicar em **Tentar de novo** |
| `vazio` | A estação tem resumo, mas não há leituras no histórico |

Para voltar ao Django, use `VITE_API_MODE=real` ou remova as duas variáveis.
