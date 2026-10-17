# Drivo

Aplicação web para gerenciamento de veículos, com autenticação de usuários e extração de informações de documentos CRLV por meio de inteligência artificial.

## Funcionalidades

- Cadastro e autenticação de usuários.
- Autenticação baseada em JWT (JSON Web Token).
- Consulta do perfil do usuário autenticado.
- Alteração de senha.
- Cadastro, listagem, consulta, atualização e exclusão de veículos.
- Extração de informações de documentos CRLV por meio da API do Google Gemini.
- Validação dos dados de entrada.
- Persistência de dados em PostgreSQL com Prisma ORM.
- Testes automatizados unitários e end-to-end.
- Execução dos serviços com Docker Compose.

## Tecnologias utilizadas

### Frontend

- Next.js
- React
- TypeScript

### Backend

- Node.js
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Jest
- Google Gemini API

### Infraestrutura

- Docker
- Docker Compose

## Arquitetura

O projeto é composto por três componentes principais:

- **Frontend:** interface web desenvolvida com Next.js e React.
- **Backend:** API REST desenvolvida com NestJS, responsável pela autenticação, pelas regras de negócio e pelo acesso aos dados.
- **Banco de dados:** PostgreSQL, acessado pelo backend por meio do Prisma ORM.

O Docker Compose coordena a inicialização dos serviços e facilita a execução da aplicação em ambiente local.

## Pré-requisitos

Para executar o projeto, são necessários:

- Git.
- Docker Engine.
- Docker Compose V2.
- Uma chave de API do Google Gemini para utilizar a extração de dados de CRLV.

Para executar o frontend e o backend fora do Docker, também é necessário instalar Node.js e npm.

## Configuração do ambiente

Na raiz do projeto, crie o arquivo local de variáveis de ambiente a partir do exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure as seguintes variáveis:

| Variável | Descrição |
|---|---|
| `POSTGRES_USER` | Usuário do PostgreSQL. |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL. |
| `POSTGRES_DB` | Nome do banco de dados. |
| `JWT_SECRET` | Chave secreta forte para assinatura dos tokens JWT. |
| `JWT_EXPIRES_IN` | Tempo de validade dos tokens, por exemplo, `1d`. |
| `GEMINI_API_KEY` | Chave de API do Google Gemini. |

**Importante:** o arquivo `.env` contém informações sensíveis e não deve ser enviado ao repositório. O arquivo `.env.example` deve conter apenas valores ilustrativos, sem credenciais reais.

## Executando com Docker Compose

Na raiz do projeto, execute:

```bash
docker compose up --build
```

O Docker Compose constrói as imagens e inicia os serviços definidos na configuração.

O PostgreSQL possui uma verificação de saúde (`healthcheck`). O backend aguarda o banco ficar saudável antes de iniciar.

Antes de iniciar a API, o contêiner do backend executa automaticamente `npx prisma migrate deploy`, aplicando as migrations pendentes. A aplicação NestJS é iniciada somente se esse comando for concluído com sucesso.

Após a inicialização, os serviços ficam disponíveis em:

| Serviço | Endereço |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| Verificação da API | http://localhost:3001/ |

Para acompanhar os logs dos serviços:

```bash
docker compose logs -f
```

Para consultar apenas os logs do backend:

```bash
docker compose logs backend
```

Para encerrar os serviços:

```bash
docker compose down
```

Os dados do PostgreSQL são armazenados em um volume Docker, permitindo sua persistência após a parada dos contêineres.

**Atenção:** o comando `docker compose down` não remove normalmente o volume de dados. Evite usar `docker compose down -v` se precisar preservar o banco.

## Executando em modo de desenvolvimento

Também é possível executar o frontend e o backend separadamente.

### Backend

Entre no diretório do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente necessárias para conectar o backend ao PostgreSQL e acessar os serviços externos.

Inicie o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

Por padrão, a API é executada na porta `3001`.

### Frontend

Em outro terminal, entre no diretório do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure a variável de ambiente `NEXT_PUBLIC_API_URL` para apontar para a API do backend. Em ambiente local, normalmente:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Inicie o frontend:

```bash
npm run dev
```

O frontend estará disponível em http://localhost:3000.

## API REST

A API disponibiliza endpoints para autenticação, gerenciamento de veículos e extração de dados de CRLV.

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/auth/register` | Cadastro de usuário. | Pública |
| `POST` | `/auth/login` | Autenticação de usuário. | Pública |
| `GET` | `/auth/me` | Consulta do perfil autenticado. | JWT |
| `PATCH` | `/auth/change-password` | Alteração de senha. | JWT |

### Veículos

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/vehicles` | Cadastro de veículo. | JWT |
| `GET` | `/vehicles` | Lista os veículos do usuário autenticado. | JWT |
| `GET` | `/vehicles/:id` | Consulta um veículo pelo identificador. | JWT |
| `PATCH` | `/vehicles/:id` | Atualiza os dados de um veículo. | JWT |
| `DELETE` | `/vehicles/:id` | Exclui um veículo. | JWT |

### Extração de dados de CRLV

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/crlv/extract` | Extrai informações de um documento CRLV usando IA. | JWT |

O endpoint de extração recebe um arquivo por meio de `multipart/form-data`, utilizando o campo `file`.

A extração depende de uma chave válida da API do Google Gemini e está sujeita às validações de formato e tamanho implementadas no backend.

### Autenticação com JWT

As rotas protegidas exigem o token JWT no cabeçalho HTTP:

```http
Authorization: Bearer <token>
```

O token é obtido após a autenticação bem-sucedida e deve ser enviado nas requisições que exigem autenticação.

As operações de gerenciamento de veículos devem respeitar a associação entre cada veículo e o usuário autenticado.

## Banco de dados e migrations

O PostgreSQL armazena os dados da aplicação, e o Prisma ORM gerencia o acesso ao banco e o esquema.

O schema e as migrations ficam no diretório `backend/prisma/`.

Para verificar o estado das migrations, entre no diretório `backend`, com o banco acessível e `DATABASE_URL` configurada:

```bash
npx prisma migrate status
```

Para aplicar migrations pendentes manualmente, quando necessário:

```bash
npx prisma migrate deploy
```

Para gerar o Prisma Client:

```bash
npx prisma generate
```

No ambiente Docker, a aplicação executa automaticamente `prisma migrate deploy` antes de iniciar o backend.

## Testes e validação

Os testes automatizados do backend utilizam Jest.

Execute os comandos a seguir dentro do diretório `backend`.

### Testes unitários

```bash
npm test -- --runInBand
```

### Testes com cobertura

```bash
npm run test:cov -- --runInBand
```

O relatório de cobertura é gerado no diretório `backend/coverage/`.

### Testes end-to-end

```bash
npm run test:e2e -- --runInBand
```

### Compilação do backend

```bash
npm run build
```

### Compilação do frontend

Entre no diretório `frontend` e execute:

```bash
npm run build
```

Esses comandos ajudam a verificar a integridade do código, o funcionamento dos testes e a capacidade de compilação das aplicações.

## Estrutura do projeto

```text
drivo/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── auth/
│   │   ├── crlv/
│   │   ├── prisma/
│   │   ├── vehicles/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/
│   └── package.json
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

### Principais módulos do backend

- `auth/`: cadastro, autenticação e operações relacionadas à conta do usuário.
- `crlv/`: recebimento e extração de informações de documentos CRLV.
- `prisma/`: integração com o Prisma ORM.
- `vehicles/`: gerenciamento de veículos.
- `test/`: testes end-to-end.

## Limitações e observações

- A extração de dados de CRLV depende da disponibilidade e das condições de uso da API do Google Gemini.
- A qualidade dos dados extraídos pode variar conforme a legibilidade do documento.
- A execução local depende da configuração correta das variáveis de ambiente e da disponibilidade dos serviços necessários.
- A documentação dos endpoints deve ser mantida em conformidade com a implementação atual do backend.
