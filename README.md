# Projeto Integrador - Desenvolvimento de Sistemas Orientado a Dispositivos Móveis e Baseados na Web

Aplicação focada em **organização de biblioteca pessoal** e **troca de livros entre usuários**, com uma experiência simples, segura e intuitiva. O objetivo é ampliar o acesso à leitura, incentivar a reutilização (sustentabilidade) e fortalecer a comunidade de leitores.

---

## Visão do Produto

O produto conecta pessoas interessadas em **trocar livros** de forma prática e eficiente, permitindo também **catalogar** e **organizar** a biblioteca pessoal.

### Problema que resolve
Muitas pessoas desejam ler mais, mas enfrentam:
- custo alto de livros físicos;
- dificuldade em encontrar trocas confiáveis;
- falta de organização da coleção pessoal;
- pouca clareza e segurança em negociações feitas em grupos de redes sociais.

### Benefícios
- economia na aquisição de novos livros (troca);
- incentivo à sustentabilidade por reutilização;
- expansão do repertório literário;
- organização da estante e controle do que está disponível para troca.

---

## Personas

### Persona I — Matheus Silva (19 anos)
**Perfil:** universitário/estagiário, orçamento apertado, fã de fantasia e ficção científica.
**Objetivos:** ler mais sem gastar muito; encontrar pessoas com gostos parecidos.
**Dores:** livros caros; frustração com lançamentos; falta de espaço confiável para troca.
**Como o app ajuda:** troca livros já lidos por novos; filtros por gênero/sagas; recomendações e notificações.

### Persona II — Juliana Cristina
**Perfil:** leitora de livros físicos e e-books, rotina corrida, grande apego à estante.
**Objetivos:** organizar a coleção; trocar poucos livros específicos; gerir o que tem e o que leu.
**Dores:** pouco tempo; plataformas desorganizadas; dificuldade em separar "coleção" vs "troca".
**Como o app ajuda:** biblioteca digital organizada, marcação "para troca"/"coleção", cadastro rápido e filtros.

### Persona III — Ricardo Menezes (32 anos)
**Perfil:** profissional de TI, pouco espaço em casa, fã de suspense/terror/thrillers.
**Objetivos:** liberar espaço; trocar com segurança; encontrar leitores próximos com gostos parecidos.
**Dores:** trocas confusas em redes sociais; pouca confiança; dificuldade de encontrar matches.
**Como o app ajuda:** catálogo claro, filtros por gênero/localização, mensagens internas e confirmações.

---

## Jornada do Usuário (Resumo)

### Matheus — Limitação financeira
- **Gatilho:** indicação de amigo ("organizado e confiável")
- **Momento de valor:** encontra troca por um livro de uma saga desejada
- **Resultado:** passa a usar o app como principal forma de conseguir livros

### Juliana — Organização e controle
- **Gatilho:** conteúdo sobre organização pessoal
- **Momento de valor:** consegue separar "coleção" de "para troca" e ter controle da estante
- **Resultado:** organiza a biblioteca e troca apenas títulos selecionados

### Ricardo — Espaço e segurança
- **Gatilho:** anúncio destacando filtros por gênero/localização
- **Momento de valor:** sugestão de troca com leitor do mesmo bairro e gosto
- **Resultado:** evita acumular e mantém apenas edições especiais

---

## Funcionalidades implementadas

- Cadastro e login de usuários (e-mail + senha BCrypt)
- Biblioteca pessoal (minha estante) — catalogar livros como **coleção** ou **disponível para troca**
- Busca de livros com filtros reativos por título, autor e gênero
- Registro e remoção de interesse em livros de outros usuários
- Página "Meus Interesses" com todos os interesses registrados
- Página Admin para gerenciamento de livros e gêneros
- Guards de rota (autenticação e onboarding obrigatório)

---

## Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 19 (standalone components, signals) |
| Backend | Java 21 + Spring Boot 4 |
| Banco de dados | PostgreSQL 16 |
| ORM | Spring Data JPA / Hibernate 7 |
| Autenticação | BCrypt (spring-security-crypto) |
| Containerização | Docker + Docker Compose |
| Gerenciador de pacotes (front) | pnpm |
| Build (back) | Maven |

---

## Estrutura do repositório

```
pti-senac-grupo10/
├── backend/          # API REST Spring Boot
│   ├── src/main/java/com/example/bookexchange/
│   │   ├── config/   # CorsConfig, SecurityConfig
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   └── src/main/resources/
│       ├── application.properties
│       ├── schema.sql   # DDL das tabelas
│       └── data.sql     # seed data (idempotente)
├── frontend/         # Angular SPA
│   └── src/app/
│       ├── features/ # páginas (home, my-shelf, book-search, my-interests, ...)
│       ├── services/ # AuthService, BooksService, ShelfService, InterestsService
│       ├── guards/   # auth, public, app-init
│       └── state/    # CurrentUserService
└── docker-compose.yml
```

---

## Como executar

Pré-requisito: **Docker** e **Docker Compose** instalados.

```bash
# Na raiz do repositório
docker compose up --build
```

Isso sobe:
- `bookexchange-db` — PostgreSQL na porta `5432`
- `bookexchange-backend` — API REST na porta `http://localhost:8080`

O banco é criado automaticamente, as tabelas são geradas pelo `schema.sql` e o seed data é aplicado pelo `data.sql` (idempotente — só insere se ainda não existir).

Para parar:
```bash
docker compose down
```

Para parar **e apagar os dados** (volume do PostgreSQL):
```bash
docker compose down -v
```

---

## Seed data

O arquivo `backend/src/main/resources/data.sql` é executado automaticamente na inicialização e popula o banco com dados de exemplo (usando `ON CONFLICT DO NOTHING`, portanto é seguro reiniciar):

| Tabela | Quantidade |
|--------|-----------|
| Gêneros | 20 |
| Livros | 81 |
| Usuários | 12 |
| Entradas de estante | 60 |

### Usuários de teste

Todos os usuários têm a mesma senha: **`senha123`**

| Nome | E-mail | Cidade |
|------|--------|--------|
| Ana Souza | ana.souza@email.com | São Paulo |
| Bruno Lima | bruno.lima@email.com | Rio de Janeiro |
| Carla Mendes | carla.mendes@email.com | Belo Horizonte |
| Diego Ferreira | diego.ferreira@email.com | Porto Alegre |
| Elena Costa | elena.costa@email.com | Curitiba |
| Felipe Santos | felipe.santos@email.com | Salvador |
| Gabriela Oliveira | gabriela.oliveira@email.com | Recife |
| Henrique Rocha | henrique.rocha@email.com | Fortaleza |
| Isabela Nunes | isabela.nunes@email.com | Manaus |
| João Paulo Martins | joao.martins@email.com | Brasília |
| Katia Vieira | katia.vieira@email.com | Florianópolis |
| Lucas Martins | lucas.martins@email.com | Campinas |

---

## Endpoints principais

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/register-or-login` | Cria usuário (se não existir) ou faz login |
| POST | `/auth/login` | Login com e-mail e senha |

Body de exemplo:
```json
{ "email": "ana.souza@email.com", "senha": "senha123" }
```

---

### Livros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/books` | Lista todos os livros (paginado) |
| GET | `/books?titulo=duna` | Filtro por título |
| GET | `/books?autor=asimov` | Filtro por autor |
| GET | `/books?genre=2` | Filtro por gênero |
| POST | `/books` | Cria um livro (admin) |
| DELETE | `/books/{id}` | Remove um livro (admin) |

Parâmetros de paginação: `page`, `size`, `sortBy`, `sortDir`.

---

### Gêneros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/genres` | Lista todos os gêneros |
| POST | `/genres` | Cria gênero (admin) |
| DELETE | `/genres/{id}` | Remove gênero (admin) |

---

### Estante do usuário

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/shelf/user/{userId}` | Lista estante do usuário |
| POST | `/shelf` | Adiciona livro à estante |
| PATCH | `/shelf/{id}` | Atualiza disponibilidade/conservação |
| DELETE | `/shelf/{id}` | Remove entrada da estante |

Body de exemplo (POST):
```json
{
  "usuario": { "id": 1 },
  "livro": { "id": 6 },
  "disponibilidade": "para_troca",
  "estadoConservacao": "Ótimo"
}
```

---

### Interesses

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/interests/user/{userId}` | Lista interesses do usuário |
| POST | `/interests` | Registra interesse em um livro |
| DELETE | `/interests/{id}` | Remove interesse |

Body de exemplo (POST):
```json
{
  "idSolicitante": 1,
  "idDono": 2,
  "idLivro": 6,
  "idEstante": 7
}
```

---

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/users` | Lista usuários |
| GET | `/users/{id}` | Busca usuário por ID |
| POST | `/users` | Cria usuário |
| PATCH | `/users/{id}` | Atualiza dados do usuário |

