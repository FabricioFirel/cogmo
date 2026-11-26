# Contrato da API

Base: `http://127.0.0.1:8000/api`. Todas as datas são **UTC**, no formato ISO 8601 com `Z`
(ex.: `2026-11-03T18:00:00Z`). A documentação interativa fica em `/api/docs/` (Swagger) e
`/api/redoc/` (Redoc).

As três rotas de dados incluem o cabeçalho `X-Data-Source: synthetic`, inclusive nas respostas de erro dessas rotas. As respostas de sucesso também indicam `"simulated": true` no JSON. A listagem indica esse campo em cada estação.

## GET /api/stations

Lista as estações, em ordem de código.

```json
[
  {
    "id": "EST-001",
    "simulated": true,
    "name": "Ponte Velha",
    "river": "Rio Aurora",
    "city": "Vale Verde",
    "state": "MG",
    "last_observation_at": "2026-11-03T18:00:00Z"
  }
]
```

`last_observation_at` é `null` quando a estação não tem leituras.

## GET /api/stations/{id}/summary

Resumo das últimas leituras. Se a leitura mais recente de uma métrica for inválida, vem a última válida.

```json
{
  "simulated": true,
  "station": { "...": "mesmos campos de /stations" },
  "last_observation_at": "2026-11-03T18:00:00Z",
  "level_m": { "value": 2.56, "observed_at": "2026-11-03T17:00:00Z" },
  "rain_mm_h": { "value": 0.0, "observed_at": "2026-11-03T18:00:00Z" }
}
```

## GET /api/stations/{id}/series

| parâmetro | valores | padrão |
|---|---|---|
| `hours` | inteiro de **1 a 72** | 24 |
| `metric` | `all`, `level`, `rain` (também aceita `level_m` e `rain_mm_h`) | `all` |
| `order` | `asc` (mais antiga primeiro) ou `desc` | `asc` |

A janela termina na **última leitura da estação** e volta `hours` horas (como os dados são
sintéticos, isso evita série vazia só porque o seed foi rodado em outro dia).

```json
{
  "simulated": true,
  "station_id": "EST-001",
  "hours": 24,
  "metric": "all",
  "order": "asc",
  "start": "2026-11-02T19:00:00Z",
  "end": "2026-11-03T18:00:00Z",
  "count": 24,
  "points": [
    { "observed_at": "2026-11-02T19:00:00Z", "level_m": 4.41, "rain_mm_h": 0.0 },
    { "observed_at": "2026-11-02T20:00:00Z", "level_m": null, "rain_mm_h": 0.0 }
  ]
}
```

- `metric=level` retorna `level_m` em metros. `metric=rain` retorna `rain_mm_h` em milímetros por hora.
- Leitura inválida vem como `null` no ponto, sem remover a hora da série.
- Quando nenhuma métrica tem registro em um horário, a API não cria um ponto.
- Estação sem leituras: `200` com `"points": []`.

## Erros

| situação | resposta |
|---|---|
| estação não existe | `404` `{"detail": "No Station matches the given query."}` |
| `hours` fora de 1–72 ou não numérico | `400` `{"hours": ["..."]}` |
| `metric` ou `order` inválidos | `400` com o campo e a mensagem |
