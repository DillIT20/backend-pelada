import express from "express";
import { db } from "../db.js";
export const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Turma");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    res.status(500).json({ error: "Erro ao buscar turmas" });
  }
});
