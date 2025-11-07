import express from "express";
import { db } from "../db.js";

export const router = express.Router();

router.get("/jogadores", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Jogador");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    res.status(500).json({ error: "Erro ao buscar jogadores" });
  }
});

router.get("/jogadores/:id", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Jogador WHERE id = ?", [req.params.id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar jogador:", error);
    res.status(500).json({ error: "Erro ao buscar jogador" });
  }
});

router.post("/jogadores", async (req, res) => {
  const { nome, posicao, idade, foto } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO Jogador (nome, posicao, idade, foto) VALUES (?, ?, ?, ?)",
      [nome, posicao, idade, foto]
    );

    res.json({ id: result.insertId, nome, posicao, idade, foto });
  } catch (error) {
    console.error("Erro ao inserir jogador:", error);
    res.status(500).json({ error: "Erro ao inserir jogador" });
  }
});

router.put("/jogadores/:id", async (req, res) => {
  const { nome, posicao, idade, foto } = req.body;
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "UPDATE Jogador SET nome = ?, posicao = ?, idade = ?, foto = ? WHERE id = ?",
      [nome, posicao, idade, foto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Jogador não encontrado" });
    }

    res.json({ id, nome, posicao, idade, foto });
  } catch (error) {
    console.error("Erro ao atualizar jogador:", error);
    res.status(500).json({ error: "Erro ao atualizar jogador" });
  }
});
