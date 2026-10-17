# Drivo — Gestão de Veículos

Aplicação web full-stack para gerenciamento de veículos, desenvolvida com Next.js e NestJS. O projeto utiliza autenticação JWT, persistência relacional com PostgreSQL e Docker Compose para simplificar a configuração e a execução do ambiente.

## 1. Tecnologias utilizadas

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Frontend | Next.js, React e TypeScript | Interface e navegação da aplicação |
| Backend | NestJS e TypeScript | API REST e regras de negócio |
| ORM | Prisma | Acesso ao banco e versionamento do schema |
| Banco de dados | PostgreSQL 17 | Persistência dos dados |
| Autenticação | JWT | Autenticação e proteção de rotas |
| Infraestrutura | Docker e Docker Compose | Containerização e execução integrada |
| Testes | Jest | Testes automatizados |

## 2. Funcionalidades

- Cadastro de usuários e autenticação.
- Login com emissão de token JWT.
- Consulta dos dados do usuário autenticado.
- Cadastro, listagem, consulta, edição e exclusão de veículos.
- Interface para gerenciamento de perfil e veículos.
- Módulo relacionado ao processamento de documentos CRLV.

## 3. Arquitetura e organização

O projeto está organizado em dois componentes principais: frontend e backend, executados junto ao banco de dados por meio do Docker Compose.

### Frontend

Desenvolvido com Next.js, React e TypeScript, é responsável pela interface, navegação entre páginas e interação com a API.

A utilização de componentes e CSS Modules favorece a reutilização da interface e mantém os estilos organizados por componente ou página.

### Backend

Construído com NestJS, o backend disponibiliza uma API REST e separa as responsabilidades em módulos, controllers, services e DTOs.

- **Modules:** agrupam funcionalidades relacionadas.
- **Controllers:** recebem requisições HTTP e definem os endpoints.
- **Services:** concentram as regras de negócio e operações sobre os dados.
- **DTOs:** definem a estrutura dos dados recebidos pela API.
- **Guards e estratégia de autenticação:** protegem rotas que exigem identificação do usuário.

Essa separação reduz o acoplamento entre as camadas e facilita a manutenção e a evolução do sistema.

### Banco de dados

O PostgreSQL armazena os dados persistentes da aplicação, enquanto o Prisma fornece uma camada tipada de acesso ao banco e gerencia as migrations.

O versionamento do schema permite registrar alterações estruturais e reproduzir a evolução do banco nos ambientes de desenvolvimento.

## 4. Decisões técnicas

### Separação entre frontend e backend

A aplicação utiliza duas camadas independentes, se comunicando por meio de uma API REST. Essa abordagem permite evoluir a interface e as regras de negócio separadamente, além de facilitar a substituição ou expansão de clientes no futuro.

### NestJS e arquitetura modular

O NestJS foi escolhido para organizar o backend em módulos e manter responsabilidades bem definidas. A separação entre controllers, services e DTOs favorece a testabilidade e evita concentrar o processamento das requisições em uma única camada.

### TypeScript

O TypeScript é utilizado no frontend e no backend para adicionar tipagem estática, melhorar a legibilidade e detectar parte dos erros durante o desenvolvimento.

### Prisma e PostgreSQL

A combinação oferece persistência relacional, consultas tipadas e migrations versionadas. O PostgreSQL é adequado para representar as relações entre usuários e veículos, enquanto o Prisma simplifica o acesso aos dados.

### Autenticação e isolamento de dados

O JWT permite identificar o usuário nas requisições protegidas. Além da autenticação, as operações sobre veículos devem considerar o identificador do usuário autenticado, impedindo que um usuário consulte ou altere registros pertencentes a outra conta.

### Docker Compose

A containerização padroniza a execução dos serviços e reduz diferenças entre ambientes. Com as variáveis de ambiente configuradas, frontend, backend e banco de dados podem ser iniciados por um único comando.

## 5. Pré-requisitos

- Git.
- Docker Desktop no Windows ou Docker Engine e Docker Compose no Linux.
- Arquivo `.env` configurado conforme o `.env.example`.

## 6. Instalação e execução

Clone o repositório:

```bash
git clone https://github.com/joaogt01/Drivo.git
cd Drivo
```

Crie o arquivo de ambiente.

**Windows — PowerShell:**

```powershell
Copy-Item .env.example .env
```

**Linux — Bash:**

```bash
cp .env.example .env
```

Configure as variáveis necessárias no `.env`. Não utilize credenciais reais em arquivos versionados.

Inicie a aplicação na raiz do projeto:

```bash
docker compose up -d --build
```

O comando constrói as imagens necessárias e inicia os serviços definidos na configuração do Compose.

### Endereços

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |

### Comandos úteis

Visualizar o estado dos serviços:

```bash
docker compose ps
```

Acompanhar os logs:

```bash
docker compose logs -f
```

Encerrar os serviços:

```bash
docker compose down
```

O comando `docker compose down` não remove os volumes nomeados por padrão. Para remover também os dados persistidos, seria necessário utilizar `docker compose down -v`; essa operação é destrutiva.

## 7. Testes

Os testes ajudam a validar o comportamento do backend e a compilação do frontend.

### Backend

No diretório `backend`, instale as dependências:

```bash
npm ci
```

Execute os testes unitários:

```bash
npm test -- --runInBand
```

Execute os testes E2E:

```bash
npm run test:e2e -- --runInBand
```

Os testes E2E podem depender de variáveis de ambiente e serviços configurados. Consulte a configuração de testes do projeto antes de executá-los.

### Frontend

No diretório `frontend`, instale as dependências e valide a compilação de produção:

```bash
npm ci
npm run build
```

## 8. Limitações e melhorias futuras

### Limitações

Devido ao tempo disponível para o desenvolvimento, algumas funcionalidades complementares e melhorias de acabamento não foram concluídas.

- Documentação da API: a documentação interativa com OpenAPI/Swagger não foi concluída. Sua implementação facilitaria a consulta dos endpoints, parâmetros, DTOs, códigos de resposta e requisitos de autenticação.

- Imagens personalizadas dos veículos: a configuração e o gerenciamento de imagens personalizadas para cada veículo não foram concluídos. A funcionalidade poderia incluir upload, pré-visualização, substituição e remoção de imagens, além de validação de formato e tamanho dos arquivos.

- Processamento de documentos CRLV: o módulo relacionado aos documentos CRLV necessita de validação dos fluxos suportados e de testes adicionais para garantir o comportamento esperado diante de diferentes arquivos e dados inválidos.

- Cobertura de testes: apesar da existência de testes automatizados, ainda há espaço para ampliar os cenários de integração e E2E, principalmente nos fluxos completos de autenticação, gerenciamento de veículos e processamento de documentos.

### Melhorias planejadas

Com mais tempo de desenvolvimento, as seguintes melhorias seriam priorizadas:

- Implementar OpenAPI/Swagger: disponibilizar documentação interativa da API, com descrição dos endpoints, exemplos de requisição e resposta, validações e autenticação JWT.

- Adicionar imagens personalizadas: permitir que cada veículo tenha uma imagem própria, com upload, visualização, substituição e exclusão, incluindo validação de arquivos e armazenamento apropriado.

- Aprimorar o módulo CRLV: concluir e validar os fluxos de processamento documental, incluindo tratamento de erros e arquivos inválidos.

- Expandir os testes automatizados: cobrir mais cenários de integração, autorização, validação de dados e falhas inesperadas.

- Automatizar a qualidade do código: configurar CI/CD para executar testes, validações e builds a cada alteração.

- Fortalecer a operação em produção: implementar logs estruturados, monitoramento, backups e configurações de segurança específicas para o ambiente de implantação.

## 9. Estrutura do repositório

```text
Drivo/
├── backend/
├── frontend/
├── docker-compose.yml
├── .env.example
└── README.md
```

A estrutura interna de cada aplicação contém os arquivos de implementação, configuração e testes correspondentes.

## Autor

**João Victor** — [GitHub](https://github.com/joaogt01)
