import express from "express";
import { db } from "../db.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, t.nome as turma_nome
      FROM ExcecoesPartidas e
      JOIN Turma t ON t.id = e.turma_id
      ORDER BY e.data ASC
    `);

    const data = rows.map(e => ({
      id: e.id,
      turma_id: e.turma_id,
      turma_nome: e.turma_nome,
      data: e.data,
      tipo: e.tipo,
      observacao: e.observacao,
    }));

    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar exceções:", error);
    res.status(500).json({ error: "Erro ao buscar exceções" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { turma_id, data, tipo, observacao } = req.body;

    const [result] = await db.query(
      `INSERT INTO ExcecoesPartidas (turma_id, data, tipo, observacao)
       VALUES (?, ?, ?, ?)`,
      [turma_id, data, tipo, observacao || null]
    );

    res.json({ id: result.insertId, turma_id, data, tipo, observacao });
  } catch (error) {
    console.error("Erro ao criar exceção:", error);
    res.status(500).json({ error: "Erro ao criar exceção" });
  }
});
