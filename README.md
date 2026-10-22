# Desenvolvimento para Internet II – Projeto Final

Sistema completo de **Cadastro e Inscrição em Palestras** desenvolvido como avaliação. Arquitetura: Frontend em Angular, Backend em Node.JS com Express e MySQL, usando Docker para orquestração dos serviços.

---

## Executando o projeto

1. Abra o terminal na pasta raiz do projeto.
2. Suba os contêineres:
   ```bash
   sudo docker compose up -d
   ```
3. O comando irá:
   - Inicializar o MySQL na porta **`3307`** (para evitar conflitos caso já exista um banco local rodando na porta padrão `3306`).
   - Configurar e semear o banco através do script `db-init.sql`.
   - Inicializar o Backend Express na porta **`3000`**.
   - Inicializar o phpMyAdmin na porta **`9000`** para gerenciar os dados visualmente.
   - Inicializar o Angular Dev Server na porta **`4200`** (com mapeamento de volumes para sincronizar alterações em tempo real com hot-reload).

---

## Estrutura

| Pasta | Descrição |
|---|---|
| `sistemaPalestras/` | Frontend em Angular |
| `server/` | API em Node.js + Express |
| `db-init.sql` | Criação e carga inicial do banco MySQL |
| `docker-compose.yml` | Orquestração: MySQL, API, Angular e phpMyAdmin |

## Endpoints da API

| Método | Rota | Função |
|---|---|---|
| POST | `/api/cadastro` | Cadastro de usuário |
| POST | `/api/login` | Login |
| POST | `/api/admin` | Cadastro de palestra (administrador) |
| GET | `/api/palestras` | Lista as palestras |
| POST | `/api/inscricao` | Inscreve um usuário em uma palestra |
| DELETE | `/api/inscricao` | Cancela uma inscrição |
| GET | `/api/palestras/:id/participantes` | Lista os participantes de uma palestra |
| GET | `/api/usuarios/:idUsuario/inscricoes` | Lista as inscrições de um usuário |

> Projeto acadêmico: o MySQL do `docker-compose.yml` roda sem senha (`MYSQL_ALLOW_EMPTY_PASSWORD`). Não use essa configuração em produção.
