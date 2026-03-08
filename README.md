# 📚 Book Exchange - Projeto Integrador

Aplicação focada em **organização de biblioteca pessoal** e **troca de livros**, desenvolvida com tecnologias modernas para garantir performance, segurança e acessibilidade.

---

## 👥 Equipe do Projeto
ANAIS QUEIROZ GOEDERT
EDUARDO CASTRO SAKAI
FERNANDO KENICHI TAKENOUCHI
GUILHERME DUARTE DA COSTA
GUILHERME FERNANDES BATISTA
JULIANA CRISTINA FORBICI
STEFANI DAL PUPPO

---

## 🚀 Como Executar o Projeto

### 1. Backend & Banco de Dados (Docker)
Certifique-se de ter o **Docker** e **Docker Compose** instalados. Na raiz do repositório, execute:

```bash
docker compose up --build
PostgreSQL: Porta 5432

Backend (Spring Boot): http://localhost:8080

2. Frontend (Angular)
Abra um novo terminal na pasta /frontend e execute:

Bash
pnpm install
pnpm start
Acesse: http://localhost:4200

🎯 Diferenciais Técnicos (Prova de Conceito)
Nesta entrega, focamos em resolver os pontos críticos de experiência do usuário e robustez do sistema:

Acessibilidade WCAG: Navegação completa via teclado (tecla TAB) com foco visível em todos os elementos interativos.

Segurança na Estante: Implementação de modal de confirmação para exclusões, evitando a perda acidental de dados.

Mecânica de "Undo": Sistema de recuperação de dados (desfazer) de 5 segundos após a remoção de um item.

UX Reativa: Utilização de Angular Signals para filtros de busca instantâneos e atualização de estado sem recarregar a página.

🔑 Acesso de Teste (Seed Data)
Usuário: ana.souza@email.com

Senha: senha123

🛠️ Stack Tecnológica
Frontend: Angular 19 (Signals & Standalone Components)

Backend: Java 21 + Spring Boot 3

Banco de Dados: PostgreSQL 16

Infraestrutura: Docker & Docker Compose