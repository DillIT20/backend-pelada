import express from "express";
import { db } from "../db.js";
export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, t.nome AS turma_nome, t.dia_semana, t.horario
      FROM Partida p
      JOIN Turma t ON t.id = p.turma_id
      ORDER BY p.data_partida DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    res.status(500).json({ error: "Erro ao buscar partidas" });
  }
});
