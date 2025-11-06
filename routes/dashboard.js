import express from "express";
import { db } from "../db.js"; 

const router = express.Router();


router.get("/api/artilheiros-mes", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        j.id AS jogador_id,
        j.nome,
        j.posicao,
        j.foto,
        j.idade,
        j.time,
        SUM(pp.gols) AS total_gols,
        COUNT(DISTINCT pp.partida_id) AS total_partidas,
        ROUND(SUM(pp.gols) / COUNT(DISTINCT pp.partida_id), 2) AS mediaGols
      FROM ParticipacaoPartida pp
      JOIN Jogador j ON pp.jogador_id = j.id
      WHERE MONTH(pp.data) = MONTH(CURRENT_DATE())
        AND YEAR(pp.data) = YEAR(CURRENT_DATE())
      GROUP BY j.id
      ORDER BY total_gols DESC
      LIMIT 5;
    `);

    res.json(rows);
  } catch (err) {
    console.error("❌ Erro ao buscar artilheiros do mês:", err);
    res.status(500).json({ error: "Erro ao buscar artilheiros do mês" });
  }
});

/**
 * 📅 Próximas partidas
 */
router.get("/api/proximas-partidas", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        p.data_partida,
        p.local,
        p.placar,
        t.nome AS turma_nome,
        t.dia_semana,
        t.horario
      FROM Partida p
      JOIN Turma t ON p.turma_id = t.id
      WHERE p.data_partida >= CURDATE()
      ORDER BY p.data_partida ASC
      LIMIT 6;
    `);

    const partidas = rows.map((p) => ({
      id: p.id,
      data_partida: p.data_partida,
      local: p.local,
      placar: p.placar,
      turma: {
        nome: p.turma_nome,
        dia_semana: p.dia_semana,
        horario: p.horario,
      },
    }));

    res.json(partidas);
  } catch (err) {
    console.error("❌ Erro ao buscar próximas partidas:", err);
    res.status(500).json({ error: "Erro ao buscar próximas partidas" });
  }
});


router.get("/api/estatisticas-gerais", async (req, res) => {
  try {
    const [[estatisticas]] = await db.query(`
      SELECT 
        COUNT(DISTINCT p.id) AS totalPartidas,
        COALESCE(SUM(pp.gols), 0) AS totalGols,
        ROUND(
          IFNULL(SUM(pp.gols) / NULLIF(COUNT(DISTINCT p.id), 0), 0),
          2
        ) AS mediaGolsPorJogo
      FROM Partida p
      LEFT JOIN ParticipacaoPartida pp ON pp.partida_id = p.id
      WHERE MONTH(p.data_partida) = MONTH(CURRENT_DATE())
        AND YEAR(p.data_partida) = YEAR(CURRENT_DATE());
    `);

    res.json(estatisticas || {});
  } catch (err) {
    console.error("❌ Erro ao buscar estatísticas gerais:", err);
    res.status(500).json({ error: "Erro ao buscar estatísticas gerais" });
  }
});


router.get("/api/dashboard", async (req, res) => {
  try {
    // Total de jogadores
    const [jogadores] = await db.query(`SELECT COUNT(*) AS total_jogadores FROM Jogador`);

    // Total de partidas
    const [partidas] = await db.query(`SELECT COUNT(*) AS total_partidas FROM Partida`);

    // Total de gols
    const [gols] = await db.query(`SELECT COALESCE(SUM(gols), 0) AS total_gols FROM ParticipacaoPartida`);

    // Média de gols por jogo
    const mediaGolsPorJogo =
      partidas[0].total_partidas > 0
        ? (gols[0].total_gols / partidas[0].total_partidas).toFixed(2)
        : 0;

    const [artilheiros] = await db.query(`
      SELECT 
        j.id AS jogador_id,
        j.nome,
        j.posicao,
        j.foto,
        SUM(pp.gols) AS total_gols
      FROM ParticipacaoPartida pp
      JOIN Jogador j ON pp.jogador_id = j.id
      GROUP BY j.id
      ORDER BY total_gols DESC
      LIMIT 5;
    `);

    res.json({
      totalJogadores: jogadores[0].total_jogadores,
      totalPartidas: partidas[0].total_partidas,
      totalGols: gols[0].total_gols,
      mediaGolsPorJogo,
      artilheiros,
    });
  } catch (error) {
    console.error("❌ Erro ao buscar dados do dashboard:", error);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
});

export default router;
