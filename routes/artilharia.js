import express from "express";
import { db } from "../db.js";
export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, j.nome, j.posicao, j.foto, j.idade, j.time
      FROM ArtilhariaMensal a
      JOIN Jogador j ON j.id = a.jogador_id
      ORDER BY a.total_gols DESC
    `);

    const data = rows.map(a => ({
      id: a.id,
      jogador_id: a.jogador_id,
      mes_referencia: a.mes_referencia,
      total_gols: a.total_gols,
      total_partidas: a.total_partidas,
      mediaGols: Number((a.total_gols / a.total_partidas).toFixed(2)),
      jogador: {
        id: a.jogador_id,
        nome: a.nome,
        posicao: a.posicao,
        foto: a.foto,
        idade: a.idade,
        time: a.time,
      },
    }));

    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar artilharia:", error);
    res.status(500).json({ error: "Erro ao buscar artilharia" });
  }
});
