CREATE DATABASE IF NOT EXISTS palestras;
USE palestras;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  ID INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  nome VARCHAR(255),
  senha VARCHAR(255),
  admin BOOLEAN DEFAULT 0
);

-- Tabela de Palestras
CREATE TABLE IF NOT EXISTS palestra (
  id INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(255),
  descricao VARCHAR(255),
  nomePalestrante VARCHAR(255),
  localEvento VARCHAR(255),
  dataEvento TIMESTAMP
);

-- Tabela de Inscrições
CREATE TABLE IF NOT EXISTS inscricoes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  idUsuario INT,
  idPalestra INT,
  FOREIGN KEY (idUsuario) REFERENCES usuarios(ID) ON DELETE CASCADE,
  FOREIGN KEY (idPalestra) REFERENCES palestra(id) ON DELETE CASCADE,
  UNIQUE (idUsuario, idPalestra)
);

-- Inserir usuário administrador padrão com senha criptografada via bcrypt (12345678)
INSERT INTO usuarios (email, nome, admin, senha)
VALUES ('teste@gmail.com', 'teste', 1, '$2a$10$YGKSbIv.76XAdkoU3ZjY2.d0e2LIxA8wWOYBOFsda3z/V0sPa8Nea')
ON DUPLICATE KEY UPDATE email=email;
