import express from "express";
import cors from "cors";
import { router as jogadoresRouter } from "./routes/jogadores.js"; 
import { router as turmasRouter } from "./routes/turmas.js";
import { router as partidasRouter } from "./routes/partidas.js";
import { router as participacoesRouter } from "./routes/participacoes.js";
import { router as artilhariaRouter } from "./routes/artilharia.js";
import { router as excecoesRouter } from "./routes/excecoes.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();
app.use(cors({
  origin: ["https://seu-front.onrender.com", "http://localhost:8080"],
  credentials: true,
}));
app.use(express.json());

app.use(jogadoresRouter); 
app.use("/api/turmas", turmasRouter);
app.use("/api/excecoes-partidas", excecoesRouter);
app.use("/api/partidas", partidasRouter);
app.use("/api/participacoes", participacoesRouter);
app.use("/api/artilharia", artilhariaRouter);
app.use(dashboardRoutes);

app.get("/", (req, res) => res.send("Servidor rodando!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

