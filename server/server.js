const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const conexao = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/cadastro', async (req, res) => {
  const { email, nome, senha } = req.body;
  try {
    const [usuarios] = await conexao.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (usuarios.length > 0) {
      return res.status(400).json({ message: 'Este email já está cadastrado' });
    }

    const passwordHash = await bcrypt.hash(senha, 10);

    await conexao.execute(
      'INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)',
      [email, nome, passwordHash]
    );
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: `Erro ao cadastrar: ${error.message}` });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [usuario] = await conexao.execute("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (usuario.length === 0) {
      return res.json({ message: 'Email ou senha inválidos', tipoMensagem: 'danger' });
    }

    const verificaUsuario = usuario[0];

    const isMatch = await bcrypt.compare(senha, verificaUsuario.senha);
    if (!isMatch) {
      return res.json({ message: "Senha inválida!", tipoMensagem: 'danger' });
    }

    const userData = {
      id: verificaUsuario.ID,
      email: verificaUsuario.email,
      nome: verificaUsuario.nome,
      admin: verificaUsuario.admin,
    };

    res.json({ message: 'Login realizado com sucesso!', userData, tipoMensagem: 'success' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao logar!' });
  }
});

app.post('/api/admin', async (req, res) => {
  const { titulo, descricao, nomePalestrante, localEvento, dataEvento } = req.body;
  const dadosEvento = [titulo, descricao, nomePalestrante, localEvento, dataEvento];
  try {
    console.log("Cadastrando evento:", dadosEvento);
    await conexao.execute(
      "INSERT INTO palestra(titulo, descricao, nomePalestrante, localEvento, dataEvento) VALUES(?,?,?,?,?)",
      dadosEvento
    );
    res.status(201).json({ message: "Evento cadastrado com sucesso!" });
  } catch (error) {
    console.error(`Erro interno: ${error}`);
    res.status(500).json({ message: 'Erro ao cadastrar evento!' });
  }
});

app.get("/api/palestras", async (req, res) => {
  try {
    const [rows] = await conexao.execute("SELECT * FROM palestra");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao listar palestras:", err);
    res.status(500).json({ message: "Erro interno" });
  }
});

app.post("/api/inscricao", async (req, res) => {
  const { idUsuario, idPalestra } = req.body;
  try {
    await conexao.execute(
      "INSERT INTO inscricoes (idUsuario, idPalestra) VALUES (?,?)",
      [idUsuario, idPalestra]
    );
    res.status(201).json({ message: "Inscrição realizada com sucesso." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Você já se inscreveu nesse evento!" });
    } else {
      console.error("Erro ao inscrever:", error);
      res.status(500).json({ message: "Erro ao realizar a inscrição :(" });
    }
  }
});

app.get("/api/palestras/:id/participantes", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await conexao.execute(
      "SELECT u.nome, u.email FROM inscricoes i JOIN usuarios u ON i.idUsuario = u.ID WHERE i.idPalestra = ?",
      [id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar participantes:", err);
    res.status(500).json({ message: "Erro ao carregar participantes" });
  }
});

app.get("/api/usuarios/:idUsuario/inscricoes", async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const [rows] = await conexao.execute(
      "SELECT idPalestra FROM inscricoes WHERE idUsuario = ?",
      [idUsuario]
    );
    res.json(rows.map(row => row.idPalestra));
  } catch (err) {
    console.error("Erro ao buscar inscrições:", err);
    res.status(500).json({ message: "Erro ao buscar inscrições" });
  }
});

app.delete("/api/inscricao", async (req, res) => {
  const { idUsuario, idPalestra } = req.body;
  try {
    await conexao.execute(
      "DELETE FROM inscricoes WHERE idUsuario = ? AND idPalestra = ?",
      [idUsuario, idPalestra]
    );
    res.json({ message: "Inscrição cancelada com sucesso." });
  } catch (error) {
    console.error("Erro ao desinscrever:", error);
    res.status(500).json({ message: "Erro ao cancelar a inscrição." });
  }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando na porta ${PORT}`));
