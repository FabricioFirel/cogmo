# Cogmo — Sistema de Monitoramento Hidrológico

API REST desenvolvida em **Python** com **Django** e **Django REST Framework**, acompanhada de um front-end em **React**.

O projeto é a nossa adaptação do desafio proposto pela COGMO. O desafio original foi pensado para Node.js e, como estudo, foi reescrito para a stack Python no back-end.

> **Projeto em fase inicial de desenvolvimento.**

## Sobre o projeto

O sistema reúne leituras de estações hidrológicas fictícias e as disponibiliza por uma API REST. Cada estação registra duas métricas ao longo do tempo:

- **Nível do rio**, em metros (m)
- **Chuva**, em milímetros por hora (mm/h)

O front-end consome essa API e apresenta, para a estação escolhida, o resumo das últimas leituras e gráficos independentes de nível e de chuva, com o histórico alternável entre 12, 24 e 48 horas.

### Aviso sobre os dados

Todos os dados são **sintéticos**, gerados por um script do próprio projeto, e as estações são **fictícias**. Nada aqui serve para fins operacionais, de alerta ou de tomada de decisão reais. Esse aviso também é exibido na interface.

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Python | 3.14 | Linguagem principal |
| Django | 6.1 | Framework web |
| Django REST Framework | 3.18 | Construção da API REST |
| drf-spectacular | 0.30 | Documentação da API (OpenAPI / Swagger / Redoc) |
| django-cors-headers | 4.9 | Liberação de acesso para o front-end (CORS) |
| SQLite | — | Banco de dados de desenvolvimento |
| React | — | Interface do usuário |
| Git & GitHub | — | Controle de versão e colaboração |

A lista completa de dependências do back-end está em [`requirements.txt`](requirements.txt).

## Contrato da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/stations` | Lista as estações disponíveis |
| `GET` | `/api/stations/{id}/summary` | Resumo das últimas leituras da estação |
| `GET` | `/api/stations/{id}/series` | Série histórica da estação, filtrada por uma janela de 1 a 72 horas |

Regras de negócio adotadas:

- Todos os horários são tratados e devolvidos em **UTC**.
- Métricas inválidas ou ausentes são tratadas na resposta, sem quebrar a série.
- As leituras são devolvidas em ordem cronológica.

### Documentação automática

Com o servidor rodando:

| Endereço | Conteúdo |
|---|---|
| `/api/docs/` | Documentação navegável (Swagger UI) |
| `/api/schema/` | Schema OpenAPI |

## Equipe e responsabilidades

| Integrante | Responsabilidade principal | Entregáveis |
|---|---|---|
| **Fabrício Alves** | Liderança técnica e desenvolvimento full-stack | Configuração do repositório, branches, `.gitignore` e dependências; README; revisão de *pull requests* e integração das entregas; script gerador dos dados sintéticos (`observations.csv`); integração da API com a documentação automática; tratamento dos estados da interface (carregamento, erro com nova tentativa e séries vazias) |
| **Elizete Ludmila** | Banco de dados e modelagem | Modelo de dados (MER e DER); models do Django e scripts de migração para o SQLite; carga inicial do banco a partir dos arquivos CSV |
| **Ana Beatriz Vieira** | Front-end (React) | Interface responsiva e acessível (celular e desktop); gráficos independentes de nível (m) e chuva (mm/h); seleção de estações, resumo das últimas leituras e alternância do histórico (12, 24 ou 48 horas) |
| **Claudiane Ribeiro** | Back-end (API REST) | Implementação das rotas do contrato; filtro da janela de 1 a 72 horas; regras de negócio (horários em UTC, tratamento de métricas inválidas e ordenação) |

## Pré-requisitos

- [Python 3.12 ou superior](https://www.python.org/downloads/) (desenvolvido com 3.14)
- [Git](https://git-scm.com/)

## Como rodar o projeto

1. Clone o repositório:

   ```bash
   git clone https://github.com/FabricioFirel/cogmo.git
   cd cogmo
   ```

2. Crie e ative o ambiente virtual:

   **Windows**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

   **Linux / macOS**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```

4. Aplique as migrações do banco de dados:

   ```bash
   python manage.py migrate
   ```

5. Inicie o servidor:

   ```bash
   python manage.py runserver
   ```

   A API ficará disponível em `http://127.0.0.1:8000/`.

## Comandos úteis

| Comando | Descrição |
|---|---|
| `python manage.py createsuperuser` | Cria um usuário administrador |
| `python manage.py makemigrations` | Gera migrações após alterar os models |
| `python manage.py migrate` | Aplica as migrações no banco |
| `python manage.py runserver` | Inicia o servidor de desenvolvimento |

## Entregáveis do desafio

- [ ] Código-fonte organizado em pastas limpas
- [ ] Script Python gerador do `observations.csv`
- [ ] Arquivo de dependências (`requirements.txt`) e scripts de migração
- [ ] Documentação da API (Swagger/Redoc) e do modelo de dados (MER e DER)
- [ ] README detalhado

## Repositório

[github.com/FabricioFirel/cogmo](https://github.com/FabricioFirel/cogmo)
