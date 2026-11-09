# Work Orders System

API REST para gerenciamento de ordens de serviço, construída com Node.js, TypeScript, Fastify, Drizzle ORM e PostgreSQL. O Docker Compose inicia o banco e a API; as migrations do Drizzle são executadas automaticamente antes da API.

## Requisitos

- Docker Desktop com Docker Compose v2
- Git, caso vá clonar o repositório

## Configuração

Na raiz do projeto, crie o arquivo `.env` a partir do exemplo.

O `.env.example` contém valores para desenvolvimento local. Altere `DB_PASSWORD` se necessário e verifique se as portas `3000` e `5432` estão disponíveis.

`DB_HOST=db` é o nome do serviço PostgreSQL dentro da rede do Docker Compose. Mantenha esse valor ao executar a API pelos containers. `DB_EXTERNAL_PORT` é a porta para conectar ao PostgreSQL a partir da máquina host.

## Subir a aplicação

Execute os comandos a partir da raiz do projeto, onde está `docker-compose.yml`:

```bash
docker compose up -d --build
```

Na primeira execução, o Compose baixa as imagens, instala as dependências e compila a API. Em seguida, espera o PostgreSQL ficar saudável, aplica as migrations e inicia a API.

Confira os containers:

```bash
docker compose ps
```

Consulte os logs:

```bash
docker compose logs -f api
docker compose logs -f db
```

A API fica disponível em `http://localhost:3000`. Verifique o health check:

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:

```json
{"status":"ok"}
```

## Popular o banco com dados de teste

O arquivo [`backend/src/db/seed.ts`](backend/src/db/seed.ts) cria dados fictícios para testar os endpoints. O seed não é executado automaticamente quando a aplicação sobe. Para executá-lo:

```bash
docker compose --profile tools run --rm seed
```

O seed cria:

- 100 usuários: 50 com papel `CLIENT` e 50 com papel `EMPLOYEE`;
- 50 clientes e 50 funcionários, cada perfil ligado ao seu usuário;
- 50 ordens de serviço, distribuídas entre os status e prioridades disponíveis;
- duas ordens pendentes excluídas logicamente, para testar esse comportamento.

Os usuários do seed recebem o valor `seed-only-placeholder` no campo de senha. São dados de teste e não representam senhas válidas para autenticação.

O seed usa emails fixos, como `seed.client01@example.com`. Por isso, execute-o apenas uma vez em um banco vazio. Uma segunda execução encontrará conflitos de unicidade. O script não apaga nem limpa dados existentes.

## Endpoints principais

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/api/health` | Verifica se a API está disponível |
| `POST` | `/api/users` | Cria um usuário |
| `GET` | `/api/users` | Lista usuários paginados |
| `GET` | `/api/users/:id` | Busca usuário por ID |
| `PATCH` | `/api/users/:id` | Atualiza email e/ou senha |
| `DELETE` | `/api/users/:id` | Desativa o usuário logicamente |
| `GET` | `/api/clients` | Lista clientes paginados |
| `GET` | `/api/clients/:id` | Busca cliente por ID |
| `PATCH` | `/api/clients/:id` | Atualiza cliente |
| `POST` | `/api/employees` | Cria funcionário ligado a usuário existente |
| `GET` | `/api/employees` | Lista funcionários paginados |
| `GET` | `/api/employees/:id` | Busca funcionário por ID |
| `PATCH` | `/api/employees/:id` | Atualiza funcionário |
| `DELETE` | `/api/employees/:id` | Desativa funcionário logicamente |
| `POST` | `/api/orders` | Cria ordem de serviço |
| `GET` | `/api/orders` | Lista ordens paginadas, com filtros e ordenação |
| `GET` | `/api/orders/:id` | Busca ordem por ID |
| `GET` | `/api/orders/client/:id` | Lista ordens de um cliente |
| `PATCH` | `/api/orders/:id` | Atualiza ordem pendente |
| `DELETE` | `/api/orders/:id` | Exclui ordem pendente logicamente |
| `POST` | `/api/orders/:id/process` | Processa ordem pendente |
| `POST` | `/api/orders/:id/cancel` | Cancela ordem pendente |

As listagens aceitam `page`, por exemplo `GET /api/orders?page=2`. A listagem de ordens também aceita os filtros `status` e `priority` e o parâmetro `orderBy` (`createdAt`, `updatedAt`, `priority` ou `status`). A ordenação é descendente e usa `createdAt` quando `orderBy` não é informado.

## Parar os containers

```bash
docker compose down
```

Esse comando mantém os dados do volume `postgres_data`. Para remover também o banco persistido e começar com um banco vazio:

```bash
docker compose down -v
```

**Atenção:** `docker compose down -v` apaga os dados armazenados no PostgreSQL. Depois de recriar os containers, rode o seed novamente se precisar dos dados de teste.

## Estrutura

```text
backend/
  drizzle/       Migrations SQL do banco
  src/
    db/           Schema, conexão e seed
    modules/      Rotas, serviços, repositories e schemas de validação
docker-compose.yml
.env.example
```

## Banco de dados

Segue o link com a representação visual do banco de dados, campos e suas relações

https://dbdiagram.io/d/6ae3a08ced134e407e468aad