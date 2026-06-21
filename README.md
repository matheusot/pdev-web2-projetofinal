# Desenvolvimento para Internet II – Projeto Final

Sistema completo de **Cadastro e Inscrição em Palestras** desenvolvido como avaliação. Aquitetura: Frontend em Angular, Backend em Node.JS com Express e MySQL, usando Docker para orquestração dos serviços.

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
