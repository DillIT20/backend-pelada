import express from "express";
import { db } from "../db.js";

export const router = express.Router();

router.get("/api/jogadores", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Jogador");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error);
    res.status(500).json({ error: "Erro ao buscar jogadores" });
  }
});

router.get("/api/jogadores/:id", async (req, res) => {
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
