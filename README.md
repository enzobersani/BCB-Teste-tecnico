# 🧠 BCB - Big Chat Brasil (Teste Técnico Backend)

Este é um sistema de **mensageria com fila de priorização**, criado como parte de um teste técnico para backend. Ele simula o envio de mensagens entre empresas (clientes) e usuários, com controle de saldo ou limite, priorização de mensagens e processamento síncrono em memória.

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker & Docker Compose](https://docs.docker.com/)
- [Swagger](https://swagger.io/tools/swagger-ui/)

---

## 📁 Estrutura de Pastas

```
src/
├── auth/               # Autenticação por CPF/CNPJ via header
├── clients/            # Cadastro e gestão de clientes
├── conversations/      # Histórico de conversas entre cliente e usuário
├── messages/           # Envio e status de mensagens
├── queue/              # Fila de processamento com priorização
├── common/             # Pipes, decorators e helpers
├── main.ts             # Bootstrap da aplicação
├── app.module.ts       # Módulo raiz
```

---

## 📜 Regras de Negócio

- Clientes são PF ou PJ e possuem um **plano** (pré-pago ou pós-pago).
- Mensagens podem ser **normais (R$0,25)** ou **urgentes (R$0,50)**.
- Validação de saldo/limite antes do envio.
- Fila síncrona em memória com processamento ordenado:
  - Urgentes têm prioridade.
  - Até 3 urgentes consecutivas antes de intercalar com uma normal.
- Conversas são atualizadas automaticamente ao enviar mensagens.
- Suporte ao reprocessamento automático em caso de falhas.

---

## 📦 Instalação Local

### Pré-requisitos

- Docker + Docker Compose
- Node.js 18+

### 1. Clone o repositório

```bash
git clone https://github.com/enzobersani/BCB-Teste-tecnico.git
cd BCB-Teste-tecnico
```

### 2. Suba os containers com Docker Compose

```bash
docker-compose up --build
```

> Isso irá iniciar a API e o banco PostgreSQL localmente na porta 5432.

---

## 🔐 Autenticação

As requisições precisam de um header com o documento do cliente:

```
x-client-doc: 12345678900
```

---

## 📖 Documentação Swagger

Após iniciar o projeto, acesse a documentação em:

```
http://localhost:3000/api
```

---

## 🧪 Endpoints Principais

### 📌 Autenticação e Clientes

| Método | Rota                        | Descrição                       |
|--------|-----------------------------|---------------------------------|
| POST   | `/auth`                     | Autenticação por CPF/CNPJ       |
| GET    | `/clients`                  | Lista todos os clientes         |
| POST   | `/clients`                  | Cria um novo cliente            |
| GET    | `/clients/:id`              | Detalhes de um cliente          |
| PUT    | `/clients/:id`              | Atualiza cliente                |
| GET    | `/clients/:id/balance`      | Saldo ou limite do cliente      |

### 🗨️ Mensagens

| Método | Rota                     | Descrição                         |
|--------|--------------------------|-----------------------------------|
| POST   | `/messages`              | Envia nova mensagem               |
| GET    | `/messages`              | Lista mensagens com filtros       |
| GET    | `/messages/:id`          | Detalhes de uma mensagem          |
| GET    | `/messages/:id/status`   | Status da mensagem                |

### 💬 Conversas

| Método | Rota                                 | Descrição                      |
|--------|--------------------------------------|--------------------------------|
| GET    | `/conversations`                     | Lista conversas do cliente     |
| GET    | `/conversations/:id`                 | Detalhes de uma conversa       |
| GET    | `/conversations/:id/messages`        | Mensagens da conversa          |

### 📊 Fila

| Método | Rota             | Descrição                              |
|--------|------------------|----------------------------------------|
| GET    | `/queue/status`  | Estatísticas da fila (quantidade, etc) |

---

## ✅ Funcionalidades Entregues

- [x] API de CRUD para clientes
- [x] Autenticação simplificada via CPF/CNPJ
- [x] Fila em memória com duas prioridades (normal/urgente)
- [x] Processamento síncrono
- [x] Validação de saldo ou limite por plano
- [x] Registro de status de mensagens
- [x] Atualização de conversas
- [x] Fila com política de prioridade e anti-starvation
- [x] Reprocessamento automático de falhas
- [x] Swagger para testes e documentação

---

## 🧠 Observações Técnicas

- A fila é controlada por um loop com `setInterval` e controlada por `isProcessing`.
- A estrutura evita starvation com a regra de no máximo 3 mensagens urgentes consecutivas.
- O reprocessamento automático ocorre em caso de falhas no envio.
- O cliente é identificado a partir do header `x-client-doc` em todas as rotas protegidas.

---

## 👨‍💻 Autor

**Enzo Bersani**

LinkedIn: [linkedin.com/in/enzobersani](https://www.linkedin.com/in/enzobersani)

GitHub: [github.com/enzobersani](https://github.com/enzobersani)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
