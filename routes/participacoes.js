import express from "express";
import { db } from "../db.js";
export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT pp.*, j.nome, j.posicao, j.foto, j.idade, j.time
      FROM ParticipacaoPartida pp
      JOIN Jogador j ON j.id = pp.jogador_id
    `);
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar participações:", error);
    res.status(500).json({ error: "Erro ao buscar participações" });
  }
});
